<?php

//open connection to mysql db
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');

//create an array
$attrsId = array();
	
$sql = "SELECT `LR_ATTR_SET_ID` FROM `lr_attr_set` WHERE IsSelected='true'";
$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));
		
while($row = mysqli_fetch_assoc($result))
{$attrsId[] = $row;}
	
$temptagInputset = array();
$temptagInputList = array();
$inputattr = array();	
$setId =1;
foreach ($attrsId as $ida) 
{
	$tagInputsList = array();
	$id = 0;
	$bool = false;
	$sets = array();

	$attrId = implode(',', $ida);
		
	$sql = "SELECT * FROM `lr_attr_input` WHERE LR_ATTR_SET_ID=".$attrId;
	$tagInputsresult = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));
	
	while($row =mysqli_fetch_array($tagInputsresult))
	{
		++$id;
		$temp = array();
			
		array_push($tagInputsList,
			array('id'=> $id,
			'attrsetid'=> $attrId,
			'taginputid' => $row[0],
			'text' => $row[1],
			'isexists' => $row[5]
			));
			
		//If text does not exist in temptagInputsList
		if(!in_array($row[1], $temptagInputset,TRUE))
		{
			$bool = true;
			array_push($temptagInputset,
				array('id'=> $id,
				'attrsetid'=> $attrId,
				'taginputid' => $row[0],
				'text' => $row[1],
				'isexists' => $row[5]
				));
		}
	}
	array_push($inputattr,
		array('attrsetid'=> $attrId,
		'id'=> $setId,
		'sets'=>$tagInputsList
	));
	++$setId;
}
	
//Removes duplicates from an entity
$new_array = array();
$exists    = array();
foreach( $temptagInputset as $element ) {
if( !in_array( $element['text'], $exists )) {
    $new_array[] = $element;
    $exists[]    = $element['text'];
}}
	
array_push($temptagInputList,
	array('attrsetid'=> 0,
		'id'=> 0,
		'sets'=>$new_array
	));
				
//Add all the input attr at zeroth row
array_unshift($inputattr, $temptagInputList);
$json = json_encode($inputattr);
$json = str_replace('[[','[' , $json);
$json = str_replace("],",',' , $json);
echo $json;

mysqli_close($connection);
?>
