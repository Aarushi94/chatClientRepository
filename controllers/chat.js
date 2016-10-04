angular.module('chatApplication').controller('chatCtrl',function($scope,socketService,authService,$location){
  var socket=null;
  $scope.userName='';
  $scope.msg='';
  //TODO: Remove message from input box
  authService.authenticate().success(function(data){
    //Receive Socket from the service
    console.log(data);
    if(data.result=="Success"){

      socket=socketService.getSocket();
      $scope.userName=data.userName;
      $scope.usersOnline=[];
      $scope.requestsReceived=[];
      $scope.requestSent=[];
      $scope.chats=[];


      //Join Event
      socket.emit('join',$scope.userName);

      //Get all Online People
      socket.on('users-online',function(people){
        //Empty the array otherwise it will be added again and again
        $scope.usersOnline=[];
        angular.forEach(people,function(name,id){
         if($scope.userName!=name){
             $scope.usersOnline.push({'name':name,'id':id});
             console.log("People Online:"+$scope.usersOnline);
          }
        });
      });

      //On click of sent request emit an event
      $scope.sentRequest=function(userId,userName){
        console.log("Sent Request");
        //The id is of the person to chat with
        socket.emit('request-chat',userId);
        $scope.requestSent.push({'name':userName,'senderId':userId})
      };

      //On receiving request show name of the person under Request Received heading
      //The userName and the senderId is of the sender
      socket.on('request-chat',function(userName,senderId){
        console.log("Request Chat");
        $scope.requestsReceived.push({'name':userName,'senderId':senderId})
      });

      //On click of the card, the request will be accepted and an event is emitted.
      //The receiverId is the the Id of the sender who will receive accept message
      $scope.acceptRequest=function(receiverId){
        console.log("Accept request button");
        //remove element from the Requests Received
        for(var index in $scope.requestsReceived){
          var obj=$scope.requestsReceived[index];
          if(obj.senderId==receiverId){
            $scope.requestsReceived.splice(index,1);
            break;
          }
        }
        //Emit socket event to show messsage div at sender side
        socket.emit('request-chat-accepted',receiverId);
      };

      //This event is used to generate the message div who sent the request
      socket.on('request-chat-accepted-sender',function(receiverId,receiverName,history){
        //The receiverId is the id of the person to whom message is to be send
        console.log(history);
        console.log("Chat Request Accepted sender");
        //Remove the person from requestSent array
          for(var index in $scope.requestSent){
            var obj=$scope.requestSent[index];
            if(obj.senderId==receiverId){
              $scope.requestSent.splice(index,1);
              break;
            }
          }
          var x=[];
          if(history.length>0){
            for(i=0;i<history.length;i++){
              x.push({'sender':history[i].sender,'message':history[i].message});
            }
          }
          $scope.chats.push({'name':receiverName,'id':receiverId,'data':x});
          x=[];
          console.log($scope.chats);

      });

        //This event is used to generate the message div who accepted the request
      socket.on('request-chat-accepted-self',function(receiverId,receiverName,history){
        console.log(history);
        console.log("Chat Request Accepted Self");
        var x=[];
        if(history.length>0){
          for(i=0;i<history.length;i++){
            x.push({'sender':history[i].sender,'message':history[i].message});
          }
        }
        $scope.chats.push({'name':receiverName,'id':receiverId,'data':x});
        x=[];
        console.log($scope.chats);
      });

      //On click of send button, send message and Id to the server
      //The receiverId is the id of the person to whom message is to be send
      $scope.sendMessage=function(receiverId,msg){
        console.log("Send Button Clicked");
        console.log(msg);
        socket.emit('chat-message',msg,receiverId);
        for(i=0;i<$scope.chats.length;i++){
          if($scope.chats[i].id==receiverId){
              $scope.chats[i].data.push({'sender':$scope.userName,'message':msg});
              break;
          }
        }
          $scope.msg='';
      }

      //On receiving message append message to the person's chat box
      socket.on('chat-message-receiver', function(senderName,msg,senderId){
        console.log("chat-message-receiver");
        console.log(msg);
        for(i=0;i<$scope.chats.length;i++){
          if($scope.chats[i].id==senderId){
              $scope.chats[i].data.push({'sender':senderName,'message':msg});
              break;
          }
        }

      });

      //On disconnect remove card from the screen
      socket.on('disconnect',function(userId,userName){
        for(var index in $scope.chats){
          var obj=$scope.chats[index];
          if(obj.id==userId){
            $scope.chats.splice(index,1);
            break;
          }
        }
      });

    }

  });


});
