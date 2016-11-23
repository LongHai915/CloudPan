<?php
include_once 'log.php';

class mysql
{
    // pdo link
    protected $link;
    //pdo statement
    protected $stmt;
    // error code
    private $msg;

    /**
     * constructor
     * connect to the server
     * set the charset
     * @param array $config [array: database info]
     */
    public function __construct($config = array())
    {
        $this->msg = '';
        $host         = isset($config['host']) ? $config['host'] : 'localhost';
        $port         = isset($config['port']) ? $config['port'] : '3306';
        $user         = isset($config['user']) ? $config['user'] : 'root';
        $password     = isset($config['password']) ? $config['password'] : '';
        $dbname       = isset($config['dbname']) ? $config['dbname'] : '';
        $charset      = isset($config['charset']) ? $config['charset'] : 'utf8';

        if (empty($dbname)) {
            die("database name is undified.");
        }

        $dns = "mysql:host=$host:$port; dbname=$dbname";
        try {
            $this->link = new PDO($dns, $user, $password);
            $this->link->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            //$this->link->setAttribute(PDO::ATTR_PERSISTENT, true);//长连接
            $this->link->setAttribute(PDO::ATTR_EMULATE_PREPARES, false); //禁用prepared statements的仿真效果，达到防止注入目的
            $this->link->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
        } catch (PDOException $e) {
            Log::err($e->getMessage());
            throw $e;
        }
    }

    /**
     * close connection of mysql
     */
    public function closelink()
    {
        $this->link = null;
    }

    /**
     * execute sql statement
     * @param  $sql    sql statement
     * @param  $param  parameter list
     * @return $result if success, return resources; if failed, return error message and exit
     */
    public function query($sql, $param = array())
    {
        // write sql statement into log
        Log::err($sql);
        $this->stmt = null;
        try {
            $this->stmt = $this->link->prepare($sql);
            if (empty($param)) {
                $res = $this->stmt->execute();
            } else {
                $res = $this->stmt->execute($param);
            }

            if (!$res) {
                $msg = $this->stmt->errorCode() . ': ' . $this->stmt->errorInfo();
                Log::err($msg);
                die('PDO query failed: ' . $sql);
            }

            return $res;
        } catch (Exception $e) {
            $this->msg = $e->getMessage();
            Log::err($this->msg);
            return false;
        }
    }

    /**
     * get the first column of the first record
     * @param  $sql   sql statement
     * @param  $param parameter list
     * @return if success, return the value; if failed, return false
     */
    public function getFirst($sql, $param = array())
    {
        $res = $this->query($sql, $param);
        if ($res) {
            if ($row = $this->stmt->fetch(PDO::FETCH_NUM)) {
                return $row[0];
            } else {
                return null;
            }

        } else {
            return false;
        }
    }

    /**
     * get the first record
     * @param  $sql   sql statement
     * @param  $param parameter list
     * @return if success, return the value; if failed, return false
     */
    public function getRow($sql, $param = array())
    {
        $res = $this->query($sql, $param);
        if ($res) {
            $row = $this->stmt->fetch(PDO::FETCH_ASSOC);

            return $row;
        } else {
            return false;
        }

    }

    /**
     * get some(more than one) records
     * @param  $sql   sql statement
     * @param  $param parameter list
     * @return if success, return the value; if failed, return fasle
     */
    public function getAll($sql, $param = array())
    {
        $count=0;
        $res = $this->query($sql, $param);
        if ($res) {
            while ($row = $this->stmt->fetch(PDO::FETCH_ASSOC)) {
                $count = $count + 1;
                $data[] = $row;
            }
            $data['count'] = $count;
            return $data;
        } else {
            return false;
        }
    }

    /**
     * transaction begin
     */
    public function beginTransaction(){
        $this->link->beginTransaction();
    }

    /**
     * transaction commit
     */
    public function commit(){
        $this->link->commit();
    }

    /**
     * transaction rollback
     */
    public function rollback(){
        $this->link->rollBack();
    }

    /**
     * insert fuction
     * @param  $sql   sql statement
     * @param  $param parameter list
     * @return if success, return the value; if failed, return fasle
     */
    public function insert($sql, $param=array())
    {
        try{
            Log::err($sql);
             $this->stmt = $this->link->prepare($sql);
             $res = $this->stmt->execute($param);
             if (!$res) {
                $msg = $this->stmt->errorCode() . ': ' . $this->stmt->errorInfo();
                Log::err($msg);
            } else {
                return $this->link->lastInsertId();
            }
            return $res;
        } catch (Exception $e){
            $this->msg = $e->getMessage();
            Log::err($this->msg);
            throw $e;
        }
        return false;
    }

    /**
     * get the error msg of database
     * @return error message
     */
    public function getErrMsg()
    {
        return $this->msg;
    }

}
