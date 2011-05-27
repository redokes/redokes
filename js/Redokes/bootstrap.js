var ExtPath = '/js/ext';
var RedokesPath = '/js/Redokes';
if (Ext.Loader.config.enabled) {
	Ext.Loader.config.paths.Redokes = RedokesPath;
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