<?php

$taskName = json_decode(file_get_contents('php://input'), true);

//Open connection to mysql db
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');

$sql = "INSERT INTO `lr_attr_set`(`LR_ATTR_SET_LABEL`,`IsSelected` ) VALUES ('".$taskName . "','False');";

$result = mysqli_query($connection, $sql) or die("Error in Inserting " . mysqli_error($connection));

$last_id = mysqli_insert_id($connection);
echo $last_id;

?>
