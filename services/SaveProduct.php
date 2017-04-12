<?php
$AddProduct =json_decode(file_get_contents('php://input'), true);

//Open connection to mysql db
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');

$attrSet = array();
$tree = array();

//Appending attribute sets
$count = 0;
if(!empty($AddProduct['attributes']))
{
foreach($AddProduct['attributes'] as $attr)
{
	$builder = $attr['name'].':'.$attr['value'];
	
	++$count;
	if ($count <= 10)
	{array_push($attrSet,$builder);}	
}
}
$c = count($attrSet);

for ($i = 0; $i <= 10 - $c; $i++)
{array_push($attrSet,null);}

//Appending Categories
$cat= str_replace(array('[',']',' '),"",$AddProduct['categories']);
$categories = explode(',', $cat);
//echo json_encode($categories);

$catCount = 0;
$conCatStr = '';
$parentId = 0;
foreach($categories as $category)
{
	//echo $category;
	$catParents = array();
	++$catCount;
	$b = true;
	
		$selText = "SELECT * from `lr_categories` WHERE `LR_Category_ID`=".$category;
		
		$results = mysqli_query($connection, $selText) or die("Error in select " . mysqli_error($connection).$selText);
		while($row = mysqli_fetch_array($results))
		{
			array_push($catParents,$row['Name']);
			$parentId = $row['Category_Parent_ID'];
		}
		
		while($b){
			if($parentId != 0)
			{
			$selParent = "SELECT * FROM `lr_categories` WHERE `LR_Category_ID` =".$parentId." and `Category_Parent_ID` is not null and `Category_Parent_ID` <> 2";
			$resultParent = mysqli_query($connection, $selParent) or die("Error in select " . mysqli_error($connection).$selParent);
			while($row = mysqli_fetch_array($resultParent))
			{
				array_push($catParents,$row['Name']);
				$parentId = $row['Category_Parent_ID'];
			}
			}
			else{$b = false;}
		}
	$catParents = array_reverse($catParents);
	$CatStr=implode('>',$catParents);
	if($catCount == 1)
	{
		$conCatStr = $CatStr;
	}
	else{
	$conCatStr = $conCatStr.';'.$CatStr;
	}	
}
//Inserting data
$lastInsertSetId = 0;
$sql0 = "INSERT INTO `lr_product_info`(`LR_ID`, `LR_PRODUCT_NAME`, `LR_WEB_SKU`, `LR_SHORT_DESC`, `LR_LONG_DESC`, `LR_CATEGORY`,`TRACK_INVENTORY`, `BACKORDER_MESSAGE`, `SALES_FROM_DATE`, `SALES_TO_DATE`, `SALES_NEWS_FROM_DATE`, `SALES_NEWS_TO_DATE`, `LR_COLOR1`, `LR_COLOR2`, `LR_COLOR3`, `LR_COLOR4`,`META_TITLE`, `META_KEYWORDS`, `META_DESC`) VALUES (1,'".$AddProduct['name']."','".$AddProduct['websku']."','".$AddProduct['shortdesc']."','".$AddProduct['longdesc']."','".$conCatStr."',' ','".$AddProduct['backordermsg']."','".$AddProduct['salesfromdt']."','".$AddProduct['salestodt']."','".$AddProduct['salesnewsfromdt']."','".$AddProduct['salesnewstodt']."','".$AddProduct['productcolor1']."','".$AddProduct['productcolor2']."','".$AddProduct['productcolor3']."','".$AddProduct['productcolor4']."','".$AddProduct['metatitle']."','".$AddProduct['metakeywords']."','".$AddProduct['metadesc']."');";
$result0 = mysqli_query($connection, $sql0) or die("Error in Inserting " . mysqli_error($connection));

$lastInsertSetId = mysqli_insert_id($connection);

$sql1 = "INSERT INTO `lr_rp_qty`(`LR_ID`, `LR_PRODUCT_INFO_ID`,`LR_QTY`) VALUES (1,".$lastInsertSetId.",".$AddProduct['quantity'].");";
$result1 = mysqli_query($connection, $sql1) or die("Error in Inserting " . mysqli_error($connection));

$sql2 = "INSERT INTO `lr_rp_price`(`LR_ID`, `LR_PRODUCT_INFO_ID`,`LR_PRICE`, `LR_DISCOUNT_PRI`) VALUES (1,".$lastInsertSetId.",".$AddProduct['originalprice'].",".$AddProduct['specialprice'].");";
$result2 = mysqli_query($connection, $sql2) or die("Error in Inserting " . mysqli_error($connection));

$sql3 = "INSERT INTO `lr_rp_attr`(`LR_ID`, `LR_PRODUCT_INFO_ID`, `LR_ATTR_SET`, `LR_ATTR_1`, `LR_ATTR_2`, `LR_ATTR_3`, `LR_ATTR_4`, `LR_ATTR_5`, `LR_ATTR_6`, `LR_ATTR_7`, `LR_ATTR_8`, `LR_ATTR_9`, `LR_ATTR_10`, `LR_LOCAL_UPC`, `LR_GLOBAL_UPC`, `LR_TEXT1`) VALUES (1,".$lastInsertSetId.",'".$AddProduct['attributeset']."','".$attrSet[0]."','".$attrSet[1]."','".$attrSet[2]."','".$attrSet[3]."' ,'".$attrSet[4]."' , '".$attrSet[5]."' ,'".$attrSet[6]."','".$attrSet[7]."' ,'".$attrSet[8]."','".$attrSet[9]."','".$AddProduct['upc']."','".$AddProduct['upc']."','NULL');";
$result3 = mysqli_query($connection, $sql3) or die("Error in Inserting " . mysqli_error($connection).$sql3);

//differntiate the radio selections
$images = explode(';', $AddProduct['prodradioimages']);
$default = '';
$small = '';
$thumbnail = '';
foreach($images as $image)
{
	if(strpos($image,'default') !== False)
	{
		$dimg = explode(':', $image);
		$default = $dimg[1];
	}
	else if(strpos($image,'small') !== False)
	{
		$simg = explode(':', $image);
		$small = $simg[1];
	}
	else if(strpos($image,'thumbnail') !== False)
	{
		$timg = explode(':', $image);
		$thumbnail = $timg[1];
	}
}

$sql4 = "INSERT INTO `lr_rp_image`(`LR_ID`, `LR_PRODUCT_INFO_ID`, `LR_ITEM_DEFAULT_IMAGE`, `LR_ITEM_DEFAULT_IMAGE_ALT`, `LR_ITEM_THUMBNAIL`, `LR_ITEM_THUMBNAIL_ALT`, `LR_ITEM_SMALL_IMAGE`, `LR_ITEM_SMALL_IMAGE_ALT`, `LR_ITEM_IMAGES`) VALUES (1,$lastInsertSetId,'".$default."','','".$thumbnail."','','".$small."','','".$AddProduct['productimage']."');";
$result4 = mysqli_query($connection, $sql4) or die("Error in Inserting " . mysqli_error($connection).$sql4);

echo 'success';

mysqli_close($connection);
?>