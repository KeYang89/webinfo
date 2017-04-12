<?php

// $urlParams = explode('/',$_SERVER['REQUEST_URI']);
// $task = $urlParams[4];
// if(strpos($task, '?') !== false)
// {$task = strstr($task, '?', true);}
$task=$_GET['name'];
echo $task;
//open connection to mysql db
//$connection = mysqli_connect("localhost","lr_db","Esegna$2015","lr_db") or die("Error ".mysqli_error($connection));
$connection = mysqli_connect("localhost","lrcloud-u","coyote1989","lr_db") or die("Error ".mysqli_error($connection));

//create an array
$tagList = array();
$ddoptions = array();
$options = array();	
	
//SQL quries to get categories
$sql = "SELECT `LR_ATTR_ID`,`LR_ATTR_LABEL` FROM `lr_attr_dropdown` WHERE `LR_ATTR_SET_ID`=(SELECT `LR_ATTR_SET_ID`  FROM `lr_attr_set` WHERE `LR_ATTR_SET_LABEL`= '".$task."' && `IsExists`='true');";
	//echo $sql;
$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));

while($row =mysqli_fetch_array($result))
{
	array_push($tagList,
		array('text' => $row['LR_ATTR_LABEL'],
		'dropdownattrid' => $row['LR_ATTR_ID'],
		));
}
mysqli_close($connection);
unset($connection);//ends the dd	

//getting options
foreach($tagList as $a)
{		
//open connection to mysql db
$connection = mysqli_connect("localhost","lr_db","Esegna$2015","lr_db") or die("Error ".mysqli_error($connection));

$sql1 = "SELECT `LR_ATTR_OPTION_VALUE` FROM `lr_attr_option` WHERE `LR_ATTR_ID`=(SELECT `LR_ATTR_ID` FROM `lr_attr_dropdown` WHERE`LR_ATTR_LABEL`='".$a['text']."' && `LR_ATTR_ID`=".$a['dropdownattrid'].");";
//echo $sql1;
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
//mysqli_close($connection);

?>
