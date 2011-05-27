var client = Ext.create('Redokes.Socket.Client', {
	server:'wes',
	port:8080
});


Ext.get('test').on('click', function() {
	client.send('client', 'testAction', {
		one:'one',
		two:'two',
		nice:'this is nice'
	});
});

client.on('message', function(params) {
	console.log(params);
});