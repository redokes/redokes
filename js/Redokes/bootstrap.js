var ExtPath = '/js/ext/src';
var RedokesPath = '/js/Redokes/src';
if (Ext.Loader.config.enabled) {
	Ext.Loader.setPath('Ext', ExtPath);
	Ext.Loader.setPath('Redokes', RedokesPath);
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