<?php
//header("Content-type:text/html;charset=utf-8");
include_once 'serverinfo.php';
//ignore_user_abort (false);//脚本结束后，自动删除mysql连接
$ret = array('code' => 0, 'msg' => "parameters request", 'url' => '');
if (!isset($_REQUEST['param'])) {
    echo json_encode($ret);

    return;
}

$param   = $_REQUEST['param'];
$arrJson = json_decode($param, true);
$act     = $arrJson['act'];
if ("chkun" == $act) {
    $ret = chkexistsfunc($arrJson);
} elseif ("reg" == $act) {
    $ret = registerfunc($arrJson);
}
echo json_encode($ret);

function chkexistsfunc($arr)
{
    //global $db_host, $db_port, $db_user, $db_pass, $db_name;
    $ret     = array('code' => 0, 'msg' => "this account already exists", 'url' => '');
    $val     = $arr['kval'];
    $_mysqli = new mysqli();
    $_mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, 2); //设置超时
    $_mysqli->connect(db_host . ":" . db_port, db_user, db_pass, db_name);
    if ($_mysqli->errono) {
        $ret['msg'] = 'Unable to connect to the Mysql: ' . $_mysqli->error;

        return $ret;
    }
    $sql     = "select uname from t_users where uname='$val' or uemail='$val';";
    $_result = $_mysqli->query($sql);
    if (!$_result) {
        $ret['msg'] = 'check failed: ' . $_mysqli->error;
        $_mysqli->close();

        return $ret;
    }
    $row = $_result->fetch_assoc();
    if (count($row) == 0) {
        $ret['code'] = 1;
        $ret['msg']  = 'success';
    } else {
        $ret['code'] = 0;
        $ret['msg']  = 'this account already exists';
    }
    $_result->free();
    $_mysqli->close();

    return $ret;
}

function registerfunc($arr)
{
    //global $db_host, $db_port, $db_user, $db_pass, $db_name;
    $ret    = array('code' => 0, 'msg' => "register failed", 'url' => '');
    $name   = $arr['knm'];
    $passwd = $arr['kpw'];
    $email  = $arr['kem'];
    $conn   = mysqli_connect(db_host . ":" . db_port, db_user, db_pass, db_name);
    if (!$conn) {
        $ret['msg'] = 'Unable to connect to the Mysql: ' . mysql_error();

        return $ret;
    }
    $stmt = mysqli_prepare($conn, "insert into t_users(uname, uemail, passwd, time) values(?, ?, ?, NOW());");
    if ($stmt) {
        mysqli_stmt_bind_param($stmt, 'sss', $name, $email, $passwd);
        mysqli_stmt_execute($stmt);
        $row = mysqli_stmt_affected_rows($stmt);
        if ($row == 1) {
            $ret['code'] = 1;
            $ret['msg']  = 'register success';
            $ret['url']  = 'index.html';
        } else {
            $ret['msg'] = 'register failed: ' . mysqli_stmt_error($stmt);
        }
        mysqli_stmt_close($stmt);
    } else {
        $ret['msg'] = 'register failed: ' . mysqli_error($conn);
    }
    mysqli_close($conn);

    return $ret;
}
