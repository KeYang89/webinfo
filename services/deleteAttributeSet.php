<?php

$task = json_decode(file_get_contents('php://input'), true);

//Open connection to mysql db
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');
//$connection = mysqli_connect("localhost","lrcloud-u","coyote1989","lr_db") or die("Error " . mysqli_error($connection));

$sql = "DELETE FROM `lr_attr_input` WHERE `LR_ATTR_SET_ID`=".$task['attrsetid'].";";
$result = mysqli_query($connection, $sql) or die("Error in Deleting " . mysqli_error($connection));

$sql1 = "DELETE FROM `lr_attr_option` WHERE  `LR_ATTR_ID` IN (SELECT `LR_ATTR_ID` FROM `lr_attr_dropdown` WHERE `LR_ATTR_SET_ID`=".$task['attrsetid']."); ";
$result1 = mysqli_query($connection, $sql1) or die("Error in Selecting " . mysqli_error($connection));

$sql2 = "DELETE FROM `lr_attr_dropdown` WHERE `LR_ATTR_SET_ID`=".$task['attrsetid']."; ";
$result2 = mysqli_query($connection, $sql2) or die("Error in Updating " . mysqli_error($connection));

$sql4 = "DELETE FROM `lr_attr_set` WHERE `LR_ATTR_SET_ID`=".$task['attrsetid'].";";
$result3 = mysqli_query($connection, $sql4) or die("Error in del 2 " . mysqli_error($connection));

mysqli_close($connection);
unset($connetion);
?>