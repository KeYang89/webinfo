<?php

$cat = json_decode(file_get_contents('php://input'), true);

//Open connection to mysql db
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');

if(!empty($cat['children']))
{
	foreach($cat['children'] as $child1)
	{
		if(!empty($child1['children']))
		{
			foreach($child1['children'] as $child2)
			{
				if(!empty($child2['children']))
				{
					foreach($child2['children'] as $child3)
					{
						$sql3 = "DELETE FROM `lr_categories` where `LR_Category_ID` = ".$child3['categoryid'];

						$result3 = mysqli_query($connection, $sql3) or die("Error in Deleting child3" . mysqli_error($connection));
					}
					$sql2 = "DELETE FROM `lr_categories` where `LR_Category_ID` = ".$child2['categoryid'];

					$result2 = mysqli_query($connection, $sql2) or die("Error in Deleting child2" . mysqli_error($connection));
				}
				else
				{
					$sql2 = "DELETE FROM `lr_categories` where `LR_Category_ID` = ".$child2['categoryid'];

					$result2 = mysqli_query($connection, $sql2) or die("Error in Deleting child2" . mysqli_error($connection));
				}
			}
			$sql1 = "DELETE FROM `lr_categories` where `LR_Category_ID` = ".$child1['categoryid'];

			$result1 = mysqli_query($connection, $sql1) or die("Error in Deleting child1" . mysqli_error($connection));
		}
		else
		{
			$sql1 = "DELETE FROM `lr_categories` where `LR_Category_ID` = ".$child1['categoryid'];

			$result = mysqli_query($connection, $sql1) or die("Error in Deleting child1" . mysqli_error($connection));
		}
	}	
	$sql = "DELETE FROM `lr_categories` where `LR_Category_ID` = ".$cat['categoryid'];

	$result = mysqli_query($connection, $sql) or die("Error in Deleting parent" . mysqli_error($connection));
}
else
{
	$sql = "DELETE FROM `lr_categories` where `LR_Category_ID` = ".$cat['categoryid'];

	$result = mysqli_query($connection, $sql) or die("Error in Deleting " . mysqli_error($connection));
}
mysqli_close($connection);
?>