var ExtPath = '/js/ext';
var RedokesPath = '/js/Redokes/src';
if (Ext.Loader.config.enabled) {
	Ext.Loader.setPath('Ext', '/js/ext/src');
	Ext.Loader.setPath('Redokes', '/js/Redokes/src');
}
else {
	Ext.Loader.setConfig({
		enabled: true,
		paths:{
			Ext: ExtPath,
			Redokes: RedokesPath
		}
	});
}