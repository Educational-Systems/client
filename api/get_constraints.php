<?php
    $_POST = json_decode(file_get_contents('php://input'), true); // Receiving JSON data from the JavaScript Client
    $data = json_encode($_POST); // Encoding that data to pass it

    $ch = curl_init('https://web.njit.edu/~dsk43/cs490-middle/get_constraints.php'); // Test URL
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST"); // HTTP request method
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data); // Passing data to the request
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disabling SSL check
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Whatever
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Content-Length: ' . strlen($data))); // Setting necessary headers

    $result = curl_exec($ch); // Executing cURL HTTP request

    curl_close($ch); // Closing request

    header('Content-Type: application/json'); // Setting header for our PHP response
    echo $result; // Returning result
?>