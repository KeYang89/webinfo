// Todo Controller
materialAdmin.controller('TodoController', ['$scope', function($scope) {
  
  // Todo title
    $scope.title = 'Mapping Attribute Sets and Attributes';
   //var hosturl = "services/WebInfoDataService.svc/";

    /////////////////////////////////////////////////////////////////////////////////////////////
	
    // Array of all attributesets     
    var getincompleteTasks = [];
    var srvincompleteTasksData = {};
    //hosturl
    $.ajax({
        url: "services/GetTask.php", 
        type: 'GET',
        cache: false,//N V
        async: false,
        contentType: 'application/json; charset=utf-8',
	   data:{id:0},
        dataType: "json",
        'success': function (result) {
            srvincompleteTasksData = JSON.parse(JSON.stringify(result));;
        }
    });
     
    getincompleteTasks = srvincompleteTasksData;
    $scope.tasks = getincompleteTasks;
 
 //page load
    this.Load = function (event) {

        var value_or_null = (document.cookie.match(/^(?:.*;)?LinkedRetail=([^;]+)(?:.*)?$/) || [, null])[1]

        if (value_or_null == null) 
        {
            location.href = 'login.html';
        }
    }
 
    // Array of selected attributeset
    var getcompletdTasks = [];
    var srvcompletedTasksData = {};
    $.ajax({
        url: "services/GetTask.php",
        type: 'GET',
        cache: false,//N V
        async: false,
        contentType: 'application/json; charset=utf-8',
		data:{id:1},
        dataType: "json",
        'success': function (result) {
            srvcompletedTasksData = JSON.parse(JSON.stringify(result));;
        }
    });

    getcompletdTasks = srvcompletedTasksData;
    $scope.tasksComplete = getcompletdTasks;

    // Array of input attributes
    var getTagsInput = [];
    var srvgetTagsInputData = {};
    $.ajax({
        url: "services/GetTagInput.php",
        type: 'GET',
        cache: false,//N V
        async: false,
        contentType: 'application/json; charset=utf-8',        
        dataType: "json",
        'success': function (result) {
           srvgetTagsInputData = JSON.parse(JSON.stringify(result));;
        }
    });
     
    getTagsInput = srvgetTagsInputData;
    $scope.tagsinput = getTagsInput;

    // Array of dropdown attributeset
    var getTags = [];
    var srvTagsData = {};
    $.ajax({
        url: "services/GetTags.php",
        type: 'GET',
        cache: false,//N V
        async: false,
        contentType: 'application/json; charset=utf-8',      
        dataType: "json",
        'success': function (result) {
            srvTagsData = JSON.parse(JSON.stringify(result));;
        }
    });

    getTags = srvTagsData;

    // Ke Yang - json file format example for attribute sets and input attribute options
    $scope.tags = getTags;

//// Please load all the attributes within all attribute sets in id 0 for fetch in step 3. Add or remove Options in Attributes

  $scope.savePageValues = function () {
     
      var tasks = JSON.stringify($scope.tasks);
      var tasksComplete = JSON.stringify($scope.tasksComplete);
      var tags = JSON.stringify($scope.tags);
      var tagsInputs = JSON.stringify($scope.tagsinput);
	  
      var attrdata = {
          id: 1,
          tasksuncom:  tasks ,
          taskcom:  tasksComplete ,
          tag:  tags ,
          taginput:  tagsInputs 
      };
      attrdata = JSON.stringify(attrdata);

      $.ajax({
          url: "services/SaveAttributeSettings.php",
          type: "POST",
          async: false,
          contentType: 'application/json; charset=utf-8',
          data: attrdata,
          'success': function (result) {
          },
          error: function (result) {
             var errmsg = result;
          }
      });
};

  // Create a new attributeset
  $scope.createTask = function() {  
      var newTaskID = 0;
      $.ajax({
		  url: "services/insertNewAttributeSet.php",
          type: "POST",
          async: false,
          contentType: 'application/json; charset=utf-8',
          dataType: "json",
		  data: JSON.stringify($scope.newTitle),
          'success': function (result) {
				newTaskID = result;
          }
      });
    
    $scope.tasks.unshift({ 
        title: $scope.newTitle,
        attrsetid : newTaskID,
        id: $scope.tasks.length + 1,
        complete:false
    });

    $scope.newTitle = '';

  };
  
  // Remove an attributeset
  $scope.removeTask = function(index) {
    var task = $scope.tasks[index];
    $scope.tasks.splice($scope.tasks.indexOf(task), 1);
	
	var json = JSON.stringify(task);
	
    $.ajax({
		url: "services/deleteAttributeSet.php",
        type: "POST",
        async: false,
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
		data: json,
        'success': function (result) {
        }
    });
  };
  
  // select an attributeset
  $scope.completeTask = function(index) {
    var task = $scope.tasks[index];
    task.complete = true;
    
	var json = JSON.stringify(task);

    $.ajax({
        url: "services/updatesAttributeSet.php",
        type: "POST",
        async: false,
        contentType: 'application/json; charset=utf-8',
		data: json,
        dataType: "json",
        'success': function (result) {
        }
    });

    $scope.tasks.splice($scope.tasks.indexOf(task), 1);
    $scope.tasksComplete.unshift(task);
     
    location.reload();
  };
  
  // Unselect an attributeset 
  $scope.uncompleteTask = function(index) {
      var task = $scope.tasksComplete[index];
      task.complete = false;
    $scope.tasksComplete.splice($scope.tasksComplete.indexOf(task), 1);
    $scope.tasks.unshift(task);

	var json = JSON.stringify(task);

    $.ajax({
        url: "services/updatesAttributeSet.php",
        type: "POST",
        async: false,
        contentType: 'application/json; charset=utf-8',
		data: json,
        dataType: "json",
        'success': function (result) {
        }
    });

    location.reload();
  };
  
  // Get total attributeset
  $scope.taskLength = function() {
    return $scope.tasks.length + $scope.tasksComplete.length;
  };
  
  // Create percentages - attributeset
  $scope.taskCompletionTotal = function(unit) {
    var total = $scope.taskLength();
    return Math.floor(100 / total * unit);
  };

}]);
