<?php

$task=$_GET['name'];

//open connection to mysql db
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');

//create an array
$tagList = array();
$ddoptions = array();
$options = array();	
	
//SQL quries to get categories
$sql = "SELECT `LR_ATTR_ID`,`LR_ATTR_LABEL` FROM `lr_attr_dropdown` WHERE `LR_ATTR_SET_ID`=(SELECT `LR_ATTR_SET_ID`  FROM `lr_attr_set` WHERE `LR_ATTR_SET_LABEL`= '".$task."' && `IsExists`='true');";
$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));

while($row =mysqli_fetch_array($result))
{
	array_push($tagList,
		array('text' => $row['LR_ATTR_LABEL'],
		'dropdownattrid' => $row['LR_ATTR_ID'],
		));
}	

//getting options
foreach($tagList as $a)
{		

$sql1 = "SELECT `LR_ATTR_OPTION_VALUE` FROM `lr_attr_option` WHERE `LR_ATTR_ID`=(SELECT `LR_ATTR_ID` FROM `lr_attr_dropdown` WHERE`LR_ATTR_LABEL`='".$a['text']."' && `LR_ATTR_ID`=".$a['dropdownattrid'].");";
$result1 = mysqli_query($connection, $sql1) or die("Error in Selecting 2" . mysqli_error($connection));
			
$newSetlist=array();
While($row1=mysqli_fetch_array($result1))
{
	array_push($newSetlist,
		array('text'=>$row1['LR_ATTR_OPTION_VALUE']
		));
}
array_push($options,
	array('text'=> $a['text'],
	'options' => $newSetlist
	));
}
array_push($ddoptions,
	array('id'=> 0,
	'sets' => $options
	));
	
echo json_encode($ddoptions);
mysqli_close($connection);

?>
