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


Ext.define('Redokes.socket.client.Client', {
	extend: 'Ext.util.Observable',
	config:{
		url: '',
		server:false,
		port:8080,
		timeout: 3000,
		data:{}
	},
	handlers: {},
	
	constructor: function(config) {
		this.handlers = {};
        this.initConfig(config);
        this.addEvents('connect', 'message', 'disconnect');
		this.initSocket();
		this.initListeners();
        return this;
    },
	
	connect: function(){
		this.socket.connect();
	},
    
    initSocket: function() {
		this.socket = new io.Socket(this.url, {
			port:this.port,
			connectTimeout: this.timeout
		});
	},
	
	initListeners: function() {
		if (this.socket) {
			this.socket.on('connect', Ext.Function.bind(function(){
				this.fireEvent('connect', arguments);
			}, this));
			
			this.socket.on('message', Ext.Function.bind(function(request){
				var params = {
					module:request.module,
					action:request.action
				};
				this.fireEvent('message', params);
				
				if (this.handlers[request.module]) {
					//Loop through and run all actions
					Ext.each(this.handlers[request.module], function(handler){
						handler.callAction(request.action, request);
					}, this);
				}
				
			}, this));
			
			this.socket.on('disconnect', Ext.Function.bind(function(client){
				this.fireEvent('disconnect', arguments);
			}, this));
		}
	},
	
	registerHandler: function(handler){
		if(this.handlers[handler.module] == null){
			this.handlers[handler.module] = [];
		}
		this.handlers[handler.module].push(handler);
	},
	
	send: function(module, action, data) {
		this.socket.send({
    		module: module,
    		action: action,
    		data: data
    	});
	}
});