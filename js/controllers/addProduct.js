materialAdmin.controller('addProductController', ['$scope', function ($scope) {
    $scope.title = 'Add Product to Magento';
    $scope.product = { attributes: [],categories: [] };
    var prodimage = '';
    var brandimg = '';
    var prodradiosel = '';
    
     $('#getImageResult').click(function(){
                var imagename = sessionStorage.allfilename;
                prodradiosel = sessionStorage.allcheckedlist;
                $("#imageResult").text(imagename);
                prodimage = imagename;
    });

    // $('#getLogoResult').click(function () {
        // var imagename = sessionStorage.allfilename;
                // $("#imageResults").text(imagename);
                // brandimg = imagename;
    // });

    if ($scope.data == undefined) {
        $.ajax({
            url: "services/getCategories.php",
            type: "GET",
            async: false,
            cache: false,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            'success': function (result) {
                $scope.data = JSON.parse(JSON.stringify(result));;
            }
        });
    }

     //page load
    this.Load = function (event) {

        var value_or_null = (document.cookie.match(/^(?:.*;)?LinkedRetail=([^;]+)(?:.*)?$/) || [, null])[1]

        if (value_or_null == null) 
        {
            location.href = 'login.html';
        }
    }
    // Array of Completed Tasks
    var getcompletdTasks = [];
    var srvcompletedTasksData = {};
    $.ajax({
    url: "services/GetTask.php",
        type: 'GET',
        cache: false,//N V
        async: false,
        cache: false,
        contentType: 'application/json; charset=utf-8',
        data: {id:1},
        dataType: "json",
        'success': function (result) {
        srvcompletedTasksData = JSON.parse(JSON.stringify(result));;
        }
    });

    getcompletdTasks = srvcompletedTasksData;
    $scope.tasksComplete = getcompletdTasks;

    // Array of Tags
    var getTags = [];
    var srvTagsData = {};

    $scope.saveProduct = function () {
        $scope.product.shortdesc = $(".note-editable")[0].innerHTML;
        $scope.product.longdesc = $(".note-editable")[1].innerHTML;

        $scope.product.productcolor1 = $(".color1").val();
        $scope.product.productcolor2 = $(".color2").val();
        $scope.product.productcolor3 = $(".color3").val();
        $scope.product.productcolor4 = $(".color4").val();

        $scope.product.categories = $(".selCats")[0].innerText;
        
        $scope.product.productimage = prodimage;
		$scope.product.prodradioimages = prodradiosel;
        $scope.product.brandimage = brandimg;
		
		if ($scope.product.invModel == '')
        { $scope.product.invModel = 'False'; }
        else
        { $scope.product.invModel = 'True'; }
        
        var salesfromdate = new Date($scope.product.salesfromdt);
        var salestodate = new Date($scope.product.salestodt);
        var salesnewsfromdate = new Date($scope.product.salesnewsfromdt);
        var salesnewstodate = new Date($scope.product.salesnewstodt);
        var format = "YYYY-MM-DD";
		
        $scope.product.salesfromdt = dateConvert(salesfromdate, format);
        $scope.product.salestodt = dateConvert(salestodate, format);
        $scope.product.salesnewsfromdt = dateConvert(salesnewsfromdate, format);
        $scope.product.salesnewstodt = dateConvert(salesnewstodate, format);
		
        var addprods = JSON.stringify($scope.product);

        $.ajax({
            url: "services/SaveProduct.php",
            type: "POST",
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: addprods,
            'success': function (result) {
                console.log(addprods);
				//N V
				if(result == 'success')
				{location.reload();}
			else{alert(result);}
            },
            error: function (result) {
                var e = result;
                console.log(result);
            }
        });
    };

	//Begin Vishruthi 12/15/2016 Duplicate product
	$scope.dupProduct = function () {
        var retVal = confirm("Are you sure to duplicate the product information?");

        if (retVal == true) {
            $scope.product.shortdesc = $(".note-editable")[0].innerHTML;
            $scope.product.longdesc = $(".note-editable")[1].innerHTML;

            $scope.product.productcolor1 = $(".color1").val();
            $scope.product.productcolor2 = $(".color2").val();
            $scope.product.productcolor3 = $(".color3").val();
            $scope.product.productcolor4 = $(".color4").val();

            $scope.product.categories = $(".selCats")[0].innerText;

            $scope.product.productimage = prodimage;
            $scope.product.prodradioimages = prodradiosel;
            $scope.product.brandimage = brandimg;

            if ($scope.product.invModel == '')
            { $scope.product.invModel = 'False'; }
            else
            { $scope.product.invModel = 'True'; }

            var salesfromdate = new Date($scope.product.salesfromdt);
            var salestodate = new Date($scope.product.salestodt);
            var salesnewsfromdate = new Date($scope.product.salesnewsfromdt);
            var salesnewstodate = new Date($scope.product.salesnewstodt);
            var format = "YYYY-MM-DD";

            $scope.product.salesfromdt = dateConvert(salesfromdate, format);
            $scope.product.salestodt = dateConvert(salestodate, format);
            $scope.product.salesnewsfromdt = dateConvert(salesnewsfromdate, format);
            $scope.product.salesnewstodt = dateConvert(salesnewstodate, format);

            var addprods = JSON.stringify($scope.product);

            $.ajax({
                url: "services/SaveProduct.php",
                type: "POST",
                async: false,
                contentType: 'application/json; charset=utf-8',
                data: addprods,
                'success': function (result) {
                    console.log(addprods);
                    //N V
                    if (result == 'success')
                    {  }
                    else { alert(result); }
                },
                error: function (result) {
                    var e = result;
                    alert(result);
                }
            });
        }
        else {
            //location.reload();
        }
    };
	//End Vishruthi 12/15/2016 Duplicate product
	
    $scope.GetValue = function (ctrl, selectAttr) {
        angular.forEach($scope.product.attributes, function (item) {
            if (item.name == ctrl) {
                var index = $scope.product.attributes.indexOf(item);
                $scope.product.attributes.splice(index, 1)
            }
        });
        $scope.product.attributes.push({ name: ctrl, value: selectAttr });
    }

    
    $scope.GetAttributes = function (taskid) {
        $.ajax({
            url: "services/GetAttributesByAttrSet.php",
            type: 'GET',
            async: false,
            contentType: 'application/json; charset=utf-8',
        data: {name:taskid},
            dataType: "json",
            'success': function (result) {
        console.log(result);
                var t = JSON.parse(JSON.stringify(result));
                srvTagsData = JSON.parse(JSON.stringify(result));
            },
    error: function(result){
    console.log(result);
}
        });

        $scope.tags = srvTagsData;
    }

    $scope.GetTextAreaValue = function (ctrl) {

        var test = ctrl;
    }
    
    function dateConvert(dateobj, format) {
        var year = dateobj.getFullYear();
        var month = ("0" + (dateobj.getMonth() + 1)).slice(-2);
        var date = ("0" + dateobj.getDate()).slice(-2);
        var hours = ("0" + dateobj.getHours()).slice(-2);
        var minutes = ("0" + dateobj.getMinutes()).slice(-2);
        var seconds = ("0" + dateobj.getSeconds()).slice(-2);
        var day = dateobj.getDay();
        var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        var dates = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        var converted_date = "";

        switch (format) {
            case "YYYY-MM-DD":
                converted_date = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
                break;
            case "YYYY-MMM-DD DDD":
                converted_date = year + "-" + months[parseInt(month) - 1] + "-" + date + " " + dates[parseInt(day)];
                break;
        }
        
		//Check if date is valid
		if(!Date.parse(converted_date))
		{
			converted_date = new Date(0);
		}
		
        return converted_date;
    }
    
}]);

    