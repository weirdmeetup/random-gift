<?php

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>돌려돌려</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
</head>
<body>
<style>
    .wrap {
        margin: 20px;
    }

    .row {
        margin: 0;
        width: 1000px;
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
<div class="wrap">

    <div class="row">
        <form class="form-horizontal" action="./result.php" method="POST" enctype="multipart/form-data">
            <div class="form-group">
                <label for="ipt_file" class="control-label col-sm-2">CSV 파일</label>
                <div class="col-sm-6">
                    <input type="file" id="ipt_file" class="form-control" name="ipt_file">
                </div>
                <div class="col-sm-2">
                    <input type="button" class="btn btn_add_prize" value="+">
                </div>

            </div>
            <div class="form-group prize_form_default prize">
                <label for="ipt_prize_1" class="control-label col-sm-2">상품</label>
                <div class="col-sm-4">
                    <input type="input" id="ipt_prize_1" class="form-control prize_name">
                </div>
                <div class="col-sm-2">
                    <select id="ipt_prize_1_count" class="form-control prize_count">
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
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div class="col-sm-2">
                    <input type="button" class="btn btn_remove_prize" value="-">
                </div>
            </div>


            <div class="form-group">
                <div class="col-sm-2"></div>
                <div class="col-sm-8">
                    <input type="hidden" value="" class="ipt_data" name="data">
                    <input type="button" value="돌려돌려" class="btn btn_default btn_lottery">
                </div>
            </div>
        </form>
    </div>
</div>
<div class="template">
    <div class="form-group prize_form prize">
        <label for="ipt_prize_[num]" class="control-label col-sm-2">상품</label>
        <div class="col-sm-4">
            <input type="input" id="ipt_prize_[num]" class="form-control prize_name">
        </div>
        <div class="col-sm-2">
            <select id="ipt_prize_[num]_count" class="form-control prize_count">
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
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
            </select>
        </div>
        <div class="col-sm-2">
            <input type="button" class="btn btn_remove_prize" value="-">
        </div>
    </div>
</div>
<script>
    var blyse = {
        "template": $(".template").html(),
        "num": 0
    }

    $(document).ready(function () {
        $('.template').remove();
        $(".btn_add_prize").on("click", function () {
            blyse.num++;
            var _tmp = blyse.template;
            _tmp = _tmp.replace('[num]', blyse.num).replace('[num]', blyse.num).replace('[num]', blyse.num);
            $("div.prize_form_default:last").after(_tmp);
        });
        $(document).on("click", "div.prize_form input.btn_remove_prize", function () {
            $(this).closest('div.prize_form').remove();
        });

        $(".btn_lottery").on("click", function () {
            var data = [];
            var prizes = $("div.prize");
            for (var idx = 0; idx < prizes.length; idx++) {
                var prize_name = prizes.eq(idx).find("input.prize_name").val();
                var prize_count = prizes.eq(idx).find("select.prize_count").val();
                var _tmp = {
                    "prize_name": prize_name,
                    "prize_count": prize_count
                };
                data.push(_tmp);
            }


            $("input.ipt_data").val(JSON.stringify(data));
            $("form").submit();


        });
    })
</script>
</body>
</html>
