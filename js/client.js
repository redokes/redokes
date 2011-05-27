// make a connection to the server
Ext.onReady(function(){
    var socket = new io.Socket('redokes.com', {
        port:8080,
        connectTimeout:3000
     });

    // make a message buffer in case things get congested
    var buffer = [];

    //Connect this client to the server
    socket.connect();
    
    //Client Data
    var clientData = {
    	name: Ext.get("name").dom.value,
    	message: Ext.get("message").dom.value
    };
    
    socket.on('connect', function(){
        socket.send({
        	type: "update",
        	data: clientData
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
    Ext.get('name').on('keyup', function(){
    	clientData.name = Ext.get('name').dom.value;
        socket.send({
        	type: "update",
        	data: clientData
        });
    }, this, { buffer: 500 });
    
    //Handle message change
    Ext.get('message').on('keyup', function(){
    	clientData.message = Ext.get('message').dom.value;
        socket.send({
        	type: "update",
        	data: clientData
        });
    }, this, { buffer: 500 });
    
});

function makeUserBubble(client){
	var name = client.sessionId;
	if(client.data.name != null){
		name = client.data.name;
	}
	
	//Create the bubble container
	var bubble = Ext.get(Ext.core.DomHelper.append(Ext.getBody(), {
		id: client.sessionId,
		cls: 'user-bubble',
		style:{
			display: "none"
		}
	}));
	bubble.show(true);
	
	//Add the name
	Ext.core.DomHelper.append(bubble, {
		cls: 'name',
		html: name
	});
	
	//Add the message
	Ext.core.DomHelper.append(bubble, {
		cls: 'message',
		html: client.data.message
	});
	
};

function removeUserBubble(client){
	console.log(client);
	Ext.get(client.sessionId).remove();
};

function updateUserBubble(client){
	Ext.get(client.sessionId).select('.name').update(client.data.name);
	Ext.get(client.sessionId).select('.message').update(client.data.message);
}

