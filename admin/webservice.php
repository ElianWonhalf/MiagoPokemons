<?php
require_once('../database.php');

function getValue($sKey) {
    $mReturn = null;

    if (isset($_GET[$sKey])) {
        $mReturn = $_GET[$sKey];
    } else if (isset($_POST[$sKey])) {
        $mReturn = $_POST[$sKey];
    }

    return $mReturn;
}

$aReturn = array(
    'error' => true,
    'message' => 'Unable to connect to database',
);

if ($bConnected) {
    if (getValue('action') != null && strlen(getValue('action')) > 0) {
        switch (getValue('action')) {
            case 'getPokemonByPosition':
                if (getValue('position') != null && intval(getValue('position')) > 0) {
                    getPokemonByPosition((int) getValue('position'), getValue('variant'));
                } else {
                    $aReturn['message'] = 'Expected `position` variable, nothing or invalid value found';
                }
                break;

            case 'saveData':
                saveData();
                break;
        }
    } else {
        $aReturn['message'] = 'Expected `action` variable, nothing found';
    }
}

function saveData() {
    global $oDbh, $aReturn;

    $sUploadDir = dirname(__DIR__) . '/img/pokemons/drawn';
    $aDrawnPokemons = array();

    foreach ($_FILES as $sKey => $aFile) {
        if ($aFile['error'] == UPLOAD_ERR_OK) {
            $sIdentifier = str_replace('-thumb', '', str_replace('pokemon-', '', str_replace('-hd', '', $sKey)));
            $aDrawnPokemons[$sIdentifier] = true;
            $sTempName = $aFile['tmp_name'];
            $sName = $aFile['name'];

            $bSuccess = move_uploaded_file($sTempName, $sUploadDir . '/' . $sName);

            if (!$bSuccess) {
                die(json_encode($aReturn = array(
                    'error' => true,
                    'message' => 'File "' . $sName . '" ("' . $sTempName . '") did not upload successfully to "' . $sUploadDir . '/' . $sName . '"',
                )));
            }
        }
    }

    foreach (array_keys($aDrawnPokemons) as $sKey) {
        $aKey = explode('-', $sKey);
        $iPosition = (int) array_shift($aKey);
        $sVariant = 'none';

        if (count($aKey) > 0) {
            $sVariant = implode('-', $aKey);
        }

        $sSql = '
            INSERT INTO `drawn_pokemon`
            SELECT `id`, :variant, :drawn_date
            FROM `pokemon`
            WHERE `position` = :position
            ON DUPLICATE KEY UPDATE `drawn_date` = :drawn_date
        ';
        $oSth = $oDbh->prepare($sSql);
        $oSth->execute(array(
            'variant' => $sVariant,
            'drawn_date' => date('Y-m-d'),
            'position' => $iPosition,
        ));
    }

    $aReturn = array(
        'error' => false,
        'message' => 'OK',
    );
}

function getPokemonByPosition($iPosition, $sVariant) {
    global $oDbh, $aReturn;

    $sRealVariant = null;

    if ($sVariant == null || $sVariant == 'null') {
        $sVariant = 'none';
    } else {
        $sRealVariant = $sVariant;
    }

    $sSql = '
        SELECT p.`id`, p.`name`, p.`position`, IF(dp.`variant` IS NOT NULL, 1, 0) AS "drawn", dp.`variant`, dp.`drawn_date`, p.`active`

        FROM `pokemon` p

        LEFT JOIN `drawn_pokemon` dp
        ON p.`id` = dp.`id_pokemon`
        AND dp.`variant` = :variant

        WHERE p.`active` = :active
        AND p.`position` = :position
    ';
    $oSth = $oDbh->prepare($sSql);

    $oSth->execute(
        array(
            'variant' => $sVariant,
            'active' => 1,
            'position' => $iPosition,
        )
    );

    $aPokemon = $oSth->fetch();

    if ($aPokemon !== false) {
        $aReturn = array(
            'error' => false,
            'message' => 'OK',
            'data' => array(
                'id' => $aPokemon['id'],
                'name' => $aPokemon['name'],
                'variant' => $sRealVariant,
                'position' => (int) $iPosition,
                'drawn' => $aPokemon['drawn'] == '1',
                'drawn_date' => $aPokemon['drawn_date'],
                'active' => $aPokemon['active'] == '1',
            ),
        );
    } else {
        $aReturn['message'] = 'Pokemon not found';
    }
}

echo json_encode($aReturn);