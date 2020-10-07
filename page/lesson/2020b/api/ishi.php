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

$userId = $_SESSION['userId'];
$classDate = $_POST['classDate'];
$goal = $_POST['targetScore'];
$testScore = $_POST['actualScore'];
$satisfaction = $_POST['satisfaction'];
$reflection = $_POST['reflection'];

$errorMessage = '';

$dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $ishi['host'], $ishi['dbname']);
try{
  $pdo = new PDO($dsn, $ishi['user'], $ishi['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

  $stmt = $pdo->prepare('INSERT INTO chatbot (userId, classDate, goal, testScore, satisfaction, reflection) VALUES (?, ?, ?, ?, ?, ?)');
  $stmt->execute([$userId, $classDate, $goal, $testScore, $satisfaction, $reflection]);
}catch(PDOException $e){
  $errorMessage = 'エラーです';
}
?>
<!DOCTYPE html>
<html>
<body>
</body>
</html>
