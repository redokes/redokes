Ext.define('Redokes.examples.chat.Chat', {
	extend: 'Ext.container.Viewport',
	
	//Config
	layout: 'border',
	
	//Inits
	initComponent: function(){
		this.items = [];
		this.init();
		this.callParent(arguments);
	},
	
	init: function(){
		//Create the client
		this.initClient();
		
		//Create the layout
		this.initCenter();
		this.initWest();
		
		//Create modules
		this.initUser();
	},
	
	initClient: function(){
		this.client = Ext.create('Redokes.examples.chat.Client');
		
		//After render connect the client
		this.on('afterrender', function(){
			this.client.connect();
		}, this);
	},
	
	initCenter: function(){
		this.center = new Ext.panel.Panel({
			title: 'Center',
			region: 'center'
		});
		this.items.push(this.center);
	},
	
	initWest: function(){
		this.west = new Ext.panel.Panel({
			title: 'West',
			region: 'west',
			width: 250
		});
		this.items.push(this.west);
	},
	
	initUser: function(){
		Ext.create('Redokes.examples.chat.modules.user.User',{
			application: this
		});
	}
});