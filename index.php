<html>

<head>
    <title>Awesome Site!</title>
</head>

<body>
    <?php
        $_POST = json_decode(file_get_contents('php://input'), true);
        echo $_POST;
    ?>
</body>

</html>