<?php

$data = json_decode(file_get_contents('php://input'), true);
$unselectedtask = json_decode($data['tasksuncom'],true);
$selectedtask = json_decode($data['taskcom'],true);
$tags = json_decode($data['tag'],true);
$tagInput = json_decode($data['taginput'],true);

foreach ($selectedtask as $completedTask)
{
	insertInputAttributes($tagInput, $completedTask);
	insertDropdownAttributes($tags, $completedTask);
}

function insertInputAttributes($tagInput, $task)
{
	$tempList = array();
	$tempList1 = array();
	
	//OPEN CONNECTION TO MYSQL
	require_once("config.php");
	$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
	mysqli_select_db($connection,DBNAME) or die('Could not select database.');

	foreach($tagInput as $taginputattr)
	{
		if(!empty($taginputattr['sets']) && $task['attrsetid'] == $taginputattr['attrsetid'])
		{
			foreach($taginputattr['sets'] as $sets)
			{
				$query = mysqli_query($connection, "Select * from `lr_attr_input` where (`LR_ATTR_LABEL` = '".$sets['text']."' AND `LR_ATTR_SET_ID`=".$task['attrsetid'].");");
				
				if(mysqli_num_rows($query) == 0)//record does not exists
				{
					//insert if value not exist
					$insert = "INSERT INTO `lr_attr_input` (`LR_ATTR_LABEL`, `LR_ATTR_TYPE_ID`, `LR_ATTR_INPUT_VALUE`, `LR_ATTR_SET_ID`,`IsExists`) SELECT * FROM (SELECT '".$sets['text']."',1,0,".$task['attrsetid'].",'true') AS tmp WHERE NOT EXISTS ( SELECT `LR_ATTR_LABEL` FROM `lr_attr_input` WHERE `LR_ATTR_LABEL` = '".$sets['text']."' and `LR_ATTR_SET_ID` = ".$task['attrsetid'].") LIMIT 1";
				
					$result = mysqli_query($connection, $insert) or die("Error in Inserting input attrs " . mysqli_error($connection).$insert);
				}
				else if($sets['isexists'] == false)
				{
					$delete = "DELETE FROM `lr_attr_input` where (`LR_ATTR_LABEL` = '".$sets['text']."' and `LR_ATTR_SET_ID` = ".$task['attrsetid'].");";
					
					$result = mysqli_query($connection, $delete) or die("Error in Deleting input attrs " . mysqli_error($connection).$delete);
				}
				else if($sets['isexists'] == true)
				{
					$update = "UPDATE `lr_attr_input` SET `IsExists`='".$sets['isexists']."' WHERE (`LR_ATTR_LABEL`='".$sets['text']."' and `LR_ATTR_SET_ID`=".$task['attrsetid'].");";
				
					$result = mysqli_query($connection, $update) or die("Error in Updating input attrs " . mysqli_error($connection).$update);
				}
				array_push($tempList1,$sets['text']);
			}
			$attr = "SELECT * FROM `lr_attr_input` where `LR_ATTR_SET_ID` = ".$taginputattr['attrsetid'];
			if ($results = mysqli_query($connection,$attr))
			{
				while($row = mysqli_fetch_array($results))
				{
					array_push($tempList,$row['LR_ATTR_LABEL']);
				}
			}
				
			$diff = array_diff($tempList, $tempList1);//returns values in templist and not present in taginput.sets
			
			foreach($diff as $val)
			{
				$deletes = "DELETE FROM `lr_attr_input` where (`LR_ATTR_LABEL` = '".$val."' && `LR_ATTR_SET_ID` = ".$taginputattr['attrsetid'].");";
				$res = mysqli_query($connection, $deletes) or die("Error in Inserting " . mysqli_error($connection).$deletes);
			}
		}
	}
	mysqli_close($connection);
	unset($connection);
}

function insertDropdownAttributes($tags, $task)
{
	$count = 0;
	$tempTag = array();
	$deleteList = array();
	$DDtempList = array();
	$OptiontempList = array();
	
	//delete temp lists
	$tempList = array();
	$tempList1 = array();
	$tempListId = array();
	
	//OPEN CONNECTION TO MYSQL
	require_once("config.php");
	$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
	mysqli_select_db($connection,DBNAME) or die('Could not select database.');

	if(!empty($tags))
	{
		foreach ($tags as $tag)
		{
			++$count;
			if($count == 1)
			{$tempTag = $tag;}
			
			echo json_encode($tag);
			if (!empty($tag['sets']) && $task['attrsetid'] == $tag['attrSetId'])
			{
				foreach ($tag['sets'] as $tagSets)
				{
					$query = mysqli_query($connection, "Select * from `lr_attr_dropdown` where (`LR_ATTR_LABEL` = '".$tagSets['text']."' AND `LR_ATTR_SET_ID`=".$task['attrsetid'].");");
				
					if(mysqli_num_rows($query) <= 0)//record does not exists
					{
						//insert if value not exist
						$insert = "INSERT INTO `lr_attr_dropdown` (`LR_ATTR_LABEL`, `LR_ATTR_TYPE_ID`, `LR_ATTR_INPUT_VALUE`, `LR_ATTR_SET_ID`,`IsExists`) SELECT * FROM (SELECT '".$tagSets['text']."',2,0,".$task['attrsetid'].",'true') AS tmp WHERE NOT EXISTS ( SELECT `LR_ATTR_LABEL` FROM `lr_attr_dropdown` WHERE `LR_ATTR_LABEL` = '".$tagSets['text']."' and `LR_ATTR_SET_ID` = ".$task['attrsetid'].") LIMIT 1";
				
						$result = mysqli_query($connection, $insert) or die("Error in Inserting dropdowns " . mysqli_error($connection).$insert);
					}
					else if($tagSets['isexists'] == false)
					{
						$delete = "DELETE FROM `lr_attr_dropdown` where (`LR_ATTR_LABEL` = '".$tagSets['text']."' and `LR_ATTR_SET_ID` = ".$task['attrsetid'].");";
					
						$result = mysqli_query($connection, $delete) or die("Error in Deleting dropdowns " . mysqli_error($connection).$delete);
					}
					else if($tagSets['isexists'] == true)
					{
						$update = "UPDATE `lr_attr_dropdown` SET `IsExists`='".$tagSets['isexists']."' WHERE (`LR_ATTR_LABEL`='".$tagSets['text']."' and `LR_ATTR_SET_ID`=".$task['attrsetid'].");";
				
						$result = mysqli_query($connection, $update) or die("Error in Updating dropdowns " . mysqli_error($connection).$update);
					}
					insertOptions($tagSets, $tempTag);
					
					array_push($tempListId,
					array('text' => $tagSets['text'],
					'dropdownattrid' => $tagSets['dropdownattrid']
					));
					array_push($tempList1,$tagSets['text']);
				}
				
				$attr = "SELECT * FROM `lr_attr_dropdown` where `LR_ATTR_SET_ID` = ".$task['attrsetid'];
				if ($results = mysqli_query($connection,$attr))
				{
					while($row = mysqli_fetch_array($results))
					{
						array_push($tempList,$row['LR_ATTR_LABEL']);
					}
				}
				
				$diff = array_diff($tempList, $tempList1);//returns values in templist and not present in taginput.sets
				
				foreach($diff as $val)
				{
					foreach($tempListId as $id)
					{
						if($id['text'] == $val)
						{
							$sql6 = "DELETE FROM `lr_attr_option` where `LR_ATTR_ID` = ".$id['dropdownattrid'];
							$result3 = mysqli_query($connection,$sql6)or die("Error in Deleting options from dropdowns" . mysqli_error($connection));
						}
					}
					
					$deletes = "DELETE FROM `lr_attr_dropdown` where (`LR_ATTR_LABEL` = '".$val."' && `LR_ATTR_SET_ID` = ".$task['attrsetid'].");";
					$res = mysqli_query($connection, $deletes) or die("Error in Deleting dropdowns" . mysqli_error($connection).$deletes);
				}
			}
		}
	}	
	mysqli_close($connection);
	unset($connection);
}

function insertOptions($tagsets, $tag)
{
	$deleteList = array();
	$tempList = array();
	$tempList1 = array();
	
	//OPEN CONNECTION TO MYSQL
	require_once("config.php");
	$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
	mysqli_select_db($connection,DBNAME) or die('Could not select database.');

	if (!empty($tag['sets']))
	{
		foreach ($tag['sets']as $tags)
		{
			if ($tags['text'] == $tagsets['text'])
			{
				foreach ($tags['options'] as $option)
				{
					$query = mysqli_query($connection, "Select * from `lr_attr_option` where (`LR_ATTR_OPTION_VALUE` = '".$option['text']."' AND `LR_ATTR_ID`=".$tagsets['dropdownattrid'].");");
				
					if(mysqli_num_rows($query) == 0)//record does not exists
					{
						//insert if value not exist
						$insert = "INSERT INTO `lr_attr_option` (`LR_ATTR_OPTION_VALUE`, `LR_ATTR_ID`, `IsExists`) SELECT * FROM (SELECT '".$option['text']."',".$tagsets['dropdownattrid'].",'true') AS tmp WHERE NOT EXISTS ( SELECT `LR_ATTR_OPTION_VALUE` FROM `lr_attr_option` WHERE `LR_ATTR_OPTION_VALUE` = '".$option['text']."' and `LR_ATTR_ID` = ".$tagsets['dropdownattrid'].") LIMIT 1";
				
						$result = mysqli_query($connection, $insert) or die("Error in Inserting options " . mysqli_error($connection).$insert);
					}
					else if($option['isexists'] == true)
					{
						$update = "UPDATE `lr_attr_option` SET `IsExists`='".$option['isexists']."' WHERE (`LR_ATTR_OPTION_VALUE`='".$option['text']."' and `LR_ATTR_ID`=".$tagsets['dropdownattrid'].");";
				
						$result = mysqli_query($connection, $update) or die("Error in Updating options " . mysqli_error($connection).$update);
					}
					array_push($tempList1,$option['text']);
				}
				$attr = "SELECT * FROM `lr_attr_option` where `LR_ATTR_ID` = ".$tagsets['dropdownattrid'];
				if ($result1 = mysqli_query($connection,$attr))
				{
					while($row = mysqli_fetch_array($result1))
					{
						array_push($tempList,$row['LR_ATTR_OPTION_VALUE']);
					}
				}
				$diff = array_diff($tempList, $tempList1);//returns values in templist and not present in taginput.sets
				foreach($diff as $val)
				{
					$deletes = "DELETE FROM `lr_attr_option` where (`LR_ATTR_OPTION_VALUE` = '".$val."' && `LR_ATTR_ID` = ".$tagsets['dropdownattrid'].");";
					$res = mysqli_query($connection, $deletes) or die("Error in Deleting options " . mysqli_error($connection).$deletes);
				}
			}
		}
	}	
	mysqli_close($connection);
	unset($connection);
}

?>