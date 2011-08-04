Ext.define('RedokesClient', {
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
		if(config.data != null){
			Ext.apply(config.data, this.config.data);
		}
		this.initConfig(config);
		this.init();
        return this;
    },
	
	init: function(){
		
		this.addEvents('init');
		
        this.initClient();
        this.initHandlers();
        this.initUI();
		this.client.connect();
	},
    
    initClient: function(){
    	this.client = Ext.create('Redokes.socket.Client', {
			url: this.url,
			data: this.data,
			port:8080
		});
    },
	
	initHandlers: function(){
		this.initClientHandler();
        this.initServerHandler();
		this.initUserHandler();
	},
    
    initClientHandler: function(){
    	this.clientHandler = Ext.create('Redokes.socket.Handler', {
			module:'client',
			scope: this,
			actions:{
				connect: function(request) {
					this.makeUserBubble(request.session, request.data);
				},
				disconnect: function(request) {
					this.removeUserBubble(request.session);
				}
			}
		});
    	this.client.registerHandler(this.clientHandler);
    },
    
    initServerHandler: function(){
    	this.serverHandler = Ext.create('Redokes.socket.Handler', {
			module:'server',
			scope: this,
			actions:{
				init: function(request) {
					var clients = request.data.clients;
					for(var sessionId in clients){
						this.makeUserBubble(sessionId, clients[sessionId].data);
					}
					
					this.fireEvent('init');
				}
			}
		});
    	this.client.registerHandler(this.serverHandler);
    },
	
	initUserHandler: function(){
		this.userHandler = Ext.create('Redokes.socket.Handler', {
			module:'user',
			scope: this,
			actions:{
				update: function(request){
					this.updateUserBubble(request.session, request.data);
				},
				message: function(request){
					this.addMessage(request.session, request.data);
				}
			}
		});
    	this.client.registerHandler(this.userHandler);
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
				'user',
				'update',
				this.data
			);
    	}, this);
    	this.messageField = Ext.create('Ext.form.field.Text', {
    		fieldLabel: 'Message',
	    	labelWidth: 50,
	    	enableKeyEvents: true,
			listeners: {
				scope: this,
                specialkey: function(field, e){
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                    if (e.getKey() == e.ENTER) {
                        this.client.send(
							'user',
							'message',
							{
								message: this.messageField.getValue()
							}
						);
						this.messageField.setValue('');
                    }
                }
            }
    	});
    	this.toolbar = Ext.create('Ext.toolbar.Toolbar', {
    	    renderTo: document.body,
    	    items: [this.nameField, this.messageField]
    	});
		
		this.on('init', function(){
			this.client.send(
				'user',
				'update',
				this.data
			);
		}, this);
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
			cls: 'message-container'
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
		Ext.get(session).down('.name').update(data.name);
	},
	
	addMessage: function(session, data){
		Ext.core.DomHelper.append(Ext.get(session).down('.message-container'), {
			tag: 'div',
			cls: 'message',
			html: data.message
		});
	}
    
});