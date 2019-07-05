<?php
session_start();

// ログイン状態チェック
if (!isset($_SESSION["NAME"]) && !isset($_SESSION["ID"])) {
    header("Location: https://takagi-lab.tk/chatbot/page/Logout.php");
    exit;
}else{
  header("Location: https://takagi-lab.tk/chatbot/page/");
}

date_default_timezone_set('Asia/Tokyo');

$word = $_REQUEST['log'] . "\n";

 ?>
