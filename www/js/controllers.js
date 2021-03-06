angular.module('starter.controllers', ['services', "angularMoment"])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $ionicScrollDelegate, $ionicPopup, socket) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.messageData = {};
    $scope.users = [];
    $scope.messages = [];
    $scope.lastMessages = [];

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        var usernameVal = $scope.loginData.username;
        var passwordVal = $scope.loginData.password;
        socket.emit('sign in', {
            username: usernameVal,
            password: passwordVal,
            onMobile: '1'
        }, function (user) {
            if (user) {
                $scope.closeLogin();
                socket.emit('get user status');
                socket.emit('get old messages');
                socket.emit('get emoticons');
            } else {
                $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your usernamen and password.'
                });
            }
        });
    };
    
    $scope.sendMessage = function () {
        socket.emit('send message', $scope.messageData.msg);
        $scope.messageData.msg = '';
    };

    socket.on('user status update', function (userlist) {
        $scope.users = userlist;
    });
    
    socket.on('load old messages', function (messages) {
        $scope.lastMessages  = messages;
        $ionicScrollDelegate.scrollBottom(true);
	});

    socket.on('new message', function(message){
        message.time = Date.now();
        $scope.messages.push(message);
        $ionicScrollDelegate.scrollBottom(true);
    });

});

moment.lang('en', {
    relativeTime : {
        future: "in %s",
        past:   "%s",
        s:  "just now",
        m:  "1m",
        mm: "%dm",
        h:  "1h",
        hh: "%dh",
        d:  "1d",
        dd: "%dd",
        M:  "1m",
        MM: "%dm",
        y:  "1y",
        yy: "%dy"
    }
});