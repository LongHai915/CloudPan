<?php
include_once 'serverinfo.php';
include_once 'log.php';
include_once 'mysql.php';

//显示文件信息到指定文件中
//$file_info = var_export($_FILES, true);
//file_put_contents('bak.php', $file_info);

//login check
if (isset($_SESSION['uid'])) {
    $ret['code'] = -1;
    $ret['msg']  = 'no login';
    $ret['url']  = "../index.html";
    echo json_encode($ret);
    return;
}

// upload file
if (isset($_FILES["ufile"])) {
    //if upload directory does not exists, then create
    $RootDir   = $_SERVER['DOCUMENT_ROOT'];
    $uploadDir = $RootDir . upload_dir;
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir);
    }
    $bpublic = $_REQUEST['key'];
    // $tmp_name = $_FILES['ufile']['name'];
    // var_dump($tmp_name);
    //sha1_file 中文名称不行
    //英文名，相同文件的sha_file1值相同
    // $sha_name = sha1_file($tmp_name);
    // var_dump($sha_name);
    // /files 可以找到 但是/files/s二级目录就找不到，不知原因

    $size  = count($_FILES);
    $ufile = $_FILES['ufile'];
    $name  = iconv("UTF-8", "gb2312", $ufile['name']); //上传文件，保证中文没有乱码
    $file  = $uploadDir . DIRECTORY_SEPARATOR . $name;
    if ($_FILES['ufile']['error'] == 0) {
        if (file_exists($file) == 0) {
            $ok = @move_uploaded_file($ufile['tmp_name'], $file);
            if ($ok == false) {
                $ret['code'] = 0;
                $err         = error_get_last();
                $ret['msg']  = $err['message'];
                $ret['url']  = '';
            } else {
                $ret['code'] = 1;
                $ret['msg']  = '2';
                if($bpublic == "0")
                    $ret['msg'] = '1';
                $ret['url']  = upload_dir . DIRECTORY_SEPARATOR . $ufile['name']; //utf8编码
                //insert the file info into database
                InsertDatabase($ufile['name'], $ufile['size']);
            }
        } else {
            InsertDatabase($ufile['name'], $ufile['size']);
            $ret['code'] = 1;
            $ret['msg']  = '2';
            if($bpublic == "0")
                $ret['msg'] = '1';
            $ret['url']  = upload_dir . DIRECTORY_SEPARATOR . $ufile['name']; //utf8编码
        }

        echo json_encode($ret);
    } else {
        $ret['code'] = 0;
        $ret['url']  = '';
        switch ($_FILES[$field]['error']) {
            case 1:
                // 文件大小超出了服务器的空间大小
                $ret['msg'] = "The file is too large (server).";
                break;

            case 2:
                // 要上传的文件大小超出浏览器限制
                $ret['msg'] = "The file is too large (form).";
                break;

            case 3:
                // 文件仅部分被上传
                $ret['msg'] = "The file was only partially uploaded.";
                break;

            case 4:
                // 没有找到要上传的文件
                $ret['msg'] = "No file was uploaded.";
                break;

            case 5:
                // 服务器临时文件夹丢失
                $ret['msg'] = "The servers temporary folder is missing.";
                break;

            case 6:
                // 文件写入到临时文件夹出错
                $ret['msg'] = "Failed to write to the temporary folder.";
                break;
        }
        echo json_encode($ret);
    }
}

function InsertDatabase($fname, $fsize, $did=1)
{
    try {
        $dbinfo = array('host'=>db_host, 'port'=>db_port, 'user'=>db_user, 'password'=>db_pass, 'dbname'=>db_name);
        $link = new mysql($dbinfo);

        if($bpublic == "false")
        {
             $sql = "insert into t_files(fname, fsize) values(?, ?);";              
            $size = round($_FILES['ufile']['size'] / 1024);
            $param = array($_FILES['ufile']['name'], $size);
            $link->beginTransaction();
            $res   = $link->insert($sql, $param);
            if (!$res) {
                $link->rollback();
            }
            $fid = $res;
            $sql  = "insert into t_file_dir_user(fid, did, uid) values(?, ?, ?)";
            session_start();
            $uid   = $_SESSION['uid'];
            $did = $did == 0 ? 1 : $did;
            $param = array($fid, $did, $uid);
            $res   = $link->insert($sql, $param);
            if (!$res) {
                $link->rollback();
            }
            $link->commit();
        } else {
            $sql = "insert into t_pub_files(fname, fsize) values(?, ?);";              
            $size = round($_FILES['ufile']['size'] / 1024);
            $param = array($_FILES['ufile']['name'], $size);
            $link->insert($sql, $param);
        }
       
    } catch (PDOException $e) {
        $link->rollback();
    }
}

function check_exists($targetfile)
{
    if (file_exists($targetfile)) {
        return true;
    } else {
        return false;
    }

}
