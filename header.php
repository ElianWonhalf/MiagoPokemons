<?php

require_once('database.php');
require_once('functions.php');

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />

    <title>Miago Pokemons</title>

    <link href='https://fonts.googleapis.com/css?family=Roboto:400,400italic,700,700italic,300,300italic' rel='stylesheet' type='text/css'>

    <?php

    $sRootDir = __DIR__;
    $sRootUri = '';
    $sCacheId = '2.3';

    if ($bAdmin) {
        $sRootDir = dirname(__DIR__);
        $sRootUri = '../';
    }

    ?>

    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Work+Sans" />
    <link rel="stylesheet" type="text/css" href="<?php echo $sRootUri; ?>css/screen.css?cacheid=<?php echo $sCacheId; ?>" />

    <!--[if lt IE 9]>
    <script src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js" type="text/javascript"></script>
    <![endif]-->

    <script type="text/javascript">
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-93095255-1', 'auto');
        ga('send', 'pageview');
    </script>
</head>
<body>
<header class="main-header">
    <h1 class="main-title container">
        <a href="/">
            <img src="<?php echo $sRootUri; ?>img/design/header.png?cacheid=<?php echo $sCacheId; ?>" alt="Miago Arts" id="header-background" />

            <a href="https://twitch.tv/doctormiawoo" id="header-twitch" target="_blank">
                <img src="<?php echo $sRootUri; ?>img/design/header_twitch.png?cacheid=<?php echo $sCacheId; ?>" alt="Miago Arts on Twitch" />
            </a>

            <a href="https://twitter.com/MiagoArts" id="header-twitter" target="_blank">
                <img src="<?php echo $sRootUri; ?>img/design/header_twitter.png?cacheid=<?php echo $sCacheId; ?>" alt="Miago Arts on Twitter" />
            </a>
        </a>
    </h1>
</header>
<section class="container main-content">
    <header>
        <h2>
            Someone asked me if I could...
        </h2>
        <h3>
            ... Draw all the Pokemon
        </h3>
    </header>