<?php
session_start();

// ログイン状態チェック
if (!isset($_SESSION["NAME"]) && !isset($_SESSION["ID"])) {
    header("Location: https://takagi-lab.tk/chatbot/page/Logout.php");
    exit;
}else{
  header("Location: https://takagi-lab.tk/chatbot/page/");
}

// $log = $_POST['log'] . "\n";
// $log = 'あいうえお．' . "\n" ;

date_default_timezone_set('Asia/Tokyo');

$log = $_REQUEST['log'] . "\n";
$pass = "../log/2019c12/" . $_SESSION["NAME"] . ".txt";

file_put_contents($pass, $log, FILE_APPEND | LOCK_EX);
// readfile($pass);
