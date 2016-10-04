angular.module('chatApplication').controller('registerCtrl',function($scope,registerService,$location){
  $scope.user={
    'userName':'',
    'password':'',
    'phone':'',
    'email':''
  };
  $scope.validateForm=function(){
    if($scope.user.userName=='')
    return false;
    if($scope.user.password=='')
    return false;
    if($scope.user.phone=='')
    return false;
    if($scope.user.email=='')
    return false;
    return true;
  };
  $scope.register=function(){
    registerService.addUser($scope.user).success(function (data){
      if(data=='Success'){
        $location.path('/login');
      }
      else{
        $scope.error="This UserName Exists!";
      };
    });

  };
});
