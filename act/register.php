<?php 
	//header("Content-type:text/html;charset=utf-8");
	include_once("serverinfo.php");
	//ignore_user_abort (false);//脚本结束后，自动删除mysql连接
	$act = $_GET['act'];
	if("chkun" == $act){
		$ret = chkexistsfunc();
	}
	else if("reg" == $act){
		$ret = registerfunc();
	}
	echo json_encode($ret);

	function chkexistsfunc(){
		global $db_host, $db_port, $db_user, $db_pass, $db_name;
		$ret = array('code'=>0, 'msg'=>"this account already exists", 'url'=>'');
		$val = $_GET['kval'];
		$_mysqli = new mysqli();
		$_mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, 2);//设置超时
		$_mysqli->connect("$db_host:$db_port", $db_user, $db_pass, $db_name);
		if($_mysqli->errono){
			$ret['msg'] = 'Unable to connect to the Mysql: '.$_mysqli->error;
			return $ret;
		}
		$sql = "select uname from users where uname='$val' or uemail='$val';";
		$_result = $_mysqli->query($sql);
		if(!$_result){
			$ret['msg'] = 'check failed: '.$_mysqli->error;
			$_mysqli->close();
			return $ret;
		}
		$row = $_result->fetch_assoc();
		if(count($row) == 0){
			$ret['code']=1;
			$ret['msg']='success';
		}
		else{
			$ret['code']=0;
			$ret['msg']='this account already exists';
		}
		$_result->free();
		$_mysqli->close();
		return $ret;
	}

	function registerfunc(){
		global $db_host, $db_port, $db_user, $db_pass, $db_name;
		$ret = array('code'=>0, 'msg'=>"invalid operation: {$act}", 'url'=>'');
		$name=$_GET['knm'];
		$passwd=$_GET['kpw'];
		$email=$_GET['kem'];
		$conn = mysqli_connect("$db_host:$db_port", $db_user, $db_pass, $db_name);
		if(!$conn){
			$ret['msg'] = 'Unable to connect to the Mysql: '.mysql_error();
			return $ret;
		}
		//$res = mysqli_select_db($db_name, $conn);
		//if(!$res){
		//	$ret['msg'] = 'database no exists: ' + mysql_errno();
		//	mysql_close();
		//	return $ret;
		//}
		$stmt = mysqli_prepare($conn, "insert into users(uname, uemail, password, time) values(?, ?, ?, NOW());");
		if($stmt){
			mysqli_stmt_bind_param($stmt, "sss", $name, $email, $passwd);
			mysqli_stmt_execute($stmt);
			$row = mysqli_stmt_affected_rows($stmt);
			if($row == 1){
				$ret['code']=1;
				$ret['msg']='register success';
				$ret['url']='index.html';
			}
			else{
				$ret['msg'] = 'register failed: '.mysqli_stmt_error($stmt);
			}
			mysqli_stmt_close($stmt);
		}
		else{
			$ret['msg'] = 'register failed: '.mysqli_error($conn);
		}
		mysqli_close($conn);
		return $ret;
	}

?>