<?php
session_start();
//
require_once ($_SERVER['DOCUMENT_ROOT'] . '/chatbot/config/config.php');

// ログイン状態チェック
if (!isset($_SESSION["userId"])) {
    header("Location: https://tkg-lab.tk/chatbot/page/Logout.php");
    exit;
}else{
  header("Location: https://tkg-lab.tk/chatbot/page/");
}

date_default_timezone_set('Asia/Tokyo');

$name = $_SESSION['userId'];
$lesson = $_POST['lesson'];
$level = $_POST['level'];
$log_all = $_POST['log_all'];

$errorMessage = '';

$dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);
try{
  $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

  $stmt = $pdo->prepare('INSERT INTO chatLog (name, year, type, lesson, level, logAll) VALUES (?, 2020, "b", ?, ?, ?)');
  $stmt->execute([$name, $lesson, $level, $log_all]);
}catch(PDOException $e){
  $errorMessage = 'エラーです';
}
?>
<!DOCTYPE html>
<html>
<body>
</body>
</html>
