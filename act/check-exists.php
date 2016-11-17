<?php
error_log($_FILES['ufile']['name'], 3, upload_dir);
if (isset($_FILES['ufile'])) {
    $name = $_FILES['ufile']['name'];
    var_dump($name);
    if (file_exists(upload_dir . $name)) {
        echo 1;
    } else {
        echo 0;
    }

}
