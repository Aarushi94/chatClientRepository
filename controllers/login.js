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
      if(data=='Success'){
        $location.path('/chat/'+$scope.user.userName);
      }
      else{
        $scope.error="Either UserName or Password is wrong!";
      };
    });
  };
});
