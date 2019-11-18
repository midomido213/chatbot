<?php
session_start();
//
require_once ($_SERVER['DOCUMENT_ROOT'] . '/chatbot/config/config.php');

// ログイン状態チェック
if (!isset($_SESSION["userId"])) {
    header("Location: https://takagi-lab.tk/chatbot/page/Logout.php");
    exit;
}else{
  header("Location: https://takagi-lab.tk/chatbot/page/");
}

date_default_timezone_set('Asia/Tokyo');

$userId = $_SESSION['userId'];
// $coverage = $_POST['lesson'];
$classDate = new DateTime('2019-11-21 14:40:00', new DateTimeZone('Asia/Tokyo'));
$classDate = $classDate->format('U');
$goal = $_POST['targetScore'];
$testScore = $_POST['actualScore'];
// $freeDescription = $_POST['freeDescription'];

$errorMessage = '';

$dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $ishi['host'], $ishi['dbname']);
try{
  $pdo = new PDO($dsn, $ishi['user'], $ishi['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

  $stmt = $pdo->prepare('INSERT INTO chatbot (userId, classDate, goal, testScore) VALUES (?, ?, ?, ?)');
  $stmt->execute([$userId, $goal, $testScore]);
}catch(PDOException $e){
  $errorMessage = 'エラーです';
}
?>
<!DOCTYPE html>
<html>
<body>
</body>
</html>
