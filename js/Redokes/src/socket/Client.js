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
//Ext.define({String} className, {Object} members, {Function} onClassCreated);
Ext.define('Redokes.socket.Client', {
	extend: 'Ext.util.Observable',
	config:{
		url: '',
		server:false,
		port:8080,
		timeout: 3000,
		data:{}
	},
	messageHandlers: [],
	
	constructor: function(config) {
        this.initConfig(config);
        this.addEvents('connect', 'message', 'disconnect');
		this.initSocket();
		this.initListeners();
        return this;
    },
    
    initSocket: function() {
		if (this.server) {
			this.socket = new io.Socket(this.url, {
				port:this.port,
				connectTimeout: this.timeout
			});
			this.socket.connect();
		}
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
				
				if (this.messageHandlers[request.module]) {
					this.messageHandlers[request.module].callAction(request.action, request);
				}
				
				//If messageHandlers[module] route to that
				
			}, this));
			
			this.socket.on('disconnect', Ext.Function.bind(function(client){
				this.fireEvent('disconnect', arguments);
			}, this));
		}
	},
	
	registerMessageHandler: function(handler){
		this.messageHandlers[handler.module] = handler;
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
	
	initSocket: function() {
		if (this.server) {
			this.socket = new io.Socket(this.socket, {
				port:this.port
			});
			this.socket.connect();
		}
	},
	
	initListeners: function() {
		if (this.socket) {
			this.socket.on('connect', function(){
				this.fireEvent('connect', arguments);
				
				this.send(
					Modules.Client,
					Actions.Update,
					this.data
				);
				
			}.createDelegate(this));
			
			this.socket.on('message', function(request){
				var params = {
					module:request.module,
					action:request.action
				};
				this.fireEvent('message', params);
			}.createDelegate(this));
			
			this.socket.on('disconnect', function(client){
				this.fireEvent('disconnect', arguments);
			}.createDelegate(this));
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
*/