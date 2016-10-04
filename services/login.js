angular.module('chatApplication').factory('loginService',function($http){
  return{
    loginUser:function(user){
    return  $http.post('/loginjwt',user);
    }
  }
});
