<?php

//open connection to mysql db
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');

//create an array
$tempCatList = array();
$listFormat=array();
	
//SQL quries to get categories
$sql = "SELECT * FROM `lr_categories`";
$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));
	
// add categories to an array
while($row =mysqli_fetch_array($result))
{
	array_push($tempCatList,
		array('categoryid' => $row['LR_Category_ID'],
		'parentid' => $row['Category_Parent_ID'],
		'title' => $row['Name'],
		'DCS'=> $row['DCS_id'],
		));
}
	
//Convert array to a tree structure
foreach ($tempCatList as $a)
{
	$listFormat[$a['parentid']][] = $a;
}
$tree = createTree($listFormat, $listFormat[0]);
	
$treeList['categoryid'] = 0;
$treeList['children'] = $tree;
$treeList['isexists'] = null;
$treeList['parentid'] = 0;
$treeList['title'] = null;
        
	
function createTree(&$list, $parent){
    $tree = array();
    foreach ($parent as $k=>$l)
	{
        if(isset($list[$l['categoryid']]))
		{
            $l['children'] = createTree($list, $list[$l['categoryid']]);
        }
        $tree[] = $l;
    } 
    return $tree;
}

echo json_encode($treeList);
mysqli_close($connection);
unset($connection);
	
?>


