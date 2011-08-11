Ext.define('Redokes.socket.client.Handler', {
	extend: 'Ext.util.Observable',
	config: {
		client: null,
		module:false,
		actions: [],
		scope: null
	},
	
	constructor: function(config) {
        this.initConfig(config);
		this.initClient();
		this.initActions();
        return this;
    },
	
	initClient: function(){
		this.client.registerHandler(this);
	},
	
	initActions: function(){
		//Turn the actions into an object
		var actionsObject = {};
		Ext.each(this.actions, function(action){
			actionsObject[action] = true;
		}, this);
		this.actions = actionsObject;
		
		//Add events for each action
		for(var action in this.actions){
			this.addEvents(action);
		}
	},
	
	callAction: function(action, request){
		if(this.actions[action] == null){
			return false;
		}
		
		//Fire the event
		this.fireEvent(action, this, request);
	}
	
});