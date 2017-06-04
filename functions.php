<?php

/**
 * @param PDO $oDbh
 * @param int $iPage
 * @return string
 */
function getHowManyPokemons(PDO $oDbh)
{
    $sSql = 'SELECT COUNT(*) FROM `pokemon` WHERE `active`=:active ORDER BY `position`';
    $oSth = $oDbh->prepare($sSql);

    $oSth->execute(
        array(
            'active' => 1,
        )
    );

    return $oSth->fetchColumn(0);
}

/**
 * @param PDO $oDbh
 * @param int $iPage
 * @return string
 */
function getPokemonsHTML(PDO $oDbh, int $iPage)
{
    $sHTML = '';
    $iFrom = ($iPage - 1) * 50;
    $sSql = 'SELECT * FROM `pokemon` WHERE `active`=:active ORDER BY `position` LIMIT ' . $iFrom . ', 50';
    $oSth = $oDbh->prepare($sSql);

    $oSth->execute(
        array(
            'active' => 1,
        )
    );

    $aPokemons = $oSth->fetchAll();

    for ($i = 0; $i < count($aPokemons); $i++) {
        $sName = $aPokemons[$i]['name'];
        $iPosition = (int) $aPokemons[$i]['position'];
        $bDrawn = $aPokemons[$i]['drawn'] == '1';

        $iSpriteIndex = floor(($iPosition - 1) / 50);
        $iSpriteOffset = (($iPosition - 1) % 50) * 200;

        $sHTML .= '<div class="pokemon" title="' . $sName . '" style="';

        if ($bDrawn) {
            $sHTML .= 'background: none;">';

            $sFilePath = 'img/pokemons/drawn/' . $iPosition;
            $sThumbExtension = '.jpg';
            $sHdExtension = '.jpg';

            if (file_exists('img/pokemons/drawn/' . $iPosition . '.png')) {
                $sHdExtension = '.png';
            }

            if (file_exists('img/pokemons/drawn/' . $iPosition . '@thumb.png')) {
                $sThumbExtension = '.png';
            }

            $sHTML .= '<img src="' . $sFilePath . '@thumb' . $sThumbExtension . '" data-jslghtbx="' . $sFilePath . $sHdExtension . '" data-jslghtbx-group="pokemons" alt="' . $sName . '" />';
        } else {
            $sHTML .= 'background-image: url(\'img/pokemons/vanilla/' . $iSpriteIndex . '.png\'); background-position: 0 -' . $iSpriteOffset . 'px;">';
        }

        $sHTML .= '</div>';
    }

    return $sHTML;
}