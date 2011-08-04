Ext.define('Home.view.users.List', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.userlist',
    title : 'Connected Users',
    layout: 'fit',
    autoShow: true,

    initComponent: function() {
       this.callParent(arguments);
    }
});
