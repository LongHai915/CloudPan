<?php
	include_once("serverinfo.php");
	ignore_user_abort (false);//脚本结束后，自动删除mysql连接
  	$act=$_GET['act'];
	
	if('login' == $act){
		$ret = loginFunc();
		echo json_encode($ret);
	}
	else if('logout' == $act)
		logoutFunc();
	
	function loginFunc(){
		$ret = array('code'=>0, 'msg'=>"invalid operation: {$act}", 'url'=>'');
		$email = $_GET['kid'];
		$password = $_GET['kval'];	

		try {
			$dbc = new DBConn($dsn, $db_user, $db_pass); 
			$db = $dbc->getConnection();
			$sql = 'select uname, password from users where (uname=? or uemail=?) and password=?;';
			$stmt = $db->prepare($sql);
			$param = array($email, $email, $password);
			$excr = $stmt->execute($param);
			if(!$excr){
				$ret['msg'] = $db->errorInfo();
			}
			else if($exec){
				if($db->rowCount() == 0){
					$ret['code']=2;
					$ret['msg']='this account/email does not exists';
				}
				else if($db->rowCount() == 1){
					$row = $stmt->fetch(FETCH_ASSOC);
					if($row['password'] != $password){
						$ret['code']=3;
						$ret['msg']='password is error, please re-input';
					}
					else{
						$ret['code']=1;
						session_start();
						$_SESSION['user'] = $row['uname'];
						$ret['msg']='login success';
						$ret['url']='/html/main.html';
						mysql_query("update users set lastLoginTime=now() where uname={$email} or uemail={$email};");
					}
				}
			}
			return $ret;
		} 
		catch (PDOException $e) {
		    $ret['msg'] = $e->getMessage();
		    return $ret;
	  	}
	}

	function logoutFunc(){
		session_decode();
		$ret = array('code'=>1, 'msg'=>"logout success", 'url'=>'/index.php');
		echo json_encode($ret);
	}
 ?>