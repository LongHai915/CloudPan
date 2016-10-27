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
			$db = new PDO(db_dsn, db_user, db_pass);
			$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false); //禁用prepared statements的仿真效果，达到防止注入目的
			$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);

			$sql = "select uname, password from t_user where (uname=? or uemail=?) and password=?;";
			$stmt = $db->prepare($sql);
			$param = array($email, $email, $password);
			$res = $stmt->execute($param);

			if(!$res){
				$ret['code']=2;
				$ret['msg'] = $db->errorInfo();
	        	}
	        	else if($res){
	        		$row = $stmt->fetch(PDO::FETCH_ASSOC);
	        	if(!$row){
	        		$ret['code']=0;
	        		$ret['msg']='this account/email does not exists';
	        	}
	        	else if($row['password'] != $password){
	        		$ret['code']=0;
	        		$ret['msg']='password is error, please re-input';
	        	}
	        	else{
	        		$ret['code']=1;
	        		session_start();
	        		$_SESSION['user'] = $row['uname'];
	        		$ret['msg']='login success';
	        		$ret['url']='html/main.html';
	        		$sql = "update t_user set lastLoginTime=now() where uname='{$email}' or uemail='{$email}';";
	        		$db->exec($sql);
	        	}
	        }
	        return $ret;
	    } 
	    catch (PDOException $e) {
	    	$ret['code']=3;
	    	$ret['msg'] = $e->getMessage();
	    	$ret['url'] = '';
	    	return $ret;
	    }
	}

	function logoutFunc(){
		session_decode();
		$ret = array('code'=>1, 'msg'=>"logout success", 'url'=>'/index.php');
		echo json_encode($ret);
	}
	?>
