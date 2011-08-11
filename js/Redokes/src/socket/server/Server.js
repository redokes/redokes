var Server = {
	
	/**
     * Load all the requred classesused for the server
     */
	http: require('http'),
	io: require('socket.io'),
	fs: require('fs'),
	qs: require('querystring'),
	utils: require('util'),
	
	/**
     * Any config elements used within the server
     */
	clients: {},
	
	
	/**
     * Runs all the init functions for the server
     */
	init: function(){
		this.clients = {};
		this.initServer();
		this.initSocket();
	},
	
	/**
     * Inits the server
	 * Sets up the listeners to process requests
     */
	initServer: function(){
		//make a standard server
		this.server = this.http.createServer(function(req, res){
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end('nodejs server is running!');
		});

		//Parse the requests to this server
		this.server.addListener('request', function(request, response){
			var requestObject = require('url').parse(request.url, true);
			var path = requestObject.pathname.replace(/^\//, "").replace(/\/$/, "");

			//Handle the post params
			if (request.method == 'POST') {
				var body = '';
				request.on('data', function (data) {
					body += data;
				}.bind(this));
				request.on('end', function () {
					var post = this.qs.parse(body.replace( /\+/g, ' ' ));
					this.parseRequest(path, post);
				}.bind(this));
			}
			else{
				this.parseRequest(path, {});
			}
		}.bind(this));

		//run on port 8080
		this.server.listen(8080);
	},
	
	/**
     * Inits the socket, and sets up all listeners for
	 * users to interact
     */
	initSocket: function(){
		//listen to the server
		this.socket = this.io.listen(this.server);

		//on a connection, do stuff
		this.socket.on('connection', function(client){
			this.send(
				client,
				'server',
				'init',
				{
					clients: this.clients
				}
			);

			//store this client data
			this.clients[client.sessionId] = {
				sessionId: client.sessionId,
				data: {}
			};

			// broadcast the connection
			this.broadcast(
				client,
				'client',
				'connect',
				this.clients[client.sessionId]
			);

			// when the server gets a message, during a connection, broadcast the message
			client.on('message', function(request){
				var module = request.module;
				var action = request.action;

				//If the action is an update, save the passed data and associate it with the module
				if(action == 'update'){
					this.clients[client.sessionId].data[module] = request.data;
				}

				//Broadcast the message
				this.broadcast(
					client,
					request.module,
					request.action,
					request.data
				);
			}.bind(this));

			//when the server gets a disconnect, during a connection, broadcast the disconnection
			client.on('disconnect', function(){ 
				this.broadcast(
					client,
					'client',
					'disconnect',
					{}
				);

				//Remove from client list
				delete this.clients[client.sessionId];
			}.bind(this));
		}.bind(this));
	},
	
	
	/**
     * Sends a message to the client
     * @param {Client} client
     * @param {String} module
     * @param {String} action
     * @param {Object} data
     */
	send: function(client, module, action, data){
		client.send({
			module: module,
			action: action,
			session: client.sessionId,
			data: data
		});
	},

	/**
     * Sends a message to all other clients
     * @param {Client} client
     * @param {String} module
     * @param {String} action
     * @param {Object} data
     */
	broadcast: function(client, module, action, data){
		client.broadcast({
			module: module,
			action: action,
			session: client.sessionId,
			data: data,
			client: this.clients[client.sessionId].data
		});
	},

	/**
     * Parses a request received by the server
     * @param {String} path
     * @param {Object} post
     */
	parseRequest: function(path, post){
		var requestArray = path.split('/');
		if(requestArray.length < 3){
			return false;
		}
		var type = requestArray[0];
		var module = requestArray[1];
		var action = requestArray[2];
		var data = {};
		if(post.data != null){
			data = post.data;
		}

		//Switch on the type
		switch(type){
			case "broadcast":
				this.socketBroadcast(module, action, data);
			break;

			default:
			break;
		}

	},

	/**
     * Sends a message to all clients
     * @param {String} module
     * @param {String} action
     * @param {Object} data
     */
	socketBroadcast: function(module, action, data){
		this.socket.broadcast({
			module: module,
			action: action,
			data: data
		});
	}
};
Server.init();