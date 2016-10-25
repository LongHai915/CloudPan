<?php
	//$file_info = var_export($_FILES, true);
	//file_put_contents('bak.php', $file_info);
	if(isset($_FILES["ufile"])){
		$ret = array();
		$RootDir = $_SERVER['DOCUMENT_ROOT']; 
		$uploadDir = "$RootDir/file/";
		$name = $_FILES['ufile']['name'];
		//var_dump($uploadDir);
		$ret = array('code'=>0, 'msg'=>"invalid operation", 'url'=>'');
		$ok = @move_uploaded_file($_FILES['ufile']['tmp_name'], "$uploadDir/$name");
		if($ok === false){
			$err = error_get_last();
			$ret['msg'] = $err['message'];
		} 
		else{
			$ret['code'] = 1;
			$ret['msg'] = 'success';
			$ret['url'] = $uploadDir.$_FILES['ufile']['name'];
		}
		echo json_encode($ret);
	}