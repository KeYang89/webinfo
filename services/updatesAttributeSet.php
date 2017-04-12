<?php

$data = json_decode(file_get_contents('php://input'), true);

//OPEN CONNECTION TO MYSQL
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');

if($data['complete'] == 1)
{
	$sql = "UPDATE `lr_attr_set` SET `IsSelected`='True' WHERE (`LR_ATTR_SET_LABEL`='".$data['title'] ."' && `LR_ATTR_SET_ID`=".$data['attrsetid'].");"; 
	
	$result = mysqli_query($connection, $sql) or die("Error in Updating " . mysqli_error($connection).$sql);
	
	mysqli_close($connection);
	unset($connection);
}
else if($data['complete'] == 0)
{
	$sql = "UPDATE `lr_attr_set` SET `IsSelected`='False' WHERE (`LR_ATTR_SET_LABEL`='".$data['title'] ."' && `LR_ATTR_SET_ID`=".$data['attrsetid'].");"; 
	
	$result = mysqli_query($connection, $sql) or die("Error in Update " . mysqli_error($connection).$sql);
	
	mysqli_close($connection);
	unset($connection);
}

?>
