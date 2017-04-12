materialAdmin
    .controller('tableCtrl', function ($filter, $sce, ngTableParams, tableService) {
        var data = tableService.data;

        this.export = function () {
            $(".expcsv").tableToCSV();
        }

   //page load
        this.Load = function (event) {

            var value_or_null = (document.cookie.match(/^(?:.*;)?LinkedRetail=([^;]+)(?:.*)?$/) || [, null])[1]

            if (value_or_null == null) 
            {
                location.href = 'login.html';
            }

        }

        //Basic Example
        this.tableBasic = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: data.length, // length of data
            getData: function ($defer, params) {
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        })

        //Sorting
        this.tableSorting = new ngTableParams({
            page: 1,            // show first page
            count: 10,           // count per page
            sorting: {
                name: 'asc'     // initial sorting
            }
        }, {
            total: data.length, // length of data
            getData: function ($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        })

        //Filtering
        this.tableFilter = new ngTableParams({
            page: 1,            // show first page
            count: 10
        }, {
            total: data.length, // length of data
            getData: function ($defer, params) {
                // use build-in angular filter
                var orderedData = params.filter() ? $filter('filter')(data, params.filter()) : data;

                this.id = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                this.name = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                this.email = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                this.username = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                this.contact = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(this.id, this.name, this.email, this.username, this.contact);
            }
        })

        //Editable
        this.tableEdit = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: data.length, // length of data
            getData: function ($defer, params) {
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

		//N V Start
		this.product = function (val) {
            //get product details
            var srvData = {};

            $.ajax({
                url: "services/GetProductDetails.php",
                type: 'GET',
                async: false,
                cache: false,
                data: { id: val },
                dataType: "json",
                'success': function (result) {
                    srvData = JSON.parse(JSON.stringify(result));;
					alert(JSON.stringify(result));
					console.log(result);
                }
            });
        }
		//N V End
		
    })
