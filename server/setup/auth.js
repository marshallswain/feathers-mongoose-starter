/**
 * Contains all of the functions necessary to deal with Authentication.
 *
 * 1. decodeToken: decodes a token into user data using.
 * 2. getToken middleware that sets up req.user if a token is passed in REST.
 * 3. Login
 */


var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var randomString = require('random-string');
var postmark = require('postmark')('postmark-key-here');

/**
 * The secret that will be used to encode / decode tokens.
 */
var secret = 'igottasecret';


/**
 * Simply decodes a token into user data using.
 */
exports.decodeToken = function(token, cb){
	try{
	  var data = jwt.decode(token, secret);
	  cb(null, data);
	}
	catch(e){
		console.log(e);
		cb(e, null);
	}
};


/**
 * Middleware to set up req.feathers.user if a token is passed over REST.
 */
var getToken = function(req, res, next){
	if (req.headers.authorization) {
		exports.decodeToken(req.headers.authorization, function(err, data){
			if (err) {
				console.log(err);
			} else if (data.email) {
				req.feathers.user = data;
				next(null, req, res);
			}
		});
	} else {
		console.log('no token/user in getToken');
		next(null, req, res);
	}
};

/**
 * Pass in a mongoose user document and get back a token with the user data..
 */
exports.generateToken = function(user){
	user = user.toObject();

  var isAdmin = false;
	if(user.admin){
		isAdmin = true;
	}

  // Select only a few keys to keep the token small.
  var tokenUser = {
		email: user.email,
		_id: user._id,
		admin: isAdmin
  };

  // Prepare the user.
  delete user.password;

  var token = jwt.encode(tokenUser, secret);

  return {token:token, user:user};
};


/**
 * These set up the express app.
 */
exports.setup = function(app, feathers){

	// All REST routes will set up req.feathers.user if a token is passed.
	app.all('*', getToken);


	/**
	 * POST login.
	 */
	app.post('/api/login', function(req, res){

		var params = {
			query:{
				email:req.body.email.toLowerCase()
			}
		};

		app.lookup('api/users').find(params, function(error, users){

			// If we got data back...
			if (users[0]) {

				// Use the first, and only, matching user.
				var user = users[0];

				// User exists, let's compare the password.
				bcrypt.compare(req.body.password, user.password, function(err, isMatch) {

					// Error checking the password.
					if (err) return res.json(err);

					// Passwords matched, so send a token.
					if (isMatch) {
	          var token = exports.generateToken(user);
			      return res.json(token);

			    // Passwords didn't match.
					} else {
						return res.json({
							error: 'Invalid Login'
						});
					}
				});

			// User not found
			} else {
				return res.json({
					error: 'Invalid Login'
				});
			}
		});
	});


	/**
	 * POST token.
	 */
	app.post('/api/tokenlogin', function(req, res){

		// If there's no token, let the client know.
		if (!req.body.token) {
			res.json({error:'token is required for token login.'});

		// If there's a token...
		} else {

			// decode it.
			exports.decodeToken(req.body.token, function(err, data){

				// If there was an error decoding the token.
				if (err) {
					res.json({error:'Could not decode token. Please login.'});

				// If the token didn't contain any user data...
				} else if (!data.email) {
					res.json({error:'Invalid token. Please login.'});

				// If the decode was successful...
				} else {

					// Check that the token hasn't expired... TODO: Implement expiring tokens.
					res.json(data);

				}
			});

		}


	});

	app.post('/api/changepasswordrequest', function(req, res){

		var params = {
			query:{
				email:req.body.email.toLowerCase()
			}
		};

		var User = app.lookup('api/users');

		User.find(params, function(error, users){

			// No user was found.
			if (!users[0]) {
				return res.json({
					error: 'User Not Found'
				});

			// A user was found, send change password request.
			} else {
				var user = users[0].toObject();
				user.secret = randomString();

				// Save the secret to the user.
				User.update(user.id, user, {}, function(err, user){

					var protocol = 'http';
					if (req.headers['x-forwarded-proto'] == 'https') {
						protocol = 'https';
					}

					var body = 'Click here to change your password: \n '+ protocol +'://'+ req.headers.host + '/#!login/changepassword/' + user.secret;

					// Send an email
					postmark.send({
						'From': 'support@brycecanyonhalfmarathon.com',
						'To': user.email,
						'Subject': 'Password Change Request',
						'TextBody': body
			    });

					res.send(200);
				});
			}
		});
	});


	/**
	 * Change Password only when user is found by the passed-in secret.
	 */
	app.post('/api/changepassword', function(req, res){

		if (req.body.password !== req.body.confirmpassword) {
			return res.json({
				error: 'The passwords must match'
			});
		}

		var params = {
			query:{
				secret:req.body.secret
			}
		};

		var User = app.lookup('api/users');

		User.find(params, function(error, users){

			// If no user was found, the code was bad.
			if (!users[0]) {
				return res.json({
					error: 'That code has expired, please use the change password option again.'
				});

			// A user was found, so update the password.
			} else {
				var user = users[0].toObject();

				user.password = req.body.password;

				User.update(user.id, user, {}, function(err, user){
					console.log(user);
				});
			}
		});
	});


};