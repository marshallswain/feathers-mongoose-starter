var bodyParser = require('body-parser');

module.exports = function(app, feathers){

	app.configure(feathers.rest())
	  .use(bodyParser());
};