Ext.application({
    name: 'Home',
    appFolder: '/js/home',
    controllers: [
        'Users'
    ],
    
    launch: function() {
		this.initUI();
    },
    
    initUI: function(){
    	Ext.create('Home.view.Viewport', {
        	layout: 'fit',
            items: [
                {
                    xtype: 'userlist'
                }
            ]
        });
    }
});
