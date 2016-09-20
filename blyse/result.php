<?php
/**
 * Created by PhpStorm.
 * User: blyse
 * Date: 2016. 9. 20.
 * Time: 오후 5:10
 */


if(!isset($_FILES['ipt_file']) || empty($_FILES['ipt_file'])) {
    echo json_encode(array('msg' => "CSV FILE IS NONE"));
    exit;
}

if(!isset($_POST['data']) || empty($_POST['data'])) {
    echo json_encode(array('msg' => "DATA IS NONE"));
    exit;
}
$csv_file = $_FILES['ipt_file'];
$body = json_decode($_POST['data'], true);

//$fp = fopen($csv_file['tmp_name'], 'r');
$people = array();
if (($fp = fopen($csv_file['tmp_name'], "r")) !== FALSE) {
    while (($data = fgetcsv($fp)) !== FALSE) {
        if (filter_var($data[0], FILTER_VALIDATE_EMAIL)) {
            array_push($people, $data[0]);
        }
    }
} else {
    echo json_encode(array('msg' => "CSV FILE IS NONE"));
    exit;
}

fclose($fp);
unlink($csv_file['tmp_name']);

$res = array();
foreach($body as $prize) {
    if(empty($prize['prize_name'])) {
        $prize['prize_name'] = "상품명은 없지만 넣어줄께 ".rand(0, 100);
    }
    $tmp = array('prize_name' => $prize['prize_name'], 'prize_winner' => array());
    for($idx = 1; $idx <= $prize['prize_count']; $idx++) {
        shuffle($people);
        if(count($people) == 0) {
            array_push($tmp['prize_winner'], "사람이 모자르네요.. 잘쓸께요 blythe2586@gm...");
        } else {
            $prize_winner = array_pop($people);
            array_push($tmp['prize_winner'], $prize_winner);
        }
        //echo $prize['prize_name']. " - " .$idx." - " . array_pop($people) ."<br>";
    }
    array_push($res, $tmp);
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>돌려돌려 결과창</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
<style>
    body {
        background: url("./bonobono.jpg") no-repeat;
        background-size: 100%;
    }
    .wrap {
        margin: 20px;
    }
    .row {
        margin: 0 auto;
        width: 500px;
    }
    .form-horizontal .form-group {
        margin: 0 0 10px 0;
    }
    .template {
        display: none;
    }
    .btn {
        width: 100%;
    }
</style>

</head>
<body>
<div class="wrap">
    <div class="row">
        <?php foreach($res as $prize) :?>
        <table class="table table-condensed table-bordered">
            <thead>
            <tr class="success">
                <td><?= $prize['prize_name'] ?></td>
            </tr>
            </thead>
            <tbody>
            <?php foreach($prize['prize_winner'] as $winner) :?>
            <tr class="info">
                <td><?= $winner ?></td>
            </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        <?php endforeach; ?>
    </div>

</div>
</body>

