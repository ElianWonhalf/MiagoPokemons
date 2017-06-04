<?php

$sDsn = 'mysql:dbname=database_name;host=database_host';
$sUser = 'user';
$sPassword = 'password';
$bConnected = false;
$oDbh = null;

try {
    $oDbh = new PDO($sDsn, $sUser, $sPassword);
    $bConnected = true;
} catch (PDOException $e) {
    $bConnected = false;
}