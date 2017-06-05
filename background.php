<?php

$sBackgroundsFolder = __DIR__ . '/img/design/backgrounds';

$rDirectory = opendir($sBackgroundsFolder);
$aFiles = array();

while ($sFile = readdir($rDirectory)) {
    if (!in_array($sFile, array('.', '..'))) {
        $aFiles[] = $sFile;
    }
}

closedir($rDirectory);

$iRand = array_rand($aFiles);
$sBackgroundUrl = $sBackgroundsFolder . '/' . $aFiles[$iRand];

header('Content-Type: image/png');
header('Content-Length: ' . filesize($sBackgroundUrl));

readfile($sBackgroundUrl);
exit();
