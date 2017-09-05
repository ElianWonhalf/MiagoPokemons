<?php

$bAdmin = false;
require_once('header.php');

?>
<input type="radio" name="lang" id="lang-en" checked="checked" />
<input type="radio" name="lang" id="lang-fr" />

<label for="lang-en">EN</label>
<span id="lang-switch"></span>
<label for="lang-fr">FR</label>

<div id="pokemons">
    <?php
    if ($bConnected) {
        $iHowManyPokemons = getHowManyPokemons($oDbh);

        echo '<script type="text/javascript">var howManyPokemons = ' . $iHowManyPokemons . ', nextPage = 2;</script>';

        echo getPokemonsHTML($oDbh, 1);
    } else {
        echo '<div lang="en">An error occured, I\'m sorry. I\'m doing all I can to fix it right now!</div>';
        echo '<div lang="fr">Une erreur est survenue, je suis désolé. Je fais tout ce que je peux pour la fixer de suite !</div>';
    }
    ?>
</div>
<div id="infinitescroll-loader" style="display: none;">
    <img src="img/design/loading-black.svg" alt="Loading..." title="Loading..." class="loading-animation" />
</div>

<?php require_once('footer.php'); ?>