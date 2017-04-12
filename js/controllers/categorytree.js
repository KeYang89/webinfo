materialAdmin.directive('yaTree', function () {

    return {
        restrict: 'A',
        transclude: 'element',
        priority: 1000,
        terminal: true,
        compile: function (tElement, tAttrs, transclude) {

            var repeatExpr, childExpr, rootExpr, childrenExpr;

            repeatExpr = tAttrs.yaTree.match(/^(.*) in ((?:.*\.)?(.*)) at (.*)$/);
            childExpr = repeatExpr[1];
            rootExpr = repeatExpr[2];
            childrenExpr = repeatExpr[3];
            branchExpr = repeatExpr[4];

            return function link(scope, element, attrs) {

                var rootElement = element[0].parentNode,
                    cache = [];

                // Reverse lookup object to avoid re-rendering elements
                function lookup(child) {
                    var i = cache.length;
                    while (i--) {
                        if (cache[i].scope[childExpr] === child) {
                            return cache.splice(i, 1)[0];
                        }
                    }
                }

                scope.$watch(rootExpr, function (root) {

                    var currentCache = [];

                    // Recurse the data structure
                    (function walk(children, parentNode, parentScope, depth) {

                        var i = 0,
                            n = children.length,
                            last = n - 1,
                            cursor,
                            child,
                            cached,
                            childScope,
                            grandchildren;

                        // Iterate the children at the current level
                        for (; i < n; ++i) {

                            // We will compare the cached element to the element in 
                            // at the destination index. If it does not match, then 
                            // the cached element is being moved into this position.
                            cursor = parentNode.childNodes[i];

                            child = children[i];

                            // See if this child has been previously rendered
                            // using a reverse lookup by object reference
                            cached = lookup(child);

                            // If the parentScope no longer matches, we've moved.
                            // We'll have to transclude again so that scopes 
                            // and controllers are properly inherited
                            if (cached && cached.parentScope !== parentScope) {
                                cache.push(cached);
                                cached = null;
                            }

                            // If it has not, render a new element and prepare its scope
                            // We also cache a reference to its branch node which will
                            // be used as the parentNode in the next level of recursion
                            if (!cached) {
                                transclude(parentScope.$new(), function (clone, childScope) {

                                    childScope[childExpr] = child;

                                    cached = {
                                        scope: childScope,
                                        parentScope: parentScope,
                                        element: clone[0],
                                        branch: clone.find(branchExpr)[0]
                                    };

                                    // This had to happen during transclusion so inherited 
                                    // controllers, among other things, work properly
                                    if (!cursor) parentNode.appendChild(cached.element);
                                    else parentNode.insertBefore(cached.element, cursor);


                                });
                            } else if (cached.element !== cursor) {
                                if (!cursor) parentNode.appendChild(cached.element);
                                else parentNode.insertBefore(cached.element, cursor);

                            }

                            // Lets's set some scope values
                            childScope = cached.scope;

                            // Store the current depth on the scope in case you want 
                            // to use it (for good or evil, no judgment).
                            childScope.$depth = depth;

                            // Emulate some ng-repeat values
                            childScope.$index = i;
                            childScope.$first = (i === 0);
                            childScope.$last = (i === last);
                            childScope.$middle = !(childScope.$first || childScope.$last);

                            // Push the object onto the new cache which will replace
                            // the old cache at the end of the walk.
                            currentCache.push(cached);

                            // If the child has children of its own, recurse 'em.             
                            grandchildren = child[childrenExpr];
                            if (grandchildren && grandchildren.length) {
                                walk(grandchildren, cached.branch, childScope, depth + 1);
                            }
                        }
                    })(root, rootElement, scope, 0);

                    // Cleanup objects which have been removed.
                    // Remove DOM elements and destroy scopes to prevent memory leaks.
                    i = cache.length;

                    while (i--) {
                        cached = cache[i];
                        if (cached.scope) {
                            cached.scope.$destroy();
                        }
                        if (cached.element) {
                            cached.element.parentNode.removeChild(cached.element);
                        }
                    }

                    // Replace previous cache.
                    cache = currentCache;

                }, true);
            };
        }
    };
});

materialAdmin.controller('TreeController', function ($scope, $timeout) {
    $scope.json = '';//insert the json file
    $scope.product = { categories: [] };

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
		//Begin Vishruthi 12/14/2016 DCS mapping
		 $.ajax({
            url: "services/GetDCS.php",
            type: "GET",
            async: false,
            cache: false,
            contentType: 'application/json; charset=utf-8',
            dataType: "json",
            'success': function (result) {
                $scope.DCSlist = JSON.parse(JSON.stringify(result));;
				console.log(JSON.stringify(result));
            }
        });
		
    }
	
	 $scope.GetDCS = function (selectDCS) {
        console.log(selectDCS);
        $scope.data.dcs.push({ value: selectDCS });
    }
	//End Vishruthi 12/14/2016 DCS mapping

    $scope.getJson = function () {
        $scope.json = angular.toJson($scope.data);
    };
    $scope.toggleMinimized = function (child) {
        child.minimized = !child.minimized;
    };

    $scope.addChild = function (child) {
        child.children.push({
            title: '',
            children: []
        });
    };

    //N V 
    $scope.selected = [];
    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
            $scope.product.categories = list;
        }
        else {
            list.push(item);
            $scope.product.categories = list;
        }
    };

    $scope.exists = function (item, list) {
        return list.indexOf(item) > -1;
    };

    $scope.remove = function (child) {
        function walk(target) {
            var children = target.children,
                i;
            if (children) {
                i = children.length;
                while (i--) {
                    if (children[i] === child) {
                        return children.splice(i, 1);
                    } else {
                        walk(children[i])
                    }
                }
            }
        }
        walk($scope.data);

        //N V
        $.ajax({
			url: "services/DeleteCategories.php",
            type: "POST",
            async: false,
			cache: false,
            contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(child),
            'success': function (result) {
            }
        });

    }

    $scope.SaveCategories = function () {
        $.ajax({
            url: "services/SaveCategories.php",
            type: "POST",
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify($scope.data ), 
            'success': function (result) {
            }
        });
    };

	 // //page load
    this.Load = function (event) {
       
        var value_or_null = (document.cookie.match(/^(?:.*;)?LinkedRetail=([^;]+)(?:.*)?$/) || [, null])[1]
        
        if (value_or_null == null) 
        {
            location.href = 'login.html';
        }
        else {
            
        }

    }
    $scope.update = function (event, ui) {

        var root = event.target,
            item = ui.item,
            parent = item.parent(),
            target = (parent[0] === root) ? $scope.data : parent.scope().child,
            child = item.scope().child,
            index = item.index();

        target.children || (target.children = []);

        function walk(target, child) {
            var children = target.children,
                i;
            if (children) {
                i = children.length;
                while (i--) {
                    if (children[i] === child) {
                        return children.splice(i, 1);
                    } else {
                        walk(children[i], child);
                    }
                }
            }
        }
        walk($scope.data, child);
        target.children.splice(index, 0, child);
    };
});


materialAdmin.directive('uiNestedSortable', ['$parse', function ($parse) {

    'use strict';

    var eventTypes = 'Create Start Sort Change BeforeStop Stop Update Receive Remove Over Out Activate Deactivate'.split(' ');

    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            var options = attrs.uiNestedSortable ? $parse(attrs.uiNestedSortable)() : {};

            angular.forEach(eventTypes, function (eventType) {

                var attr = attrs['uiNestedSortable' + eventType],
                    callback;

                if (attr) {
                    callback = $parse(attr);
                    options[eventType.charAt(0).toLowerCase() + eventType.substr(1)] = function (event, ui) {
                        scope.$apply(function () {

                            callback(scope, {
                                $event: event,
                                $ui: ui
                            });
                        });
                    };
                }

            });

            //note the item="{{child}}" attribute on line 17
            options.isAllowed = function (item, parent) {
                if (!parent) return false;
                var attrs = parent.context.attributes;
                parent = attrs.getNamedItem('item');
                attrs = item.context.attributes;
                item = attrs.getNamedItem('item');
                console.log(item, parent);
                //if ( ... ) return false;
                return true;
            };

            element.nestedSortable(options);

        }
    };
}]);