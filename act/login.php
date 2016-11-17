<?php
include_once 'serverinfo.php';

$ret = array('code' => 0, 'msg' => "parameters request", 'url' => '');
if (!isset($_REQUEST['param'])) {
    echo json_encode($ret);

    return;
}

$param   = $_REQUEST['param'];
$arrJson = json_decode($param, true);
$act     = $arrJson['act'];
if ('login' == $act) {
    $ret = loginFunc($arrJson);
    echo json_encode($ret);
} elseif ('logout' == $act) {
    logoutFunc();
}

function loginFunc($arr)
{
    $ret   = array('code' => 0, 'msg' => "login failed", 'url' => '');
    $email = $arr['kid'];
    $pwd   = $arr['kval'];

    try {
        $db = new PDO(db_dsn, db_user, db_pass);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false); //禁用prepared statements的仿真效果，达到防止注入目的
        $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);

        $sql   = "select uid, uname, passwd from t_users where (uname=? or uemail=?) and passwd=?;";
        $stmt  = $db->prepare($sql);
        $param = array($email, $email, $pwd);
        $res   = $stmt->execute($param);

        if (!$res) {
            $ret['code'] = 0;
            $ret['msg']  = $db->errorInfo();
        } elseif ($res) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$row) {
                $ret['code'] = 0;
                $ret['msg']  = 'this account/email does not exists';
            } elseif ($row['passwd'] != $pwd) {
                $ret['code'] = 0;
                $ret['msg']  = 'password is error, please re-input';
            } else {
                $ret['code'] = $row['uid'];
                session_start();
                $_SESSION['user'] = $row['uname'];
                $_SESSION['uid']  = $row['uid'];
                $ret['msg']       = 'login success';
                $ret['url']       = 'html/main.html';
                $sql              = "update t_users set lastLoginTime=now() where uname='{$email}' or uemail='{$email}';";
                $db->exec($sql);
            }
        }

        return $ret;
    } catch (PDOException $e) {
        $ret['code'] = 0;
        $ret['msg']  = $e->getMessage();
        $ret['url']  = '';

        return $ret;
    }
}

function logoutFunc()
{
    session_decode();
    $ret = array('code' => 1, 'msg' => "logout success", 'url' => '/index.php');
    echo json_encode($ret);
}
