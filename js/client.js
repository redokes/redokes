// make a connection to the server
Ext.onReady(function(){
    var socket = new io.Socket('jared', {
        port:8080,
        connectTimeout:3000
     });

    // make a message buffer in case things get congested
    var buffer = [];

    //Connect this client to the server
    socket.connect();
    
    socket.on('connect', function(){
        var data = {
        	name: "Test"
        };
        socket.send({
        	type: "update",
        	data: data
        });
    });
 
    socket.on('connect_failed', function(){
         console.log('The connection to the server failed.');
    });
 
    socket.on('message', function(data){
    	console.log(data);
    	//handle when a user connects
		if(data.type == "connection"){
			var client = data.data.client;
			makeUserBubble(client);
  	  	}
		
		//handle when a user disconnects
		if(data.type == "disconnect"){
			removeUserBubble(data.data.client);
		}
		
		//make all the current users on init
		if(data.type == "init"){
			var clients = data.data.clients
			for(var sessionId in clients){
				makeUserBubble(clients[sessionId]);
			}
		}
		
		//Handle when a client updates data
		if(data.type == "update"){
			updateUserBubble(data.data.client);
		}
    });
 
    socket.on('disconnect', function(client){ 
    	
    });
    
    
    //Handle name change
    Ext.get('update-name').on('click', function(){
    	var data = {
        	name: Ext.get('name').dom.value
        };
        socket.send({
        	type: "update",
        	data: data
        });
    });
});

function makeUserBubble(client){
	var html = client.sessionId;
	if(client.data.name != null){
		html = client.data.name + " " + client.sessionId;
	}
	Ext.core.DomHelper.append(Ext.getBody(), {
		id: client.sessionId,
		cls: 'client-bubble',
		html: html
	});
};

function removeUserBubble(client){
	console.log(client);
	Ext.get(client.sessionId).remove();
};

function updateUserBubble(client){
	Ext.get(client.sessionId).update(client.data.name + " " + client.sessionId);
}
