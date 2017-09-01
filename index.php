<?php

$bAdmin = false;
require_once('header.php');

?>
<div id="pokemons">
    <?php
    if ($bConnected) {
        $iHowManyPokemons = getHowManyPokemons($oDbh);

        echo '<script type="text/javascript">var howManyPokemons = ' . $iHowManyPokemons . ', nextPage = 2;</script>';

        echo getPokemonsHTML($oDbh, 1);
    } else {
        echo 'An error occured, I\'m sorry. I\'m doing all I can to fix it right now!';
    }
    ?>
</div>
<div id="infinitescroll-loader" style="display: none;">
    <img src="img/design/loading-black.svg" alt="Loading..." title="Loading..." class="loading-animation" />
</div>
<?php require_once('footer.php'); ?>