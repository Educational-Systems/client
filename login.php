<?php
    //$_POST = json_decode(file_get_contents('php://input'), true); // Receiving JSON data from the JavaScript Client
    //$data = json_encode($_POST); // Encoding that data to pass it
    //$ch = curl_init('https://web.njit.edu/~npm26/logingate.php'); // Test URL



    $ch = curl_init('https://myhub.njit.edu/vrs/ldapAuthenticateServlet'); // Test URL

    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST"); // HTTP request method
    curl_setopt($ch, CURLOPT_POSTFIELDS, "usern_name=dk497&passwd=%24115Mamulya&SUBMIT=Login");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Whatever

    $result = curl_exec($ch); // Executing cURL HTTP request

    curl_close($ch); // Closing request

    echo $result;

    //header('Content-Type: application/json'); // Setting header for our PHP response
    //echo $result; // Returning result
?>