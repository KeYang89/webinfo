var app = angular.module('main', ['ngTable', 'ngTableExport']).
               controller('DemoCtrl', function ($scope, $filter, ngTableParams, $sce) {
                   var data = [
                       { "id": 1, name: "Bobby", gender: "F", age: 27, email: "bobby@spring.com", number: 323231102, salary: 210, position: "CEO", role: 'Administrator' },
                       { "id": 2, name: "Enos", gender: "M", age: 34, email: "enos@spring.com", number: 320455239, salary: 150, position: "Minion", role: 'Moderator' },
                       { "id": 3, name: "Tom", gender: "M", age: 43, email: "tom@spring.com", number: 323277662, salary: 110, position: "Minion", role: 'User' },
                       { "id": 4, name: "Jane", gender: "F", age: 27, email: "jane@spring.com", number: 323230002, salary: 120, position: "Minion", role: 'User' },
                       { "id": 5, name: "Nana", gender: "F", age: 29, email: "nana@spring.com", number: 323756786, salary: 120, position: "VP of Marketing", role: 'User' },
                       { "id": 6, name: "Enos", gender: "M", age: 34, email: "enos@spring.com", number: 320455239, salary: 180, position: "VP of Engineering", role: 'User' },
                       { "id": 7, name: "Tom", gender: "M", age: 48, email: "tom@spring.com", number: 321177662, salary: 100, position: "Minion", role: 'User' },
                       { "id": 8, name: "Yone", gender: "F", age: 27, email: "yone@spring.com", number: 329230002, salary: 190, position: "Crazy Scientist", role: 'Moderator' },
                       { "id": 9, name: "Luna", gender: "F", age: 29, email: "luna@spring.com", number: 323756786, salary: -60, position: "Minion", role: 'User' },
                       { "id": 10, name: "Unos", gender: "M", age: 36, email: "unos@spring.com", number: 320755239, salary: 150, position: "Minion", role: 'Moderator' },
                       { "id": 11, name: "Tim", gender: "M", age: 43, email: "tim@spring.com", number: 323277662, salary: 210, position: "Minion", role: 'User' },
                       { "id": 12, name: "Jane", gender: "F", age: 27, email: "jane@spring.com", number: 323230002, salary: 190, position: "Minion", role: 'User' },
                       { "id": 13, name: "Nara", gender: "F", age: 39, email: "nara@spring.com", number: 323156786, salary: 120, position: "Minion", role: 'Moderator' },
                       { "id": 14, name: "Jessica", gender: "F", age: 27, email: "jessicaspring.com", number: 323230802, salary: 160, position: "VP of Engineering", role: 'Moderator' },
                       { "id": 15, name: "Nancy", gender: "F", age: 29, email: "nancy@spring.com", number: 323756086, salary: 110, position: "Minion", role: 'User' },
                       { "id": 16, name: "Enos", gender: "M", age: 34, email: "enos@spring.com", number: 320455239, salary: -10, position: "Minion", role: 'User' },
                       { "id": 17, name: "Theom", gender: "M", age: 43, email: "theom@spring.com", number: 323077662, salary: 150, position: "Minion", role: 'User' },
                       { "id": 18, name: "Jinne", gender: "F", age: 22, email: "jinne@spring.com", number: 323230002, salary: -10, position: "Minion", role: 'User' },
                       { "id": 19, name: "Nana", gender: "F", age: 29, email: "nana@spring.com", number: 323756786, salary: 110, position: "Minion", role: 'User' },
                       { "id": 20, name: "Kam", gender: "M", age: 43, email: "kam@spring.com", number: 325523921, salary: 150, position: "Minion", role: 'Moderator' },
                       { "id": 21, name: "John", gender: "M", age: 27, email: "john@spring.com", number: 326977762, salary: 110, position: "Minion", role: 'User' },
                       { "id": 22, name: "Nephi", gender: "M", age: 29, email: "nephi@spring.com", number: 320788832, salary: 140, position: "Minion", role: 'User' },
                       { "id": 23, name: "Enos", gender: "M", age: 34, email: "enos@spring.com", number: 320455239, salary: -50, position: "Minion", role: 'User' },
                       { "id": 24, name: "Tommy", gender: "M", age: 43, email: "tommy@spring.com", number: 323277662, salary: 170, position: "Software Engineer", role: 'Moderator' },
                       { "id": 25, name: "Ann", gender: "F", age: 21, email: "ann@spring.com", number: 323130902, salary: 280, position: "Product Manager", role: 'Administrator' },
                       { "id": 26, name: "Naomi", gender: "F", age: 29, email: "naomi@spring.com", number: 323716786, salary: 190, position: "Software Engineer", role: 'Moderator' },
                       { "id": 27, name: "Emma", gender: "F", age: 34, email: "emma@spring.com", number: 323299966, salary: 140, position: "Software Engineer", role: 'Moderator' }];
                   $scope.groupby = 'role'; //Default order
                   $scope.tableParams = new ngTableParams({
                       page: 1,            // show first page
                       count: 10,
                       filter: {
                           name: 'A'       // initial filter
                       },
                       sorting: {
                           name: 'asc'     // initial sorting
                       }          // count per page
                   }, {
                       groupBy: 'role',
                       total: data.length,
                       getData: function ($defer, params) {
                           var filteredData = params.filter() ?
                                       $filter('filter')(data, params.filter()) :
                                       data;
                           var orderedData = params.sorting() ?
                                   $filter('orderBy')(filteredData, params.orderBy()) :
                                   data;
                           params.total(orderedData.length); // set total for recalc pagination

                           $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

                       }
                   });
                   $scope.$watch('groupby', function (value) {
                       $scope.tableParams.settings().groupBy = value;
                       console.log('Scope Value', $scope.groupby);
                       console.log('Watch value', this.last);
                       console.log('new table', $scope.tableParams);
                       $scope.tableParams.reload();
                   });
               });