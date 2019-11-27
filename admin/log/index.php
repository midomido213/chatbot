<?php
session_start();

require_once ($_SERVER['DOCUMENT_ROOT'] . '/chatbot/config/config.php');

// ログイン状態チェック
if (!isset($_SESSION["userId"])) {
    header("Location: https://takagi-lab.tk/chatbot/page/Logout.php");
    exit;
}

// 管理者以外を弾く
$name = $_SESSION['userId'];
$dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);
try{
  $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));
  $stmt = $pdo->prepare('SELECT admin FROM userData WHERE name = ?');
  $stmt->execute(array($name));
  $admin = $stmt->fetchColumn();

  if($admin != 1){
    header("Location: https://takagi-lab.tk/chatbot/page/lesson/2019c/index.php");
    exit;
  }
}catch(PDOException $e){

}


//DB登録処理
$comment = $_POST['comment'];
$student = $_POST['student'];
$ta = $_POST['ta'];
try{
  $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

  $stmt = $pdo->prepare('INSERT INTO taComment (student, ta, comment) VALUES (?, ?, ?)');
  $stmt->execute(array($student, $ta, $comment));
}catch(PDOException $e){

}

?>

<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
      <title>情報基礎数学botのページ</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

      <link rel="stylesheet" href="https://takagi-lab.tk/chatbot/page/css/style.css" />
      <!-- <link rel="stylesheet" href="https://takagi-lab.tk/chatbot/page/css/table.css" /> -->

      <!-- UIkit CSS -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/css/uikit.min.css" />

      <!-- UIkit JS -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/uikit/3.0.3/js/uikit-icons.min.js"></script>
  </head>
  <body class="background">

    <section class="uk-section uk-dark uk-background-cover">

      <div class="title">
        <p><?php echo($_SESSION["userId"]); ?> でログイン中</p>
      </div>


      <!-- メイン表示部分 -->
      <section class="uk-section uk-section-xsmall">
        <div class="uk-container uk-container-large">
          <div class="uk-card uk-card-default uk-card-body uk-card-small">
            <h3>チャットログ閲覧ページ</h3>
            <div>
              <div>
                <form class="uk-form-horizontal" action="index.php" method="post">
                  <div class="uk-margin">
                    <label class="uk-form-label" for="form-horizontal-select">授業回：</label>
                    <div class="uk-form-controls">
                      <select class="uk-select" id="form-horizontal-select" name="lesson">
                        <option value="8">8</option>
                        <option value="7">7</option>
                        <option value="6">6</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                      </select>
                    </div>
                  </div>
                  <div class="uk-margin">
                    <label class="uk-form-label" for="form-horizontal-select">グループ：</label>
                    <div class="uk-form-controls">
                      <select class="uk-select" id="form-horizontal-select" name="group">
                        <option value="0">0(テスト用)</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                      </select>
                    </div>
                  </div>
                  <button class="uk-button uk-button-default" type="submit">表示</button>
                </form>
              </div>
              <div>
                <p> </p>
                <p>TAは自分のグループのチャットログを見て，補足説明してほしい学生がいたら対応してみてください．</p>
                <p>理解度は，０（デフォルト値：問題なし），１（全く分からない），２（少し分からない），３（少し分かる），４（結構分かる）となってます．</p>
                <p>特に理解度が１と２になっている学生のログを見て声をかけてみてください．</p>
              </div>

            <div>
              <?php
                $dsn = sprintf('mysql: host=%s; dbname=%s; charset=utf8', $db['host'], $db['dbname']);
                $groupId = $_POST['group'];
                $lesson = $_POST['lesson'];
                try{
                  $pdo = new PDO($dsn, $db['user'], $db['pass'], array(PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION));

                  $stmt = $pdo->prepare('SELECT * FROM chatLog INNER JOIN groupData2019b ON chatLog.name = groupData2019b.userName WHERE groupId = ? AND lesson = ? ORDER BY level DESC');
                  $stmt->execute(array($groupId, $lesson));

                  while ($row = $stmt->fetch()) {
              ?>
              <table class="uk-table uk-table-divider">
              	<tbody>
              		<tr>
              			<th colspan="2"  width="15%">
                      <?php
                        if($row['support'] == 1){
                          echo '<span class="uk-label uk-label-success">対応済</span>';
                        }else{
                          echo '<span class="uk-label uk-label-warning">未対応</span>';
                        }
                      ?>
                    </th>
              			<th  width="30%">ボットログ</th>
              			<th  width="5%">ユーザーログ</th>
              			<th  width="15%">TA/SA入力部分</th>
              		</tr>
              		<tr>
              			<th>授業回</th>
              			<th><?php echo $row['lesson'] . '回'; ?></th>
              			<td rowspan="5"><?php echo nl2br($row['logBot']); ?></td>
              			<td rowspan="5"><?php echo nl2br($row['logHuman']); ?></td>
              			<td rowspan="5">
                      <form action="index.php" method="post">
                        <textarea class="uk-textarea" name="comment"></textarea>
                        <input type="hidden" name="student" value="<?php echo $row['name']; ?>"/>
                        <input type="hidden" name="ta" value="<?php echo $_SESSION['userId']; ?>"/>
                        <button class="uk-button uk-button-default" type="submit">登録</button>
                      </form>
                    </td>
              		</tr>
              		<tr>
              			<th>ユーザ名</th>
              			<th style="text-transform: none!important;"><?php echo $row['name']; ?></th>
              		</tr>
              		<tr>
              			<th>グループ</th>
              			<th><?php echo $row['groupId']; ?></th>
              		</tr>
              		<tr>
              			<th>理解度</th>
              			<th><?php echo $row['level']; ?></th>
              		</tr>
              		<tr>
              			<th>タイムスタンプ</th>
              			<th><?php echo $row['timestamp']; ?></th>
              		</tr>
              	</tbody>
                <?php
                    }
                  }catch(PDOException $e){
                    $errorMessage = 'エラーです';
                  }
                ?>
              </table>
            </div>


            <div>
              <button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom" onclick="location.href='../'">戻る</button>
            </div>
          </div>
        </div>
      </section>

    </section>

    <!-- <script src="https://cdn.jsdelivr.net/vue/latest/vue.min.js"></script>
    <script src="../js/botui.min.js"></script>
    <script src="../js/bot_dev.js"></script> -->

  </body>
</html>
