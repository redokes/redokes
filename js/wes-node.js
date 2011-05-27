var client = Ext.create('Redokes.socket.Client', {
	server:'wes',
	port:8080,
	messageHandler:messageHandler
});

var messageHandler = Ext.create('Redokes.socket.MessageHandler', {
	module:'client',
	actions:{
		test: function(request) {
			console.log(request);
		},
		
		connect: function(request) {
			console.log('connection function');
			makeUserBubble(request.session, request.data);
		},
		
		disconnect: function(request) {
			console.log('disconnect function');
			removeUserBubble(request.session);
		},
		
		update: function(request) {
			console.log('update function');
			updateUserBubble(request.session, request.data);
		}
		
	}
});

var serverMessageHandler = Ext.create('Redokes.socket.MessageHandler', {
	module:'server',
	actions:{
		init: function(request) {
			console.log('server init');
			var clients = request.data.clients;
			for(var sessionId in clients){
				makeUserBubble(sessionId, clients[sessionId].data);
			}
		}
	}
});

client.registerMessageHandler(messageHandler);
client.registerMessageHandler(serverMessageHandler);
	
Ext.get('test').on('click', function() {
	client.send('Wes', 'test', {
		one:'one',
		two:'two',
		nice:'this is nice'
	});
});

var clientData = {
	name: Ext.get("name").dom.value,
	message: Ext.get("message").dom.value
};

 Ext.get('name').on('keyup', function(){
	clientData.name = Ext.get('name').dom.value;
	client.send(
		'client',
		'update',
		clientData
	);
});

//Handle message change
Ext.get('message').on('keyup', function(){
	clientData.message = Ext.get('message').dom.value;
	client.send(
		'client',
		'update',
		clientData
	);
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

