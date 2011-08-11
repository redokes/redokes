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
		this.initUserList();
		this.initMessages();
		this.initToolbar();
		this.initFooter();
	},
	
	
	//Init client and handlers
	initClient: function(){
		this.client = this.application.client;
	},

	
	//Init the User interface
	initUserList: function(){
		this.userList = this.application.west;
		
		//Server Handlers
		Ext.create('Redokes.socket.client.Handler', {
			scope: this,
			client: this.client,
			module: 'server',
			actions: {
				init: function(handler, response){
					var clients = response.data.clients;
					for(var sessionId in clients){
						var client = clients[sessionId];
						this.addUser(sessionId, client.data.user);
					}
				}
			}
		});
		
		//Client Handlers
		Ext.create('Redokes.socket.client.Handler', {
			scope: this,
			client: this.client,
			module: 'client',
			actions: {
				connect: function(handler, response){
					this.addUser(response.session, response.client.user);
				},
				disconnect: function(handler, response){
					this.removeUser(response.session);
				}
			}
		});
		
		//User Handlers
		Ext.create('Redokes.socket.client.Handler', {
			scope: this,
			client: this.client,
			module: 'user',
			actions: {
				update: function(handler, response){
					var panel = this.userList.down('#' + response.session);
					if(panel != null){
						panel.getEl().down('.name').update(response.data.name);
					}
				},
				typing: function(handler, response){
					var panel = this.userList.down('#' + response.session);
					if(panel != null){
						if(response.data.message.length){	
							panel.getEl().down('.info').update('typing...');
						}
						else{
							panel.getEl().down('.info').update('');
						}
					}
				}
			}
		});
	},
	
	initMessages: function(){
		this.messages = this.application.center;
		
		//User Handlers
		Ext.create('Redokes.socket.client.Handler', {
			scope: this,
			client: this.client,
			module: 'user',
			actions: {
				message: function(handler, response){
					this.addMessage(response.session, response.client.user.name, response.data.message);
				},
				update: function(handler, response){
					var panels = this.messages.query('component[session="' + response.session + '"]');
					Ext.each(panels, function(panel){
						panel.getEl().down('.name').update(response.data.name);
					}, this);
				}
			}
		});
		
		//Client Handlers
		Ext.create('Redokes.socket.client.Handler', {
			scope: this,
			client: this.client,
			module: 'client',
			actions: {
				disconnect: function(handler, response){
					var panels = this.messages.query('component[session="' + response.session + '"]');
					Ext.each(panels, function(panel){
						//panel.destroy();
					}, this);
				}
			}
		});
	},
	
	initToolbar: function(){
		
		//Create the name field so the user can change his/her name
		this.nameField = Ext.create('Ext.form.field.Text', {
    		fieldLabel: 'Name',
	    	labelWidth: 50,
			value: 'New User',
	    	enableKeyEvents: true
    	});
		
		//on key up, send a request to the server that the user has changed names
    	this.nameField.on('keyup', function(){
    		this.client.send(
				'user',
				'update',
				{
					name: this.nameField.getValue()
				}
			);
    	}, this);
    	
		//Create a toolbar to hold the name field
    	this.toolbar = Ext.create('Ext.toolbar.Toolbar', {
			dock: 'top',
    	    items: [this.nameField]
    	});
		this.messages.dockedItems.add(this.toolbar);
		
		//Listen for when the client is connected and send an updated name
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
	
	initFooter: function(){
		
		//Create a message field so the user can send messages
		this.messageField = Ext.create('Ext.form.field.Text', {
    		//fieldLabel: 'Message',
	    	//labelWidth: 50,
			anchor: '100%',
	    	enableKeyEvents: true,
			emptyText: 'Type your message here...',
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
		
		//on key up, send a request to the server that says the user is typing or not typing
    	this.messageField.on('keyup', function(){
    		this.client.send(
				'user',
				'typing',
				{
					message: this.messageField.getValue()
				}
			);
    	}, this);
		
		//Create a toolbar to hold the message field
    	this.footer = Ext.create('Ext.panel.Panel', {
			dock: 'bottom',
			layout: 'anchor',
			bodyPadding: 5,
			bodyCls: 'message-footer',
    	    items: [this.messageField]
    	});
		this.messages.dockedItems.add(this.footer);
	},
	
	addUser: function(session, data){
		var name = this.nameField.getValue();
		if(data != null){
			name = data.name;
		}
		this.userList.add({
			xtype: 'container',
			cls: 'user-wrap',
			itemId: session,
			html: '<div class="name">' + name + '</div><div class="info"></div><div class="clear"></div>'
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
			xtype: 'container',
			cls: 'message-wrap',
			session: session,
			html: '<div class="name">' + name + ':</div><div class="message">' + message + '</div>'
		});
		
		this.messages.body.scrollTo('top', this.messages.body.dom.scrollHeight);
	}
});