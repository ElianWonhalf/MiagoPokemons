<?php
require_once('database.php');
require_once('functions.php');

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
            case 'getPokemons':
                if (getValue('page') != null && intval(getValue('page')) > 0) {
                    $aReturn = array(
                        'error' => false,
                        'html' => getPokemonsHTML($oDbh, (int) getValue('page')),
                    );
                } else {
                    $aReturn['message'] = 'Expected `page` variable, nothing or invalid value found';
                }

                break;

            case 'getVariants':
                if (getValue('position') != null && intval(getValue('position')) > 0) {
                    $aReturn = array(
                        'error' => false,
                        'variants' => getVariants($oDbh, (int) getValue('position')),
                    );
                } else {
                    $aReturn['message'] = 'Expected `position` variable, nothing or invalid value found';
                }
            break;

            default:
                $aReturn['message'] = 'Unknown action';
        }
    } else {
        $aReturn['message'] = 'Expected `action` variable, nothing found';
    }
}

echo json_encode($aReturn);