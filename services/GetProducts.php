<?php

//open connection to mysql db
require_once("config.php");
$connection = mysqli_connect(DBHOST, DBUSER, DBPASS) or die('Could not connect to database server.');
mysqli_select_db($connection,DBNAME) or die('Could not select database.');

//fetch table rows from mysql db
$sql = "SELECT a.LR_ID, a.ITEM_ID, b.LR_PRODUCT_INFO_ID,  b.LR_PRODUCT_NAME, b.LR_WEB_SKU, c.LR_PRICE FROM lr_invn a, lr_product_info b, lr_rp_price c  WHERE a.LR_ID = b.LR_ID AND b.LR_PRODUCT_INFO_ID = c.LR_PRODUCT_INFO_ID";
$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));
	
//create an array
$product = array();

while($row =mysqli_fetch_array($result))
{
array_push($product,
	array('id' => $row[2],
	'name' => $row[3],
	'websku' => $row[4],
	'itemnumber'=> $row[1],
	'price'=> $row[5],
	));	
}

//Removes duplicates from an entity
$new_array = array();
$exists    = array();
foreach( $product as $element ) {
    if( !in_array( $element['id'], $exists )) {
        $new_array[] = $element;
        $exists[]    = $element['id'];
    }}
	
echo json_encode($new_array);
mysqli_close($connection);

?>