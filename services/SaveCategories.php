<?php

$cat = json_decode(file_get_contents('php://input'), true);

if(!empty($cat['children']))
{
	foreach($cat['children'] as $cat1)
	{
		$catId = 0;
		
		//parent
		if ($cat1['categoryid'] == 0)
		{
			$catId = insertChildCategory($cat1, 0);
		}
        else
		{
			$catId = updateChildCategory($cat1);
		}
		//child 1
		if(!empty($cat1['children']))
		{
			foreach($cat1['children'] as $cat2)
			{
				$catId1 = 0;
				if ($cat2['categoryid'] == 0)
				{
					$catId1 = insertChildCategory($cat2, $catId);
				}
				else
				{
					$catId1 = updateChildCategory($cat2);
				}
				
				//child 2
				if(!empty($cat2['children']))
				{
					foreach($cat2['children'] as $cat3)
					{
						$catId2 = 0;
						if ($cat3['categoryid'] == 0)
						{
							$catId2 = insertChildCategory($cat3, $catId1);
						}
						else
						{
							$catId2 = updateChildCategory($cat3);
						}
						
						//child 3
						if(!empty($cat3['children']))
						{
							foreach($cat3['children'] as $cat4)
							{
								$catId3 = 0;
								if ($cat4['categoryid'] == 0)
								{
									$catId3 = insertChildCategory($cat4, $catId2);
								}
								else
								{
									$catId3 = updateChildCategory($cat4);
								}
							}
						}
					}
				}
			}
		}
	}
}

function insertChildCategory($insertcat,$parentid)
{
	require_once("config.php");
	$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
	mysqli_select_db($connection,DBNAME) or die('Could not select database.');

	$sql = "INSERT INTO `lr_categories`(`Category_Parent_ID`, `Name`, `DCS_id`) VALUES (".$parentid . ",'".$insertcat['title']."','".$insertcat['DCS']."');";
	
	$result = mysqli_query($connection, $sql) or die("Error in Inserting " . mysqli_error($connection));

	$last_id = mysqli_insert_id($connection);
	
	return $last_id;
	
	mysqli_close($connection);
	unset($connection);
}
  
function updateChildCategory($updatecat)
{
	require_once("config.php");
	$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
	mysqli_select_db($connection,DBNAME) or die('Could not select database.');

	$sql1 = "UPDATE `lr_categories` SET  `Name`='".$updatecat['title']."', `DCS_id`='".$updatecat['DCS']."'  WHERE (`Category_Parent_ID`=".$updatecat['parentid']." && `LR_Category_ID`=".$updatecat['categoryid'].");";	

	$result = mysqli_query($connection, $sql1) or die("Error in Updating " . mysqli_error($connection));
 
	return $updatecat['categoryid'];
	
	mysqli_close($connection);
	unset($connection);
}
 ?>