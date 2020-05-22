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

$name = $_SESSION['userId'];
$exam1 = $_POST['test1'];
$exam2 = $_POST['test2'];
$exam3 = $_POST['test3'];
$exam4 = $_POST['test4'];
$exam5 = $_POST['test5'];
$exam6 = $_POST['test6'];
$exam7 = $_POST['test7'];
$reExam1 = $_POST['retest1'];
$reExam2 = $_POST['retest2'];
$reExam3 = $_POST['retest3'];
$reExam4 = $_POST['retest4'];
$reExam5 = $_POST['retest5'];
$reExam6 = $_POST['retest6'];
$reExam7 = $_POST['retest7'];

$errorMessage = '';

$dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);
try{
  $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

  $stmt = $pdo->prepare('INSERT INTO exam2020c (name, exam1, exam2, exam3, exam4, exam5, exam6, exam7, reExam1, reExam2, reExam3, reExam4, reExam5, reExam6, reExam7) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  $stmt->execute([$name, $exam1, $exam2, $exam3, $exam4, $exam5, $exam6, $exam7, $reExam1, $reExam2, $reExam3, $reExam4, $reExam5, $reExam6, $reExam7]);
}catch(PDOException $e){
  $errorMessage = 'エラーです';
}
?>
<!DOCTYPE html>
<html>
<body>
</body>
</html>
