angular.module('chatApplication').controller('chatCtrl',function($scope,$routeParams,socketService){

  $scope.userName=$routeParams.userName;
  //Receive Socket from the service
  var socket=socketService.getSocket();

  $scope.usersOnline=[];
  $scope.requestsReceived=[];
  $scope.requestAccepted=[];
  //Join Event
  socket.emit('join',$routeParams.userName);

  //Get all Online People
  socket.on('users-online',function(people){
    //Empty the array otherwise it will be added again and again
    $scope.usersOnline=[];
    angular.forEach(people,function(name,id){
     if($scope.userName!=name){
         $scope.usersOnline.push({'name':name,'id':id});
         console.log($scope.usersOnline);
      }
    });
  });

  //On click of sent request emit an event
  $scope.sentRequest=function(userId){
    console.log("card clicked"+"---"+userId);
    socket.emit('request-chat',userId);
  };

  //On receiving request show name of the person under Request Received heading
  socket.on('request-chat',function(name,senderId){
    $scope.requestsReceived.push({'name':name,'senderId':senderId})
  });

  //On click of the card, the request will be accepted and an event is emitted.
  $scope.acceptRequest=function(receiverId){
    console.log("accept card clicked"+"---"+receiverId);
    //remove element from the Requests Received
    for(var index in $scope.requestsReceived){
      var obj=$scope.requestsReceived[index];
      if(obj.senderId==receiverId){
        $scope.requestsReceived.splice(index,1);
        $scope.requestAccepted.push({'name':obj.name,'senderId':obj.senderId});
      }
    }
    //Emit socket event to show messsage div at sender side
    socket.emit('request-chat-accepted',receiverId);
  };

  socket.on('request-chat-accepted',function(receiverId){
    console.log("Chat Request Received");
  }

});
