angular.module('starter.controllers', ['services'])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, socket) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.users = [];
    $scope.messages = [];
    $scope.lastMessages = [];

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
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
            password: passwordVal
        }, function (user) {
            if (user) {
                $scope.closeLogin();
                socket.emit('get user status');
                socket.emit('get old messages');
                socket.emit('get emoticons');
            } else {
                alert('Login failed.');
            }
        });
    };

    socket.on('user status update', function (userlist) {
        $scope.users = userlist;
    });
    
    socket.on('load old messages', function (messages) {
        $scope.lastMessages  = messages;
	});

    socket.on('new message', function(message){
        $scope.messages.push(message);
    });

})