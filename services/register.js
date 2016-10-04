angular.module('chatApplication').factory('registerService',function($http){
  return{
    addUser:function(user){
    return  $http.post('/register',user);
    }
  }
});
