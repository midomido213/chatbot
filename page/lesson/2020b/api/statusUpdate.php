<?php
session_start();
//
require_once ($_SERVER['DOCUMENT_ROOT'] . '/chatbot/config/config.php');

// ログイン状態チェック
if (!isset($_SESSION["userId"])) {
    // header("Location: https://tkg-lab.tk/chatbot/page/Logout.php");
    // exit;
}else{
  // header("Location: https://tkg-lab.tk/chatbot/page/");
}

date_default_timezone_set('Asia/Tokyo');

$name = $_SESSION['userId'];
$value = $_POST['tmp'];

$errorMessage = '';

$dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);
try{
  $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));
  $stmt = $pdo->prepare('UPDATE `status` SET `status` = ? WHERE `status` . `name` = ?;');
  $stmt->execute([$value, $name]);
}catch(PDOException $e){
  $errorMessage = 'エラーです';
}
?>
<!DOCTYPE html>
<html>
<body>
  <?php echo $errorMessage; ?>
  <?php echo var_dump($value); ?>
  <?php echo var_dump($name); ?>
</body>
</html>
