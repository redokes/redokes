Ext.define('Redokes.examples.chat.modules.user.User', {
	extend: 'Ext.util.Observable',
	
	config: {
		application: null
	},
	
	constructor: function(config){
		this.initConfig(config);
		this.init();
		return this;
	},
	
	init: function(){
		this.initClient();
		this.initClientHandler();
		this.initServerHandler();
		this.initUserHandler();
		
		this.initUserList();
		this.initMessages();
		
		this.initToolbar();
	},
	
	
	//Init client and handlers
	initClient: function(){
		this.client = this.application.client;
	},
	
	initClientHandler: function(){
    	this.clientHandler = Ext.create('Redokes.socket.client.Handler', {
			scope: this,
			client: this.client,
			module:'client',
			actions:[
				'connect',
				'disconnect'
			]
		});
    },
	
	initServerHandler: function(){
    	this.serverHandler = Ext.create('Redokes.socket.client.Handler', {
			scope: this,
			client: this.client,
			module:'server',
			actions:[
				'init'
			]
		});
    },
	
	initUserHandler: function(){
		this.userHandler = Ext.create('Redokes.socket.client.Handler', {
			scope: this,
			client: this.client,
			module:'user',
			actions:[
				'update',
				'message'
			]
		});
	},
	
	
	//Init the User interface
	initUserList: function(){
		this.userList = this.application.west;
		
		//Handler Listeners
		this.serverHandler.on('init', function(handler, response) {
			var clients = response.data.clients;
			for(var sessionId in clients){
				var client = clients[sessionId];
				this.addUser(sessionId, client.data.user);
			}
		}, this);
		this.clientHandler.on('connect', function(handler, response){
			this.addUser(response.session, response.client.user);
		}, this);
		this.clientHandler.on('disconnect', function(handler, response){
			this.removeUser(response.session);
		}, this);
		this.userHandler.on('update', function(handler, response){
			var panel = this.userList.down('#' + response.session);
			if(panel != null){
				panel.update(response.data.name);
			}
		}, this);
	},
	
	initMessages: function(){
		this.messages = this.application.center;
		this.userHandler.on('message', function(handler, response){
			this.addMessage(response.session, response.client.user.name, response.data.message);
		}, this);
		
		this.clientHandler.on('disconnect', function(handler, response){
			var panels = this.messages.query('component[session="' + response.session + '"]');
			Ext.each(panels, function(panel){
				//panel.destroy();
			}, this);
		}, this);
		
		this.userHandler.on('update', function(handler, response){
			var panels = this.messages.query('component[session="' + response.session + '"]');
			Ext.each(panels, function(panel){
				panel.getEl().down('.name').update(response.data.name);
			}, this);
		}, this);
	},
	
	initToolbar: function(){
		this.nameField = Ext.create('Ext.form.field.Text', {
    		fieldLabel: 'Name',
	    	labelWidth: 50,
			value: 'New User',
	    	enableKeyEvents: true
    	});
    	this.nameField.on('keyup', function(){
    		this.client.send(
				'user',
				'update',
				{
					name: this.nameField.getValue()
				}
			);
    	}, this);
    	this.messageField = Ext.create('Ext.form.field.Text', {
    		fieldLabel: 'Message',
	    	labelWidth: 50,
	    	enableKeyEvents: true,
			listeners: {
				scope: this,
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        this.client.send(
							'user',
							'message',
							{ message: this.messageField.getValue() }
						);
						this.addMessage(0, 'Me', this.messageField.getValue());
						this.messageField.setValue('');
                    }
                }
            }
    	});
    	this.toolbar = Ext.create('Ext.toolbar.Toolbar', {
			dock: 'top',
    	    items: [this.nameField, this.messageField]
    	});
		this.messages.dockedItems.add(this.toolbar);
		
		this.client.on('connect', function(){
			this.client.send(
				'user',
				'update',
				{
					name: this.nameField.getValue()
				}
			);
		}, this);
	},
	
	addUser: function(session, data){
		var name = this.nameField.getValue();
		if(data != null){
			name = data.name;
		}
		this.userList.add({
			itemId: session,
			html: name
		});
	},
	
	removeUser: function(session){
		var panel = this.userList.down('#' + session);
		if(panel != null){
			panel.destroy();
		}
	},
	
	addMessage: function(session, name, message){
		this.messages.add({
			session: session,
			html: '<div class="name">' + name + '</div><div class="message">' + message + '</div>'
		});
	}
});