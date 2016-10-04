angular.module('chatApplication').factory('authService',function($http,$location){
  return{
    authenticate: function(){
     var token = localStorage.getItem("token");
     var headers = { 'Authorization': token };
    return  $http.post('/authenticate',null, {'headers': headers}).error(function(data){
      $location.path('/login');
    });
  }
}

});
