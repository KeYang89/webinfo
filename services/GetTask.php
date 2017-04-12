<?php

$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$key = array_shift($request)+0;

//open connection to mysql db
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');

//fetch table rows from mysql db
if($_GET['id'] == 0)
{
    $sql = "SELECT * FROM `lr_attr_set` WHERE IsSelected='false'";
    $result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));
}
else if($_GET['id'] == 1)
{
    $sql = "SELECT * FROM `lr_attr_set` WHERE IsSelected='true'";
    $result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));
}

//create an array
$emparray = array();
$id =0;
while($row =mysqli_fetch_array($result))
{
	array_push($emparray,
		array('attrsetid' => $row[0],
		'title' => $row[1],
		'complete' => $row[2],
		'id'=> $id
		));
	++$id;		
}
echo json_encode($emparray);
	
//close the db connection
mysqli_close($connection);
?>
