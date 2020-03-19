<?php
    $url = 'https://myhub.njit.edu/vrs/ldapAuthenticateServlet';
    
    $fields = array(
        'user_name' => urlencode('UCID'),
        'passwd' => urlencode('PASSWORD'),
        'SUBMIT' => urlencode('Login')
    );

    foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
    rtrim($fields_string, '&');



    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, count($fields));
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);

    $result = curl_exec($ch);

    curl_close($ch);

    echo $result;
?>