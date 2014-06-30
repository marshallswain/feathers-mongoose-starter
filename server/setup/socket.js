var decodeToken = require('./auth').decodeToken;

module.exports = function(app, feathers){

	app.configure(feathers.socketio(function(io) {

		io.set('transports', [
	      'websocket'
	  ]);

		/* * * Place for custom events * * */
	  io.on('connection', function(socket) {
	    socket.broadcast.emit('news', { hello: 'world' });

	  });


	  /* * * Checks for a token and decodes/colocates the user on the socket * * */
	  io.use(function(socket, callback) {

	  	// Is there a token in place
	    if (socket.handshake.query.token) {
	  		decodeToken(socket.handshake.query.token, function(err, data){
	  			if (err) {
	  				console.log(err);
	  			} else if (data.email) {

	  				socket.feathers = {
	  					user: data
	  				};
	  				callback(null, true);
	  			}
	  		});

	  	// Nope. No token. Deny access to listen.
	  	} else {
	  		// callback(null, false);
	  		callback(null, true);
	  	}
	  });

	  /* * * You can add your own middleware * * */
	  // io.use(function(socket, callback){
	  // 	// Do your custom logic here.
	  // });

	}));
};