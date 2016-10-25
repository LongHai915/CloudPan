<?php 
	
	$db_host = "127.0.0.1";
	$db_port = 3306;
	$db_user = "root";
	$db_pass = "s123";
	$db_name = "cloudpan";

	$dsn="mysql:host={$db_host}:{$db_port}; dbname={$db_name}";

	class DBConn{
	    private $db;
	    public function DBConn($dsn, $db_user, $db_pass){
	        try{
	            $db = new PDO($dsn, $db_user, $db_pass);
	            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	            $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false); //禁用prepared statements的仿真效果，达到防止注入目的
				$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
	        } 
	        catch(PDOException $e){
	            throw new PDOException($e);
	        }    
	        //$this->db = $conn;
	    }
	    
	    public function getConnection(){
	        return $this->db;
	    }
    }
?>