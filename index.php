<?php
session_start();

// ログイン状態チェック
if (!isset($_SESSION["NAME"]) && !isset($_SESSION["ID"])) {
    header("Location: https://tkg-lab.tk/chatbot/page/Logout.php");
    exit;
}else{
  header("Location: https://tkg-lab.tk/chatbot/page/Login.php");
}
?>
