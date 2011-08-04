Ext.define('Home.lib.Client', {
	extend: 'Ext.util.Observable',
	config:{
		url: '',
		port:8080,
		timeout: 3000,
		data: {
			name: "some randy",
			message: "Who am i?"
		}
	},
	
	constructor: function(config) {
		//Run the inits
        this.initConfig(config);
        this.initClient();
        this.initClientHandler();
        this.initServerHandler();
        this.initUI();
        
        //Connect the client
        this.client.connect();
        
        //Return the object
        return this;
    },
    
    initClient: function(){
    	this.client = Ext.create('Redokes.socket.Client', {
			url: this.url,
			data: this.data,
			port:8080
		});
    },
    
    initClientHandler: function(){
    	this.clientHandler = Ext.create('Redokes.socket.MessageHandler', {
			module:'client',
			actions:{
				connect: Ext.bind(function(request) {
					this.fireEvent('connect', request);
				}, this),

				disconnect: Ext.bind(function(request) {
					this.fireEvent('disconnect', request);
				}, this),

				update: Ext.bind(function(request) {
					this.fireEvent('update', request);
				}, this)
			}
		});
    	this.client.registerHandler(this.clientHandler);
    },
    
    initServerHandler: function(){
    	this.serverHandler = Ext.create('Redokes.socket.MessageHandler', {
			module:'server',
			actions:{
				init: Ext.bind(function(request) {
					this.fireEvent('init', request);
				}, this)
			}
		});
    	this.client.registerHandler(this.serverHandler);
    },
    
    initUI: function(){
    	this.nameField = Ext.create('Ext.form.field.Text', {
    		fieldLabel: 'Name',
	    	labelWidth: 50,
	    	enableKeyEvents: true
    	});
    	this.nameField.on('keyup', function(){
    		this.data.name = this.nameField.getValue();
    		this.client.send(
				'client',
				'update',
				this.data
			);
    	}, this);
    	this.messageField = Ext.create('Ext.form.field.Text', {
    		fieldLabel: 'Message',
	    	labelWidth: 50,
	    	enableKeyEvents: true
    	});
    	this.messageField.on('keyup', function(){
    		this.data.message = this.messageField.getValue();
    		this.client.send(
				'client',
				'update',
				this.data
			);
    	}, this);
    	this.toolbar = Ext.create('Ext.toolbar.Toolbar', {
    	    renderTo: document.body,
    	    items: [this.nameField, this.messageField]
    	});
    	
    	this.userPanel = new Ext.panel.Panel({
    		renderTo: document.body,
    		height: 400
    	});
    },
    
    makeUserBubble: function(session, data){
		//make sure this bubble doesnt already exist
		if(Ext.get(session) != null){
			return false;
		}

		var name = session;
		if(data.name != null){
			name = data.name;
		}

		//Create the bubble container
		var bubble = Ext.get(Ext.core.DomHelper.append(this.userPanel.body, {
			id: session,
			cls: 'user-bubble',
			style:{
				display: "none"
			}
		}));
		
		//Make the bubble draggable
		var dd = new Ext.dd.DD(bubble.id);
		
		//Show the bubble
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

	},
	
	removeUserBubble: function(session){
		if(Ext.get(session) == null){
			return false;
		}
		
		Ext.get(session).fadeOut({
			endOpacity: 0,
			duration: 500,
			remove: true
		});
	},

	updateUserBubble: function(session, data){
		Ext.get(session).select('.name').update(data.name);
		Ext.get(session).select('.message').update(data.message);
		
		//Move bubble to the front
	}
    
});

/*
var client = Ext.create('Redokes.socket.Client', {
			server:'<?php echo $serverUrl; ?>',
			port:8080
		});

		var messageHandler = Ext.create('Redokes.socket.MessageHandler', {
			module:'client',
			actions:{
				test: function(request) {
				},

				connect: function(request) {
					makeUserBubble(request.session, request.data);
				},

				disconnect: function(request) {
					removeUserBubble(request.session);
				},

				update: function(request) {
					updateUserBubble(request.session, request.data);
				}

			}
		});

		var serverMessageHandler = Ext.create('Redokes.socket.MessageHandler', {
			module:'server',
			actions:{
				init: function(request) {
					var clients = request.data.clients;
					for(var sessionId in clients){
						makeUserBubble(sessionId, clients[sessionId].data);
					}
				}
			}
		});

		client.registerMessageHandler(messageHandler);
		client.registerMessageHandler(serverMessageHandler);

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
*/