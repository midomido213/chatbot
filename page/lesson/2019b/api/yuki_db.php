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

$name = $_SESSION['NAME'];
$lesson = $_POST['lesson'];
$targetScore = $_POST['targetScore'];
$actualScore = $_POST['actualScore'];
$freeDescription = $_POST['freeDescription'];

$errorMessage = '';

$dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);
try{
  $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

  $stmt = $pdo->prepare('INSERT INTO reflection (name, lesson, targetScore, actualScore, freeDescription) VALUES (?, ?, ?, ?, ?)');
  $stmt->execute([$name, $lesson, $targetScore, $actualScore, $freeDescription]);
}catch(PDOException $e){
  $errorMessage = 'エラーです';
}
?>
<!DOCTYPE html>
<html>
<body>
</body>
</html>
