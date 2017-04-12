<?php

//open connection to mysql db
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');

//create an array
$product = array();
$id = $_GET['id'];

//fetch data from mysql db
$sql = "SELECT `LR_PRODUCT_NAME`, `LR_WEB_SKU`, `LR_SHORT_DESC`, `LR_LONG_DESC`, `LR_CATEGORY`, `TRACK_INVENTORY`, `BACKORDER_MESSAGE`, `SALES_FROM_DATE`, `SALES_TO_DATE`, `SALES_NEWS_FROM_DATE`, `SALES_NEWS_TO_DATE`, `LR_COLOR1`, `LR_COLOR2`, `LR_COLOR3`, `LR_COLOR4`, `META_TITLE`, `META_KEYWORDS`, `META_DESC` FROM `lr_product_info` WHERE `LR_PRODUCT_INFO_ID`=$id";
$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));

while($row =mysqli_fetch_array($result))
{
	array_push($product,
		array('productName' => $row[0],
		'webSku' => $row[1],
		'shortDesc' => $row[2],
		'longDesc' => $row[3],
		'category' => $row[4],
		'invn' => $row[5],
		'backorderMsg' => $row[6],
		'salesfromdate' => $row[7],
		'salestodate' => $row[8],
		'salesnewsfromdate' => $row[9],
		'salesnewstodate' => $row[10],
		'color1' => $row[11],
		'color2' => $row[12],
		'color3' => $row[13],
		'color4' => $row[14],
		'metatitle' => $row[15],
		'metakeywords' => $row[16],
		'metadesc' => $row[17]
	));	
}

$sql1 = "SELECT `LR_QTY` FROM `lr_rp_qty` WHERE `LR_PRODUCT_INFO_ID`=$id";
$result1 = mysqli_query($connection, $sql1) or die("Error in Selecting " . mysqli_error($connection));

while($row1 =mysqli_fetch_array($result1))
{
	array_push($product,
		array('qty' => $row1[0]
	));	
}

$sql2 = "SELECT `LR_PRICE`, `LR_DISCOUNT_PRI` FROM `lr_rp_price` WHERE `LR_PRODUCT_INFO_ID`=$id";
$result2 = mysqli_query($connection, $sql2) or die("Error in Selecting " . mysqli_error($connection));

while($row2 =mysqli_fetch_array($result2))
{
	array_push($product,
		array('price' => $row2[0],
		'discountprice' => $row2[1]
	));	
}

$sql3 = "SELECT `LR_ATTR_SET`, `LR_ATTR_1`, `LR_ATTR_2`, `LR_ATTR_3`, `LR_ATTR_4`, `LR_ATTR_5`, `LR_ATTR_6`, `LR_ATTR_7`, `LR_ATTR_8`, `LR_ATTR_9`, `LR_ATTR_10`, `LR_LOCAL_UPC` FROM `lr_rp_attr` WHERE `LR_PRODUCT_INFO_ID`=$id";
$result3 = mysqli_query($connection, $sql3) or die("Error in Selecting " . mysqli_error($connection));

while($row3 =mysqli_fetch_array($result3))
{
	array_push($product,
		array('attrset' => $row3[0],
		'attr1' => $row3[1],
		'attr2' => $row3[2],
		'attr3' => $row3[3],
		'attr4' => $row3[4],
		'attr5' => $row3[5],
		'attr6' => $row3[6],
		'attr7' => $row3[7],
		'attr8' => $row3[8],
		'attr9' => $row3[9],
		'attr10' => $row3[10],
		'upc' => $row3[11]
	));	
}
	
$sql4 = "SELECT `LR_ITEM_DEFAULT_IMAGE`, `LR_ITEM_DEFAULT_IMAGE_ALT`, `LR_ITEM_THUMBNAIL`, `LR_ITEM_THUMBNAIL_ALT`, `LR_ITEM_SMALL_IMAGE`, `LR_ITEM_SMALL_IMAGE_ALT`, `LR_ITEM_IMAGES` FROM `lr_rp_image` WHERE `LR_PRODUCT_INFO_ID`=$id";
$result4 = mysqli_query($connection, $sql4) or die("Error in Selecting " . mysqli_error($connection));

while($row4 =mysqli_fetch_array($result4))
{
	array_push($product,
		array('defaultimg' => $row4[0],
		'defaultimgalt' => $row4[1],
		'thumbnailimg' => $row4[2],
		'thumbnailimgalt' => $row4[3],
		'smallimg' => $row4[4],
		'smallimgalt' => $row4[5],
		'itemimages' => $row4[6]
	));	
}

$p = json_encode($product);
$p = str_replace(array('[',']',' ','{','}'),"",$p);
$p = '{'.$p.'}';

echo $p;
mysqli_close($connection);

?>