Ext.ns('Redokes.Socket');

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

Redokes.Socket.Client = Ext.extend(Ext.util.Observable, {
	socket:false,
	server:false,
	port:8080,
	
	data:{},
	
	constructor: function(params) {
		Ext.apply(this, params);
		this.addEvents('connect', 'message', 'disconnect');
		this.initSocket();
		this.initListeners();
		
	},
	
	initListeners: function() {
		if (this.socket) {
			this.socket.on('connect', Ext.Function.bind(function(){
				this.fireEvent('connect', arguments);
				
				this.send(
					Modules.Client,
					Actions.Update,
					this.data
				);
				
			}, this));
			
			this.socket.on('message', Ext.Function.bind(function(request){
				var params = {
					module:request.module,
					action:request.action
				};
				this.fireEvent('message', params);
			}, this));
			
			this.socket.on('disconnect', Ext.Function.bind(function(client){
				this.fireEvent('disconnect', arguments);
			}, this));
		}
	},
	
	initSocket: function() {
		if (this.server) {
			this.socket = new io.Socket(this.socket, {
				port:this.port
			});
			this.socket.connect();
		}
	},
	
	send: function(module, action, data) {
		this.socket.send({
    		module: module,
    		action: action,
    		data: data
    	});
	}
});

/*

var client = new Redokes.Socket.Client({
	server:'wes',
	port:8080
});
Ext.get('test').on('click', function() {
	client.send('client', 'testAction', {
		one:'one',
		two:'two',
		nice:'this is nice'
	});
});

client.on('message', function(params) {
	console.log(params);
});

*/