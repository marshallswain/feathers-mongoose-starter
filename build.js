var stealTools = require('steal-tools');

stealTools.build({
	config: './public/stealconfig.js',
	main: 'main'
}).then(function(){
	console.log('build is successful');
});