<?php
    header('WWW-Authenticate: Basic realm="401 Error"');
    header('HTTP/1.1 401 Unauthorized');
    echo Array("error" => "You are not an authorized user.");
?>