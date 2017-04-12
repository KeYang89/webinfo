<?php

require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');

//create an array
$attrsId = array();
	
$sql = "SELECT `LR_ATTR_SET_ID` FROM `lr_attr_set` WHERE IsSelected='true'";
$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));
		
while($row = mysqli_fetch_assoc($result))
{$attrsId[] = $row;}

//create an array
$dropdowns = array();
	
foreach($attrsId as $attrid)
{
	$attrid = implode(',', $attrid);

	$sql = "SELECT * FROM `lr_attr_dropdown` WHERE `LR_ATTR_SET_ID`=".$attrid;
	$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));
		
	while($row = mysqli_fetch_array($result))
	{
		array_push($dropdowns,
			array('attrsetid'=> $attrid,
			'dropdownattrid' => $row[0],
			'text' => $row[1],
			'isexists' => $row[5]
			));
	}	
}

$allDropdownList = array();
$tag = array();
$tagList = array();
$count = 1;	
	
foreach($attrsId as $aid)
{
	$dropdownList = array();
	$attrId = implode(',', $aid);
	foreach($dropdowns as $dds)
	{
		if($attrId == $dds['attrsetid'])
		{
			$optionList = array();

			$sql = "SELECT * FROM `lr_attr_option` WHERE `LR_ATTR_ID`=".$dds['dropdownattrid'];
			$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));
		
			while($row = mysqli_fetch_array($result))
			{
				array_push($optionList,
					array('dropdownattrid'=>$dds['dropdownattrid'],
					'optionattrid'=> $row[0],
					'text' => $row[1],
					'isexists' => $row[3]
				));
			}
			array_push($dropdownList,
				array('attrsetid'=>$dds['attrsetid'],
					'text' => $dds['text'],
					'dropdownattrid'=> $dds['dropdownattrid'],
					'isexists' => $dds['isexists'],
					'options' => $optionList
				));
				
			array_push($allDropdownList,
				array('attrsetid'=>$dds['attrsetid'],
					'text' => $dds['text'],
					'dropdownattrid'=> $dds['dropdownattrid'],
					'isexists' => $dds['isexists'],
					'options' => $optionList
				));
		}
	}//dd end
		
	array_push($tagList,
		array('attrSetId'=> $attrId,
			'id' => $count,
			'sets'=> $dropdownList,
	));
			
	++$count;	
}//attr end
	
//Removes duplicates from an entity
$new_array = array();
$exists    = array();
foreach($allDropdownList as $element)
{
	if(!in_array( $element['text'], $exists))
	{
		$new_array[] = $element;
		$exists[]    = $element['text'];
	}
}
	
array_push($tag,
	array('attrSetId'=>0,
		'id'=> 0,
		'sets' => $new_array,
	));
	
//Add all the attrs at zeroth row
array_unshift($tagList, $tag);
$json = json_encode($tagList);
	
$json = str_replace('[[','[' , $json);
$json = str_replace("],",',' , $json);
echo $json;

mysqli_close($connection);
?>