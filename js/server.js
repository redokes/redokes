var http = require('http'), // HTTP server
  io = require('socket.io'), // Socket.io
  fs = require('fs'); // File System
 
// make a standard server
server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    // read index.html and send it to the client
    var output = fs.readFileSync('./index.html', 'utf8');
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
	client.send({
		type: "init",
		data: {
			clients: clients
		}
	});
	
	//store this client data
	clients[client.sessionId] = {
		sessionId: client.sessionId,
		data: {}
	};
	
    // broadcast the connection
	client.broadcast({
		type: "connection",
		data: {
			client: clients[client.sessionId]
		}
	});
    
	// when the server gets a message, during a connection, broadcast the message
	client.on('message', function(data){
		console.log(data);
		//Handle a client update
		if(data.type == "update"){
			//Set the data to this client
			clients[client.sessionId].data = data.data;
			
			//Broadcast an update
			client.broadcast({
				type: "update",
				data: {
					client: clients[client.sessionId]
				}
			});
		}
		
	});
    
	// when the server gets a disconnect, during a connection, broadcast the disconnection
	client.on('disconnect', function(){ 
		client.broadcast({
			type: "disconnect",
			data:{
				client: clients[client.sessionId]
			}
		});
		
		//Remove from client list
		delete clients[client.sessionId];
	});
});