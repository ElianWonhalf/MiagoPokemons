    </section>
    <footer class="main-footer">
        <p>
            Miago Pokemons&copy; 2016 - All rights reserved.
        </p>
    </footer>

    <?php
    if ($bAdmin) {
        echo '
            <script type="text/javascript" src="../js/functions.js"></script>
            <script type="text/javascript" src="js/main.js"></script>
        ';
    } else {
        echo '
            <script type="text/javascript" src="js/lightbox.min.js"></script>
            <script type="text/javascript" src="js/functions.js"></script>
            <script type="text/javascript" src="js/main.js"></script>
        ';
    }
    ?>
</body>
</html>