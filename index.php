<?php

$bAdmin = false;
require_once('header.php');

?>
<div class="pokemons">
    <?php
    if ($bConnected) {
        echo getPokemonsHTML($oDbh, 1);
    } else {
        echo 'An error occured, I\'m sorry. I\'m doing all I can to fix it right now!';
    }
    ?>
</div>
<?php require_once('footer.php'); ?>