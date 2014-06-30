var bodyParser = require('body-parser'),
	decodeToken = require('./auth').decodeToken;

module.exports = function(app, feathers){

	app.configure(feathers.rest())
	  .use(bodyParser());
};