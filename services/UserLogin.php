<?Php

$username = $_GET['un'];
$password = $_GET['pswd'];
	
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');
  
$query="SELECT a.USERNAME, a.PASSWORD, b.ROLE FROM lr_users a, lr_user_role b  WHERE a.USERNAME = '".$username."' AND a.PASSWORD ='".$password."' AND b.ROLE_ID = a.ROLE_ID;";
$result=mysqli_query($connection, $query) or die("Error in Selecting " . mysqli_error($connection));

while($row =mysqli_fetch_array($result))
{
	$role = $row['ROLE'];
}		 
	  
$result=mysqli_query($connection, $query) or die("Error in Selecting " . mysqli_error($connection));
	  
$num_rows = mysqli_num_rows($result);

if($num_rows>0)
{
	$Result=array();
	array_push($Result,
	array('status' => 'Valid',
	'Role'=> $role
	));
	echo json_encode($Result);
}
else
{
	$Result=array();
	array_push($Result,
		array('status' => 'Invalid',
		'Role'=> ''
		));
	echo json_encode($Result);
}
	
?>