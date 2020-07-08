<?php
session_start();
//
require_once ($_SERVER['DOCUMENT_ROOT'] . '/chatbot/config/config.php');

// ログイン状態チェック
if (!isset($_SESSION["userId"])) {
    header("Location: https://tkg-lab.tk/chatbot/page/Logout.php");
    exit;
}else{
  // header("Location: https://tkg-lab.tk/chatbot/page/");
}

date_default_timezone_set('Asia/Tokyo');
header('Content-Type: text/html; charset=UTF-8');

$userId = $_SESSION['userId'];
$coverge = $_GET['lesson'];
$subjects = '2020年基礎数学C';
$executing = '';

$errorMessage = '';

$dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $ishi['host'], $ishi['dbname']);
try{
  $pdo = new PDO($dsn, $ishi['user'], $ishi['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

  $stmt = $pdo->prepare('SELECT * FROM history WHERE userId = ? AND coverage = ? AND subjects = ?');
  $stmt->execute([$userId, $coverge, $subjects]);

  while($row =$stmt->fetch()){
    if($row['execting'] == NULL){
      $executing = 0;
    }else{
      $executing = $row['executing'];
    }
    $data = array('executing'=>$executing);
    echo json_encode($data, JSON_PRETTY_PRINT);
  }
}catch(PDOException $e){
  $errorMessage = 'エラーです';
  echo $errorMessage;
  echo var_dump($userId);
  echo var_dump($coverge);
  echo var_dump($subjects);
  echo var_dump($executing);
}
