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
                    getPokemonByPosition((int) getValue('position'));
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
            $iPosition = str_replace('-thumb', '', str_replace('pokemon-', '', $sKey));
            $aDrawnPokemons[$iPosition] = true;
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
        $sSql = 'UPDATE `pokemon` SET `drawn`=:drawn, `drawn_date`=:drawn_date WHERE `position`=:position';
        $oSth = $oDbh->prepare($sSql);
        $oSth->execute(array(
            'drawn' => '1',
            'drawn_date' => date('Y-m-d'),
            'position' => $sKey,
        ));
    }

    $aReturn = array(
        'error' => false,
        'message' => 'OK',
    );
}

function getPokemonByPosition($iPosition) {
    global $oDbh, $aReturn;

    $sSql = 'SELECT * FROM `pokemon` WHERE `active`=:active AND `position`=:position';
    $oSth = $oDbh->prepare($sSql);

    $oSth->execute(
        array(
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
                'position' => (int)$aPokemon['position'],
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