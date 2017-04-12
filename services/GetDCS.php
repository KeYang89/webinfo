<?php

//open connection to mysql db
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');

//fetch table rows from mysql db
$sql = "SELECT * FROM `lr_DCS`";
$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));

//create an array
$emparray = array();
while($row =mysqli_fetch_array($result))
{
	array_push($emparray,
		array('DCS_id' => $row[0],
		'DCS_code' => $row[0].': '.$row[1],
		'SBS_NO' => $row[2]
		));	
}
echo json_encode($emparray);
	
//close the db connection
mysqli_close($connection);
?>
