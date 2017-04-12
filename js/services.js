materialAdmin

    // =========================================================================
    // Header Messages and Notifications list Data
    // =========================================================================

    .service('messageService', ['$resource', function($resource){
        this.getMessage = function(img, user, text) {
            var gmList = $resource("data/messages-notifications.json");
            
            return gmList.get({
                img: img,
                user: user,
                text: text
            });
        }
    }])
    

    // =========================================================================
    // Best Selling Widget Data (Home Page)
    // =========================================================================

    .service('bestsellingService', ['$resource', function($resource){
        this.getBestselling = function(img, name, range) {
            var gbList = $resource("data/best-selling.json");
            
            return gbList.get({
                img: img,
                name: name,
                range: range,
            });
        }
    }])

    
    // =========================================================================
    // category list on the add-products-magento page - plan B
    // =========================================================================

    .service('todoService', ['$resource', function($resource){
        this.getTodo = function(todo) {
            var todoList = $resource("data/todo.json");
            
            return todoList.get({
                todo: todo
            });
        }
    }])


    // =========================================================================
    // Recent Items Widget Data
    // =========================================================================
    
    .service('recentitemService', ['$resource', function($resource){
        this.getRecentitem = function(id, name, price) {
            var recentitemList = $resource("data/recent-items.json");
            
            return recentitemList.get ({
                id: id,
                name: name,
                price: price
            })
        }
    }])


    // =========================================================================
    // Recent Posts Widget Data
    // =========================================================================
    
    .service('recentpostService', ['$resource', function($resource){
        this.getRecentpost = function(img, user, text) {
            var recentpostList = $resource("data/messages-notifications.json");
            
            return recentpostList.get ({
                img: img,
                user: user,
                text: text
            })
        }
    }])
    
    // =========================================================================
    // Data Table
    // =========================================================================
    
    .service('tableService', [function () {
        this.data = [];
      
        var srvData = {};

        $.ajax({
            url: "services/WebInfoDataService.svc/GetProducts/json/1",
            //url: "http://localhost/angular/services/WebInfoDataService.svc/GetProducts/json/1",
			//url: "services/GetProducts.php",
            type: 'GET',
            async: false,
			cache: false,
            dataType: "json",
            'success': function (result) {
                //srvData = JSON.parse(JSON.stringify(result.GetProductsResult));;
				srvData = JSON.parse(JSON.stringify(result));;
				console.log(result);
                //fn(result.GetProductsResult);

            }
        });
        this.data = srvData;     
    }])

 
.service('getTasks', [function () {
    this.data = [];

    var srvData = {};

    $.ajax({
        url: "services/WebInfoDataService.svc/services/WebInfoDataService.svc/GetTasks/json",
		//url: "services/GetTask.php/1",
        type: 'GET',
        async: false,
        dataType: "json",
        'success': function (result) {
            //srvData = JSON.parse(JSON.stringify(result.GetTasksResult));;
            srvData = JSON.parse(JSON.stringify(result));;

        }
    });



    this.data = srvData;

}])


   

    // =========================================================================
    // Malihu Scroll - Custom Scroll bars
    // =========================================================================
   .service('scrollService', function() {
        var ss = {};
        ss.malihuScroll = function scrollBar(selector, theme, mousewheelaxis) {
            $(selector).mCustomScrollbar({
                theme: theme,
                scrollInertia: 100,
                axis:'yx',
                mouseWheel: {
                    enable: true,
                    axis: mousewheelaxis,
                    preventDefault: true
                }
            });
        }
        
        return ss;
    })


    //==============================================
    // BOOTSTRAP GROWL
    //==============================================

    .service('growlService', function(){
        var gs = {};
        gs.growl = function(message, type) {
            $.growl({
                message: message
            },{
                type: type,
                allow_dismiss: false,
                label: 'Cancel',
                className: 'btn-xs btn-inverse',
                placement: {
                    from: 'top',
                    align: 'right'
                },
                delay: 2500,
                animate: {
                        enter: 'animated bounceIn',
                        exit: 'animated bounceOut'
                },
                offset: {
                    x: 20,
                    y: 85
                }
            });
        }
        
        return gs;
    })

 .directive('exportCsv', ['$parse', function ($parse) {
     return {
         restrict: 'A',
         scope: false,
         link: function (scope, element, attrs) {
             var data = '';
             var csv = {
                 stringify: function (str) {
                     return '"' +
                         str.replace(/^\s\s*/, '').replace(/\s*\s$/, '') // trim spaces
                             .replace(/"/g, '""') + // replace quotes with double quotes
                         '"';
                 },

                 link: function () {
                     return 'data:text/csv;charset=UTF-8,' + encodeURIComponent(data);
                 }
             };
             $parse(attrs.exportCsv).assign(scope.$parent, csv);
         }
     };
 }]);

 