    </section>
    <footer class="main-footer container">
        <p>
            Design & graphical content (including drawings) by <a href="https://twitter.com/MiagoArts" target="_blank">Miago</a> - Website by <a href="https://github.com/ElianWonhalf" target="_blank">Elian Wonhalf</a> - All rights reserved.
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