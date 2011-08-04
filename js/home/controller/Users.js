Ext.define('Home.controller.Users', {
    extend: 'Ext.app.Controller',
    views: ['users.List'],

    init: function() {
		console.log('controller init');
		console.log(this.application);
		this.initClient();
    },
    initClient: function(){
    	this.client = Ext.create('Home.lib.Client', {
    		url: 'jared'
    	});
    }
});
