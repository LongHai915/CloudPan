<?php

define('db_host', '127.0.0.1');
define('db_port', 3306);
define('db_user', 'root');
define('db_pass', 's159');
define('db_name', 'cloudpan');

define('db_dsn', "mysql:host=127.0.0.1:3306; dbname=cloudpan");
//define('logfile', "../log/errors.log");

// define('upload_dir', $_SERVER["DOCUMENT_ROOT"]."/files/");
define('upload_dir', "/cloudpan/files");

ignore_user_abort(false); //脚本结束后，自动删除mysql连接
