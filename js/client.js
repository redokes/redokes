// make a connection to the server
var serverUrl = "redokes.com";
//var serverUrl = "jared";

//Modules and actions used by the client
var Modules = {
	Server: "server",
	Client: "client"
};

var Actions = {
	Init: "init",
	Connect: "connect",
	Disconnect: "disconnect",
	Update: "update"
};

Ext.onReady(function(){
    var socket = new io.Socket(serverUrl, {
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
    	//Send a client update to the server
    	send(
    		Modules.Client,
    		Actions.Update,
    		clientData
    	);
    });
 
    socket.on('connect_failed', function(){
         //console.log('The connection to the server failed.');
    });
 
    socket.on('message', function(request){
    	var module = request.module;
		var action = request.action;
		
    	//handle when a user connects
		switch(module){
			case Modules.Client:
				
				//Handle client connection
				if(action == Actions.Connect){
					makeUserBubble(request.session, request.data);
				}
				
				//Handle client disconnection
				if(action == Actions.Disconnect){
					removeUserBubble(request.session);
				}
				
				//Handle when a client updates
				if(action == Actions.Update){
					updateUserBubble(request.session, request.data);
				}
				
			break;
			
			case Modules.Server:
				if(action == Actions.Init){
					var clients = request.data.clients;
					for(var sessionId in clients){
						makeUserBubble(sessionId, clients[sessionId]);
					}
				}
			break;
			
			default:
			break;
		}
    });
 
    socket.on('disconnect', function(client){ 
    	
    });
    
    
    //Handle name change
    Ext.get('name').on('keyup', function(){
    	clientData.name = Ext.get('name').dom.value;
    	send(
    		Modules.Client,
    		Actions.Update,
    		clientData
    	);
    });
    
    //Handle message change
    Ext.get('message').on('keyup', function(){
    	clientData.message = Ext.get('message').dom.value;
    	send(
    		Modules.Client,
    		Actions.Update,
    		clientData
    	);
    });
    
    
    function send(module, action, data){
    	socket.send({
    		module: module,
    		action: action,
    		data: data
    	});
    };
    
});

function makeUserBubble(session, data){
	//make sure this bubble doesnt already exist
	if(Ext.get(session) != null){
		return false;
	}
	
	var name = session;
	if(data.name != null){
		name = data.name;
	}
	
	//Create the bubble container
	var bubble = Ext.get(Ext.core.DomHelper.append(Ext.getBody(), {
		id: session,
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
		html: data.message
	});
	
};

function removeUserBubble(session){
	Ext.get(session).fadeOut({
		endOpacity: 0,
		duration: 500,
		remove: true
	});
};

function updateUserBubble(session, data){
	Ext.get(session).select('.name').update(data.name);
	Ext.get(session).select('.message').update(data.message);
}

