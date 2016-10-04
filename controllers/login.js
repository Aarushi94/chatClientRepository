angular.module('chatApplication').controller('loginCtrl',function($scope,loginService,$location){
  $scope.user={
    'userName':'',
    'password':''
  }
  $scope.validateForm=function(){
    if($scope.user.userName=='')
    return false;
    if($scope.user.password=='')
    return false;
    return true;
  };
  $scope.login=function(){
    loginService.loginUser($scope.user).success(function (data){
      console.log(data);
      if(data.result=='Success'){
        //set token in local storage
        window.localStorage.setItem('token',data.token);
        $location.path('/chat');
      }
      else{
        $scope.error="Either UserName or Password is wrong!";
      }
    });
  };
});
