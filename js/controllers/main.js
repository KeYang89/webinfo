materialAdmin
    // =========================================================================
    // Base controller for common functions
    // =========================================================================

    .controller('materialadminCtrl', function ($timeout, $state, $scope, growlService) {
        //Welcome Message
        var Cookie = document.cookie.match(/^(.*;)?LinkedRetail=[^;]+(.*)?$/);
        if (Cookie != null) {
            var details = Cookie[0].replace(" ", "=").split('=');
            //Welcome Message
            growlService.growl('Welcome ' + details[2] + '!', 'inverse')
        }
        else {
            growlService.growl('Welcome back!', 'inverse')
        }

        // Detact Mobile Browser
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            angular.element('html').addClass('ismobile');
        }

        // By default Sidbars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
        this.sidebarToggle = {
            left: false,
            right: false
        }

        // By default template has a boxed layout
        this.layoutType = localStorage.getItem('ma-layout-status');

        // For Mainmenu Active Class
        this.$state = $state;

        //Close sidebar on click
        this.sidebarStat = function (event) {
            // alert('working');
            if (!angular.element(event.target).parent().hasClass('active')) {
                this.sidebarToggle.left = false;
            }

        };


        //page load
        this.Load = function (event) {

            var value_or_null = (document.cookie.match(/^(?:.*;)?LinkedRetail=([^;]+)(?:.*)?$/) || [, null])[1]

            if (value_or_null == null) //|| document.Cookie == '')
            {
                location.href = 'login.html';
            }
            else {
            }

        }

        this.lockScreen = function (event) {
            alert('insoide lock screen');

            $(document).ready(function () {

                $('#lockBtn').click(function (event) {
                    alert('clicked');
                    var username = 'go';
                    var password = $('#Pass').val();
                    event.preventDefault();
                    $.ajax({
                        url: "services/lockScreen.php",
                        type: "GET",
                        async: true,
                        contentType: 'application/json; charset=utf-8',
                        //dataType: "json",
                        data: { pswd: password },
                        success: function (result) {
                            console.log(result);
                            var result = JSON.parse(result);
                            //var User;
                            if (result[0].status == "Valid") {

                                //var date = new Date();
                                //date.setTime(date.getTime() + (5 *60 * 60 * 1000));
                                //expires = "; expires=" + date.toGMTString();
                                //document.cookie = "LinkedRetail=" + "name=" + username + " " + "Password=" + password + " Role=" + result[0].Role + expires;
                                //alert(document.cookie);
                                location.href = 'index.html';

                            }
                            else {

                                alert("Invalid user name and Password");
                            }

                        },
                        Error: function (result) {
                            console.log(result);
                        }

                    });
                });
            })
        }
        //Side bar load
        this.LoadSideBar = function (event) {

            var Cookie = document.cookie.match(/^(.*;)?LinkedRetail=[^;]+(.*)?$/);
            var details = Cookie[0].replace(" ", "=").split('=');

            var User = details[5];
            if (User == "USER") {
                document.getElementById('AddNewUser').style.display = "none";
            }
            else {
                document.getElementById('AddNewUser').style.display = "";
            }
        }
        this.newLogout = function (event) {
            document.cookie = 'LinkedRetail' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }

        //Listview Search (Check listview pages)
        this.listviewSearchStat = false;

        this.lvSearch = function () {
            this.listviewSearchStat = true;
        }

        //Listview menu toggle in small screens
        this.lvMenuStat = false;

        //Blog
        this.wallCommenting = [];

        this.wallImage = false;
        this.wallVideo = false;
        this.wallLink = false;

        //Skin Switch
        this.currentSkin = 'blue';

        this.skinList = [
            'lightblue',
            'bluegray',
            'cyan',
            'teal',
            'green',
            'orange',
            'blue',
            'purple'
        ]

        this.skinSwitch = function (color) {
            this.currentSkin = color;
        }

    })


    // =========================================================================
    // Header
    // =========================================================================
    .controller('headerCtrl', function ($timeout, messageService) {


        // Top Search
        this.openSearch = function () {
            angular.element('#header').addClass('search-toggled');
            angular.element('#top-search-wrap').find('input').focus();
        }

        this.closeSearch = function () {
            angular.element('#header').removeClass('search-toggled');
        }

        // Get messages and notification for header
        this.img = messageService.img;
        this.user = messageService.user;
        this.user = messageService.text;

        this.messageResult = messageService.getMessage(this.img, this.user, this.text);


        //Clear Notification
        this.clearNotification = function ($event) {
            $event.preventDefault();

            var x = angular.element($event.target).closest('.listview');
            var y = x.find('.lv-item');
            var z = y.size();

            angular.element($event.target).parent().fadeOut();

            x.find('.list-group').prepend('<i class="grid-loading hide-it"></i>');
            x.find('.grid-loading').fadeIn(1500);
            var w = 0;

            y.each(function () {
                var z = $(this);
                $timeout(function () {
                    z.addClass('animated fadeOutRightBig').delay(1000).queue(function () {
                        z.remove();
                    });
                }, w += 150);
            })

            $timeout(function () {
                angular.element('#notifications').addClass('empty');
            }, (z * 150) + 200);
        }

        // Clear Local Storage
        this.clearLocalStorage = function () {

            //Get confirmation, if confirmed clear the localStorage
            swal({
                title: "Are you sure?",
                text: "All your saved localStorage values will be removed",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#F44336",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function () {
                localStorage.clear();
                swal("Done!", "localStorage is cleared", "success");
            });

        }

        //Fullscreen View
        this.fullScreen = function () {
            //Launch
            function launchIntoFullscreen(element) {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }

            //Exit
            function exitFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }

            if (exitFullscreen()) {
                launchIntoFullscreen(document.documentElement);
            }
            else {
                launchIntoFullscreen(document.documentElement);
            }
        }

    })



    // =========================================================================
    // Best Selling Widget
    // =========================================================================

    .controller('bestsellingCtrl', function (bestsellingService) {
        // Get Best Selling widget Data
        this.img = bestsellingService.img;
        this.name = bestsellingService.name;
        this.range = bestsellingService.range;

        this.bsResult = bestsellingService.getBestselling(this.img, this.name, this.range);
    })


    // =========================================================================
    // Todo List Widget
    // =========================================================================

    .controller('todoCtrl', function (todoService) {

        //Get Todo List Widget Data
        this.todo = todoService.todo;

        this.tdResult = todoService.getTodo(this.todo);

        //Add new Item (closed by default)
        this.addTodoStat = false;
    })


    // =========================================================================
    // Recent Items Widget
    // =========================================================================

    .controller('recentitemCtrl', function (recentitemService) {

        //Get Recent Items Widget Data
        this.id = recentitemService.id;
        this.name = recentitemService.name;
        this.parseInt = recentitemService.price;

        this.riResult = recentitemService.getRecentitem(this.id, this.name, this.price);
    })


    // =========================================================================
    // Recent Posts Widget
    // =========================================================================

    .controller('recentpostCtrl', function (recentpostService) {

        //Get Recent Posts Widget Items
        this.img = recentpostService.img;
        this.user = recentpostService.user;
        this.text = recentpostService.text;

        this.rpResult = recentpostService.getRecentpost(this.img, this.user, this.text);
    })


    //=================================================
    // Profile
    //=================================================

    .controller('profileCtrl', function (growlService) {

        //Get Profile Information from profileService Service

        //User
        this.profileSummary = "Sed eu est vulputate, fringilla ligula ac, maximus arcu. Donec sed felis vel magna mattis ornare ut non turpis. Sed id arcu elit. Sed nec sagittis tortor. Mauris ante urna, ornare sit amet mollis eu, aliquet ac ligula. Nullam dolor metus, suscipit ac imperdiet nec, consectetur sed ex. Sed cursus porttitor leo.";

        this.fullName = "Ashok Tadakamalla";
        this.gender = "male";
        this.birthDay = "02/27/1989";
        this.martialStatus = "Married";
        this.mobileNumber = "00971123456789";
        this.emailAddress = "yangkecoy@gmail.com";
        this.twitter = "@test";
        this.twitterUrl = "twitter.com/test";
        this.skype = "yangkecoy_yolanda";
        this.addressSuite = "123 Demo Road";
        this.addressCity = "Houston, TX";
        this.addressCountry = "USA";

        //Edit
        this.editSummary = 0;
        this.editInfo = 0;
        this.editContact = 0;


        this.submit = function (item, message) {
            if (item === 'profileSummary') {
                this.editSummary = 0;
            }

            if (item === 'profileInfo') {
                this.editInfo = 0;
            }

            if (item === 'profileContact') {
                this.editContact = 0;
            }

            growlService.growl(message + ' has updated Successfully!', 'inverse');
        }

    })



    //=================================================
    // LOGIN
    //=================================================

    .controller('loginCtrl', function () {
        this.login = 1;
        this.register = 0;
        this.forgot = 0;

        $(document).ready(function () {
            $('#loginSubmit').click(function (event) {
                var username = $('#userName').val();
                var password = $('#password').val();
                var rememberMe = $('#rememberMe').is(':checked');
				var recaptcha = $('#recaptcha').val();
                event.preventDefault();
                $.ajax({
                    url: "services/UserLogin.php",
                    type: "GET",
                    async: true,
                    contentType: 'application/json; charset=utf-8',
                    data: { un: username, pswd: password },
                    success: function (result) {
                        result = JSON.parse(result);
                        if (result[0].status == "Valid" && rememberMe == false) {
                            User = result[0].Role;
                            var date = new Date();
                            date.setTime(date.getTime() + (5 * 60 * 60 * 1000));
                            expires = "; expires=" + date.toGMTString();
                            document.cookie = "LinkedRetail=" + "name=" + username + " " + "Password=" + password + " Role=" + result[0].Role + expires;
                            location.href = 'index.html';

                        }
                        else if (result[0].status == "Valid" && rememberMe == true) {
                            User = result[0].Role;
                            var date = new Date();
                            date.setTime(date.getTime() + (5 * 24 * 60 * 60 * 1000));
                            expires = "; expires=" + date.toGMTString();
                            document.cookie = "LinkedRetail=" + "name=" + username + " " + "Password=" + password + " Role=" + result[0].Role + expires;
                            location.href = 'index.html';
                        }
                        else {
                            alert("Invalid UserName or Password");
                        }
                    }
                })
            });
        });

        //add user
        $(document).ready(function () {
            $('#adduser').click(function (event) {
                var username = $('#username').val();
                var password = $('#password').val();
                var email = $('#email').val();
				var r = document.getElementById('isAdmin').checked;
				
				 //Validation each field have value or not and Email validation

                if (username == "" || password == "" || email == "") //|| r == false)
                {
                    alert('All fields must be filled out');
                    return false;
                }
                else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
                {
                    alert('Invalid Email address');
                    return false;
                }
                var r = document.getElementById('isAdmin').checked;
                if (r == true)
                { r = 'ADMIN'; }
                else
                { r = 'USER'; }
                var Cookie = document.cookie.match(/^(.*;)?LinkedRetail=[^;]+(.*)?$/);
                if (Cookie == null || Cookie == '') {
                    window.document.location.href = 'login.html';
                }
				
                $.ajax({
                    url: "services/addUser.php",
                    type: "POST",
                    async: false,
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify({ un: username, pswd: password, mail: email, roles: r }),
                    'success': function (result) {
                        if (result != 'success')
                        { alert('UserName already Exists!'); }
                        else
                        {
                            alert('Added User Successfully!');
							$('#username').val('');
							$('#password').val('');
							$('#email').val('');
							document.getElementById('isAdmin').checked = false;
							 document.getElementById('signedin').checked = false;
                        }
                    }
                });
            });
        })

        //change password
        $(document).ready(function () {
            $('#changepswd').click(function (event) {
                var old = $('#oldpswd').val();
                var newpswd = $('#newpswd').val();
                var verify = $('#verifypswd').val();

                var Cookie = document.cookie.match(/^(.*;)?LinkedRetail=[^;]+(.*)?$/);
                if (Cookie[0] == null || Cookie[0] == '') {
                    window.document.location.href = 'login.html';
                }
				var details = Cookie[0].replace(" ", "=").split('=');
                var detail = details[4].split(' ');
               
                if (old == detail[0]){
                    if (newpswd == verify) {
                        $.ajax({
                            url: "services/changePassword.php",
                            type: "POST",
                            async: false,
                            contentType: 'application/json; charset=utf-8',
                            data: JSON.stringify({ un: details[2], pswd: old, newpswdd: newpswd }),
                            'success': function (result) {
                                if (result == 'success') {
                                    alert('Password successfully changed');
                                    window.document.location.href = 'login.html';
                                }
                            }
                        });
                    }
                    else {
                        alert('Please Verify the password Again..');
                    }
                }
                else {
                    alert('Please enter valid login password!');
                }
            });
        })
    })

    //=================================================
    // CALENDAR
    //=================================================

    .controller('calendarCtrl', function ($modal) {

        //Create and add Action button with dropdown in Calendar header. 
        this.month = 'month';

        this.actionMenu = '<ul class="actions actions-alt" id="fc-actions">' +
                            '<li class="dropdown" dropdown>' +
                                '<a href="" dropdown-toggle><i class="zmdi zmdi-more-vert"></i></a>' +
                                '<ul class="dropdown-menu dropdown-menu-right">' +
                                    '<li class="active">' +
                                        '<a data-calendar-view="month" href="">Month View</a>' +
                                    '</li>' +
                                    '<li>' +
                                        '<a data-calendar-view="basicWeek" href="">Week View</a>' +
                                    '</li>' +
                                    '<li>' +
                                        '<a data-calendar-view="agendaWeek" href="">Agenda Week View</a>' +
                                    '</li>' +
                                    '<li>' +
                                        '<a data-calendar-view="basicDay" href="">Day View</a>' +
                                    '</li>' +
                                    '<li>' +
                                        '<a data-calendar-view="agendaDay" href="">Agenda Day View</a>' +
                                    '</li>' +
                                '</ul>' +
                            '</div>' +
                        '</li>';


        //Open new event modal on selecting a day
        this.onSelect = function (argStart, argEnd) {
            var modalInstance = $modal.open({
                templateUrl: 'addEvent.html',
                controller: 'addeventCtrl',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    calendarData: function () {
                        var x = [argStart, argEnd];
                        return x;
                    }
                }
            });
        }
    })

    //Add event Controller (Modal Instance)
    .controller('addeventCtrl', function ($scope, $modalInstance, calendarData) {

        //Calendar Event Data
        $scope.calendarData = {
            eventStartDate: calendarData[0],
            eventEndDate: calendarData[1]
        };

        //Tags
        $scope.tags = [
            'bgm-teal',
            'bgm-red',
            'bgm-pink',
            'bgm-blue',
            'bgm-lime',
            'bgm-green',
            'bgm-cyan',
            'bgm-orange',
            'bgm-purple',
            'bgm-gray',
            'bgm-black',
        ]

        //Select Tag
        $scope.currentTag = '';

        $scope.onTagClick = function (tag, $index) {
            $scope.activeState = $index;
            $scope.activeTagColor = tag;
        }

        //Add new event
        $scope.addEvent = function () {
            if ($scope.calendarData.eventName) {

                //Render Event
                $('#calendar').fullCalendar('renderEvent', {
                    title: $scope.calendarData.eventName,
                    start: $scope.calendarData.eventStartDate,
                    end: $scope.calendarData.eventEndDate,
                    allDay: true,
                    className: $scope.activeTagColor

                }, true); //Stick the event

                $scope.activeState = -1;
                $scope.calendarData.eventName = '';
                $modalInstance.close();
            }
        }

        //Dismiss 
        $scope.eventDismiss = function () {
            $modalInstance.dismiss();
        }
    })

    // =========================================================================
    // COMMON FORMS
    // =========================================================================

    .controller('formCtrl', function () {

        //Input Slider
        this.nouisliderValue = 4;
        this.nouisliderFrom = 25;
        this.nouisliderTo = 80;
        this.nouisliderRed = 35;
        this.nouisliderBlue = 90;
        this.nouisliderCyan = 20;
        this.nouisliderAmber = 60;
        this.nouisliderGreen = 75;

        //Color Picker
        this.color = '#03A9F4';
        this.color2 = '#8BC34A';
        this.color3 = '#F44336';
        this.color4 = '#FFC107';
    })


    // =========================================================================
    // PHOTO GALLERY
    // =========================================================================

    .controller('photoCtrl', function () {

        //Default grid size (2)
        this.photoColumn = 'col-md-2';
        this.photoColumnSize = 2;

        this.photoOptions = [
            { value: 2, column: 6 },
            { value: 3, column: 4 },
            { value: 4, column: 3 },
            { value: 1, column: 12 },
        ]

        //Change grid
        this.photoGrid = function (size) {
            this.photoColumn = 'col-md-' + size;
            this.photoColumnSize = size;
        }

    })


    // =========================================================================
    // ANIMATIONS DEMO
    // =========================================================================
    .controller('animCtrl', function ($timeout) {

        //Animation List
        this.attentionSeekers = [
            { animation: 'bounce', target: 'attentionSeeker' },
            { animation: 'flash', target: 'attentionSeeker' },
            { animation: 'pulse', target: 'attentionSeeker' },
            { animation: 'rubberBand', target: 'attentionSeeker' },
            { animation: 'shake', target: 'attentionSeeker' },
            { animation: 'swing', target: 'attentionSeeker' },
            { animation: 'tada', target: 'attentionSeeker' },
            { animation: 'wobble', target: 'attentionSeeker' }
        ]
        this.flippers = [
            { animation: 'flip', target: 'flippers' },
            { animation: 'flipInX', target: 'flippers' },
            { animation: 'flipInY', target: 'flippers' },
            { animation: 'flipOutX', target: 'flippers' },
            { animation: 'flipOutY', target: 'flippers' }
        ]
        this.lightSpeed = [
           { animation: 'lightSpeedIn', target: 'lightSpeed' },
           { animation: 'lightSpeedOut', target: 'lightSpeed' }
        ]
        this.special = [
            { animation: 'hinge', target: 'special' },
            { animation: 'rollIn', target: 'special' },
            { animation: 'rollOut', target: 'special' }
        ]
        this.bouncingEntrance = [
            { animation: 'bounceIn', target: 'bouncingEntrance' },
            { animation: 'bounceInDown', target: 'bouncingEntrance' },
            { animation: 'bounceInLeft', target: 'bouncingEntrance' },
            { animation: 'bounceInRight', target: 'bouncingEntrance' },
            { animation: 'bounceInUp', target: 'bouncingEntrance' }
        ]
        this.bouncingExits = [
            { animation: 'bounceOut', target: 'bouncingExits' },
            { animation: 'bounceOutDown', target: 'bouncingExits' },
            { animation: 'bounceOutLeft', target: 'bouncingExits' },
            { animation: 'bounceOutRight', target: 'bouncingExits' },
            { animation: 'bounceOutUp', target: 'bouncingExits' }
        ]
        this.rotatingEntrances = [
            { animation: 'rotateIn', target: 'rotatingEntrances' },
            { animation: 'rotateInDownLeft', target: 'rotatingEntrances' },
            { animation: 'rotateInDownRight', target: 'rotatingEntrances' },
            { animation: 'rotateInUpLeft', target: 'rotatingEntrances' },
            { animation: 'rotateInUpRight', target: 'rotatingEntrances' }
        ]
        this.rotatingExits = [
            { animation: 'rotateOut', target: 'rotatingExits' },
            { animation: 'rotateOutDownLeft', target: 'rotatingExits' },
            { animation: 'rotateOutDownRight', target: 'rotatingExits' },
            { animation: 'rotateOutUpLeft', target: 'rotatingExits' },
            { animation: 'rotateOutUpRight', target: 'rotatingExits' }
        ]
        this.fadeingEntrances = [
            { animation: 'fadeIn', target: 'fadeingEntrances' },
            { animation: 'fadeInDown', target: 'fadeingEntrances' },
            { animation: 'fadeInDownBig', target: 'fadeingEntrances' },
            { animation: 'fadeInLeft', target: 'fadeingEntrances' },
            { animation: 'fadeInLeftBig', target: 'fadeingEntrances' },
            { animation: 'fadeInRight', target: 'fadeingEntrances' },
            { animation: 'fadeInRightBig', target: 'fadeingEntrances' },
            { animation: 'fadeInUp', target: 'fadeingEntrances' },
            { animation: 'fadeInBig', target: 'fadeingEntrances' }
        ]
        this.fadeingExits = [
            { animation: 'fadeOut', target: 'fadeingExits' },
            { animation: 'fadeOutDown', target: 'fadeingExits' },
            { animation: 'fadeOutDownBig', target: 'fadeingExits' },
            { animation: 'fadeOutLeft', target: 'fadeingExits' },
            { animation: 'fadeOutLeftBig', target: 'fadeingExits' },
            { animation: 'fadeOutRight', target: 'fadeingExits' },
            { animation: 'fadeOutRightBig', target: 'fadeingExits' },
            { animation: 'fadeOutUp', target: 'fadeingExits' },
            { animation: 'fadeOutUpBig', target: 'fadeingExits' }
        ]
        this.zoomEntrances = [
            { animation: 'zoomIn', target: 'zoomEntrances' },
            { animation: 'zoomInDown', target: 'zoomEntrances' },
            { animation: 'zoomInLeft', target: 'zoomEntrances' },
            { animation: 'zoomInRight', target: 'zoomEntrances' },
            { animation: 'zoomInUp', target: 'zoomEntrances' }
        ]
        this.zoomExits = [
            { animation: 'zoomOut', target: 'zoomExits' },
            { animation: 'zoomOutDown', target: 'zoomExits' },
            { animation: 'zoomOutLeft', target: 'zoomExits' },
            { animation: 'zoomOutRight', target: 'zoomExits' },
            { animation: 'zoomOutUp', target: 'zoomExits' }
        ]

        //Animate    
        this.ca = '';

        this.setAnimation = function (animation, target) {
            if (animation === "hinge") {
                animationDuration = 2100;
            }
            else {
                animationDuration = 1200;
            }

            angular.element('#' + target).addClass(animation);

            $timeout(function () {
                angular.element('#' + target).removeClass(animation);
            }, animationDuration);
        }



    })
