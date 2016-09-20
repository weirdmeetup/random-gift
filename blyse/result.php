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
//unlink($csv_file['tmp_name']);
foreach($body as $prize) {
    for($idx = 1; $idx <= $prize['prize_count']; $idx++) {
        shuffle($people);
        if(empty($prize['prize_name'])) {
            $prize['prize_name'] = "상품명은 없지만 넣어줄께";
        }
        echo $prize['prize_name']. " - " .$idx." - " . array_pop($people) ."<br>";
    }
}


?>