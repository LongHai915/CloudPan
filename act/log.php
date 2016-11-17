<?php
class log
{
    public static function err($msg)
    {
        $name = date('Ymd') . '.log';
        $path = $_SERVER['DOCUMENT_ROOT'] . '/cloudpan/logs';
        $file = "$path/$name";
        $msg  = date('Y-m-d H:i:s') . " - $msg" . PHP_EOL;
        if (!file_exists($path)) {
            echo 'path not exists.<br />';
            mkdir($path);
            var_dump(file_exists($path));
        }
        file_put_contents($file, $msg, FILE_APPEND);
    }
}
