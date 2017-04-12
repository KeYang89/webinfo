<?php

//open connection to mysql db
//$connection = mysqli_connect("localhost","lr_db","Esegna$2015","lr_db") or die("Error " . mysqli_error($connection));
$connection = mysqli_connect("localhost","lrcloud-u","coyote1989","lr_db") or die("Error " . mysqli_error($connection));

// Escape user inputs for security
$alt = mysqli_real_escape_string($connection, $_POST['alt']);
   if (isset($_POST['default'])){
        $default= $_POST['default'];
    }
    if (isset($_POST['small'])){
        $small= $_POST['small'];
    }
           if (isset($_POST['thumbnail'])){
        $thumbnail= $_POST['thumbnail'];
    }
           if (isset($_POST['hiddenImageNameList'])){
        $galleryList= $_POST['hiddenImageNameList'];
        echo "Images to upload: ".$galleryList."<br />";
    }
echo $_POST['alt'].$default.$small.$thumbnail.$galleryList;
// $sql = "INSERT INTO lr_rp_image (LR_ITEM_DEFAULT_IMAGE,
	// LR_ITEM_THUMBNAIL,
	// LR_ITEM_SMALL_IMAGE,
	// LR_ITEM_IMAGES) VALUES ('$default', '$small', '$thumbnail','$galleryList')";
// $res=mysql_query($sql);
// if($res)
// {
// echo 'Successfully Updated, click anywhere to go back';
// }
// else
// {
// echo 'Oops an error occured when updating the database, please try again later';
// }
?>

      