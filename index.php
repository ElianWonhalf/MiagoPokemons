<?php
$bAdmin = false;
require_once('header.php');
?>
<div class="pokemons">
    <?php
    if ($bConnected) {
        $sSql = 'SELECT * FROM `pokemon` WHERE `active`=:active ORDER BY `position`';
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
            $sDrawnDate = $aPokemons[$i]['drawn_date'];

            $iSpriteIndex = floor(($iPosition - 1) / 50);
            $iSpriteOffset = (($iPosition - 1) % 50) * 200;

            echo '<div class="pokemon" title="' . $sName . '" style="';

            if ($bDrawn) {
                echo 'background: none;">';

                $sFilePath = 'img/pokemons/drawn/' . $iPosition;
                $sThumbExtension = '.jpg';
                $sHdExtension = '.jpg';

                if (file_exists('img/pokemons/drawn/' . $iPosition . '.png')) {
                    $sHdExtension = '.png';
                }

                if (file_exists('img/pokemons/drawn/' . $iPosition . '@thumb.png')) {
                    $sThumbExtension = '.png';
                }

                echo '<img src="' . $sFilePath . '@thumb' . $sThumbExtension . '" data-jslghtbx="' . $sFilePath . $sHdExtension . '" data-jslghtbx-group="pokemons" alt="' . $sName . '" />';
            } else {
                echo 'background-image: url(\'img/pokemons/vanilla/' . $iSpriteIndex . '.png\'); background-position: 0 -' . $iSpriteOffset . 'px;">';
            }

            echo '</div>';
        }
    } else {
        echo 'An error occured, I\'m sorry. I\'m doing all I can to fix it right now!';
    }
    ?>
</div>
<?php require_once('footer.php'); ?>