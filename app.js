angular.module('chatApplication',['ngRoute','ngMaterial', 'ngMessages','btford.socket-io']).config(function($routeProvider){
  $routeProvider
    .when('/',{
      templateUrl:'views/main.html',
      controller:'mainCtrl'
    })
    .when('/register',{
      templateUrl:'views/register.html',
      controller:'registerCtrl'
    })
    .when('/login',{
      templateUrl:'views/login.html',
      controller:'loginCtrl'
    })
    .when('/chat/:userName',{
      templateUrl:'views/chat.html',
      controller:'chatCtrl'
    });
});