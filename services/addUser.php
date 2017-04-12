<?php
$loginDetails =json_decode(file_get_contents('php://input'), true);

//Open connection to mysql db
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');
//$connection = mysqli_connect("localhost","lrcloud-u","coyote1989","lr_db") or die("Error " . mysqli_error($connection));

$isexists = true;
$sql1 = "SELECT count(USERNAME) as total FROM `lr_users` WHERE `USERNAME`='".$loginDetails['un']."';";
$result1 = mysqli_query($connection, $sql1) or die("Error in Selecting " . mysqli_error($connection).$sql1);
$row = mysqli_fetch_assoc($result1);

if( $row ['total'] > 0){
    $isexists = true;
}
else{
    $isexists = false;
}

if($isexists == false)
{
	$sql2 = "SELECT * FROM `lr_user_role` WHERE `ROLE`='".$loginDetails['roles']."';";
	$result2 = mysqli_query($connection, $sql2) or die("Error in Selecting " . mysqli_error($connection).$sql2);
	while($row =mysqli_fetch_array($result2))
    {
		$roleid = $row[0];
	}	
	$sql="INSERT INTO `lr_users`(`USERNAME`, `PASSWORD`, `EMAIL`, `ROLE_ID`) VALUES ('".$loginDetails['un']."','".$loginDetails['pswd']."','".$loginDetails['mail']."',".$roleid.");";		
	$result = mysqli_query($connection, $sql) or die("Error in Inserting " . mysqli_error($connection).$sql);
	
	echo 'success';
}

mysqli_close($connection);

?>