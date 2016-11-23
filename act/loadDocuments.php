<?php 
include_once 'serverinfo.php';
include_once 'log.php';
include_once 'mysql.php';

if(!isset($_REQUEST['param'])){
	$ret = array('code' => 0, 'msg' => "parameters request", 'url' => '');
	echo json_encode($ret);
	return;
}

$param = $_REQUEST['param'];
$arrJson = json_decode($param, true);
$dircode = $arrJson['pid'] ? $arrJson['pid']:'1';
$uid = $arrJson['uid'] ? $arrJson['uid']:'1';
$code = $arrJson['code'] ? $arrJson['code']:'0';
if($code == 0)
	loadDirectories($uid, $dircode);
else if($code == 1)
	loadFiles($uid, $dircode);
else if($code == 2)
	loadPubFiles();

function loadDirectories($uid, $dircode)
{
	$sql = "SELECT did, dname from t_directories where did in(select did from t_dir_user where pid=? and uid=?);";
	$dbinfo = array('host'=>db_host, 'port'=>db_port, 'user'=>db_user, 'password'=>db_pass, 'dbname'=>db_name);
	$link = new mysql($dbinfo);
	$param = array($dircode, $uid);
	$data = $link->getAll($sql, $param);
	$data['type']='0';
	echo json_encode($data);
}

function loadFiles($uid, $dircode)
{
	$sql = "SELECT fname, fsize from t_files where fid in(SELECT fid from t_file_dir_user where did=? and uid=?);";
	$dbinfo = array('host'=>db_host, 'port'=>db_port, 'user'=>db_user, 'password'=>db_pass, 'dbname'=>db_name);
	$link = new mysql($dbinfo);
	$param = array($dircode, $uid);
	$data = $link->getAll($sql, $param);
	$data['type']='1';
	
	echo json_encode($data);
}

function loadPubFiles()
{
	$sql = "SELECT fname, fsize from t_pub_files;";
	$dbinfo = array('host'=>db_host, 'port'=>db_port, 'user'=>db_user, 'password'=>db_pass, 'dbname'=>db_name);
	$link = new mysql($dbinfo);
	$param = array();
	$data = $link->getAll($sql, $param);
	$data['type']='2';
	echo json_encode($data);
}


