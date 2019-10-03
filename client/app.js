var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/signup", { templateUrl: "/store/signup.html" })
        .when("/login", { templateUrl: "/store/login.html" })
        .when("/forgotPassword", { templateUrl: "/store/forgotpassword.html" })
        .when("/resetPassword", { templateUrl: "/store/resetpass.html" })
        .when("/setPassword", { templateUrl: "/store/setpassword.html" })
        .when("/chat", { templateUrl: "/store/chatwindow.html" })
        .otherwise({redirectTo : "/home"})
});

app.controller("MyCtrl", myCtrl);
function myCtrl($location, $http) 
{
    var socket = io.connect('http://localhost:3000/#!');

    this.output = "";
    this.data = {};
    this.dataL = {};
    this.dataF = {};
    this.dataR = {};
    this.clickSignup = function () {
        $location.path("/signup");
    }
    this.clickLogin = function () {
        $location.path("/login");
    }
    this.clickResetPassword = function () {
        $location.path("/resetPassword");
    }
    this.clickForgotPassword = function () {
        $location.path("/forgotPassword");
    }
    this.addUser = function (name, email, password) {
        this.data = {
            name: name,
            email: email,
            password: password
        }
        $http({
            url: "http://localhost:3000/user/signup",
            method: "POST",
            data: this.data
        }).then(response => {
            if (response) {
                this.output = "User Added";
            }
        })
            .catch(err => {
                if (err) {
                    this.output = "Unable to add user";
                }
            })
    }
    this.userLogin = function (email, password) {
        this.dataL = {
            email: email,
            password: password
        }
        this.outputL = "Unable to Login";
        $http({
            method: "POST",
            url: "http://localhost:3000/user/login",
            data: this.dataL
        })
            .then(response => {
                if (response) {
                    $location.path("/chat");
                }
            }).catch(err => {
                if (err) {
                    this.outputL = "Unable to Login!!!";
                    var x = document.getElementById("snackbar");
                    x.className = "show";
                    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
                }

            })

    }
    this.resetPassword = function (email, newpassword) {
        this.dataR = {
            email: email,
            newpassword: newpassword
        }
        $http({
            method: "PATCH",
            url: "http://localhost:8000/user/resetpass",
            data: this.dataR
        })
            .then(response => {
                if (response) {
                    this.outputR = response.data;
                }
            }).catch(err => {
                if (err) {
                    this.outputR = response.data;
                }
            })
    }

    this.forgotPassword = function (email) {
        this.dataF = {
            email: email
        }
        $http({
            method: "POST",
            url: "http://localhost:8000/user/forgotpass",
            data: this.dataF
        })
            .then(response => {
                if (response) {
                    this.outputF = "Mail Sent";
                }
            }).catch(err => {
                if (err) {
                    this.outputF = response.data;
                }
            });

    }
    this.setToken = function (gToken, email) {
        this.dataS = {
            email: email
        }
        this.outputS = "Unable to Change Password";
        $http({
            method: "POST",
            url: "http://localhost:8000/user/setpass",
            data: this.dataS
        })
            .then(response => {
                if (response.data.message === "okay token recieved") {
                    $http.defaults.headers.common['Authorization'] = gToken;
                    this.outputS = "Click on Reset Password";
                }
                else if (response.data.message === "error occured") {
                    this.outputS = "error occured";
                }
            }).catch(err => {
                if (err) {
                    this.outputS = "error occured";
                }
            })
    }

var output = document.getElementById('ot');
$scope.send = function (message, handle) {

    socket.emit('chat', {
        message: message,
        handle: handle
    });
}

socket.on('chat-send', function (data) {
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
});

socket.on('chat-recieve', function (data) {
    console.log("In client Chat Recieve", data);
    console.log("reciever: " + reciever + "sender " + sender);
    if ((data.name1 == reciever && data.name2 == sender) || (data.name1 == sender && data.name2 == reciever)) {
        $scope.$apply(() => {
            $scope.chatRoom = data.messageStore;

        })
    }
    
});

$scope.setChatroom = function (_reciever) {
    reciever = _reciever;
    var chatData = {
        sender: sender,
        reciever: reciever,
        message: $scope.message
    }
    socket.emit('chats', chatData);
}

$scope.sendMessage = function (_message) {
    $scope.message = _message;
    console.log("Sender : " + sender + " Reciever : " + reciever)
    var chatData = {
        sender: sender,
        reciever: reciever,
        message: $scope.message
    }
    socket.emit('chats', chatData);
    $scope.chat ="";
}
}
