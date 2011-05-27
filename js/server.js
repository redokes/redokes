/**
 * Types of requests - modules
 * 	-client
 * 		-update
 * 		-connect
 * 		-disconnect
 * 	-server
 * 		-update
 * 		-init
 */
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

var http = require('http'), // HTTP server
  io = require('socket.io'), // Socket.io
  fs = require('fs'); // File System
 
// make a standard server
server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    // read index.html and send it to the client
    var output = fs.readFileSync('./index.php', 'utf8');
    res.end(output);
});
// run on port 8080
server.listen(8080);

//Clients array
var clients = {};
 
// listen to the server
var socket = io.listen(server);

// on a connection, do stuff
socket.on('connection', function(client){
	
	//Send the client the client list
	send(
		client,
		Modules.Server,
		Actions.Init,
		{ clients: clients }
	);
	
	//store this client data
	clients[client.sessionId] = {
		sessionId: client.sessionId,
		data: {}
	};
	
    // broadcast the connection
	broadcast(
		client,
		Modules.Client,
		Actions.Connect,
		clients[client.sessionId]
	);
    
	// when the server gets a message, during a connection, broadcast the message
	client.on('message', function(request){
		
		//The only thing that the server is really worried about is the server and client module calls
		var module = request.module;
		var action = request.action;
		
		//Switch on the module
		switch(module){
			case Modules.Client:
				//Update the clients data
				if(action == Actions.Update){
					clients[client.sessionId].data = request.data;
				}
			break;
			
			case Modules.Server:
			break;
			
			default:
			break;
		}
		
		//Broadcast the message
		broadcast(
			client,
			request.module,
			request.action,
			request.data
		);
	});
    
	// when the server gets a disconnect, during a connection, broadcast the disconnection
	client.on('disconnect', function(){ 
		//Broadcast the disconnect message
		broadcast(
			client,
			Modules.Client,
			Actions.Disconnect,
			{}
		);
		
		//Remove from client list
		delete clients[client.sessionId];
	});
});


function send(client, module, action, data){
	client.send({
		module: module,
		action: action,
		session: client.sessionId,
		data: data
	});
}

function broadcast(client, module, action, data){
	client.broadcast({
		module: module,
		action: action,
		session: client.sessionId,
		data: data
	});
}