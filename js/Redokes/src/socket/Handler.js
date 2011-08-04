Ext.define('Redokes.socket.Handler', {
	extend: 'Ext.util.Observable',
	config: {
		module:false,
		actions:{},
		scope: null
	},
	
	constructor: function(config) {
        this.initConfig(config);
        return this;
    },
	
	callAction: function(action, request){
		if(this.actions[action] == null){
			return false;
		}
		if(this.scope != null){
			Ext.bind(this.actions[action], this.scope)(request);
		}
		else{
			this.actions[action](request);
		}
	}
	
});