    </section>
    <footer class="main-footer container">
        <p>
            Design & graphical content (including drawings) by <a href="https://twitter.com/MiagoArts" target="_blank">Miago</a> - Website by <a href="https://github.com/LilyWonhalf" target="_blank">Lily Wonhalf</a> - All rights reserved.
        </p>
    </footer>

    <?php

    if ($bAdmin) {
        echo '
            <script type="text/javascript" src="../js/functions.js?cacheid=' . $sCacheId . '"></script>
            <script type="text/javascript" src="js/main.js?cacheid=' . $sCacheId . '"></script>
        ';
    } else {
        echo '
            <script type="text/javascript" src="js/lightbox.js?cacheid=' . $sCacheId . '"></script>
            <script type="text/javascript" src="js/functions.js?cacheid=' . $sCacheId . '"></script>
            <script type="text/javascript" src="js/main.js?cacheid=' . $sCacheId . '"></script>
        ';
    }

    ?>
</body>
</html>
