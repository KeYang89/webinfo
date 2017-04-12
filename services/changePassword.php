<?Php

$Data =json_decode(file_get_contents('php://input'), true);

$username = $Data['un'];
$password = $Data['pswd'];
$newpassword = $Data['newpswdd'];

require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');
//$connection = mysqli_connect("localhost","lrcloud-u","coyote1989","lr_db") or die("Error " . mysqli_error($connection));
  
$query="UPDATE `lr_users` SET PASSWORD='".$newpassword."' WHERE USERNAME ='".$username."';";
$result=mysqli_query($connection, $query) or die("Error in Updating " . mysqli_error($connection));

echo 'success';
	
?>