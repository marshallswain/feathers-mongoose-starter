'use strict';

/**
 * Contains all of the functions necessary to deal with Authentication.
 *
 * 1. decodeToken: decodes a token into user data using.
 * 2. getToken middleware that sets up req.user if a token is passed in REST.
 * 3. Login
 */

var bcrypt = require('bcrypt'),
	jwt = require('jwt-simple'),
	randomString = require('random-string'),
	mongoose = require('mongoose'),
	winston = require('winston'),
	postmark = require('postmark')('postmark-key-here');

/**
 * The secret that will be used to encode / decode tokens.
 */
var tokenSecret = 'igottasecret';


/**
 * Simply decodes a token into user data using.
 */
exports.decodeToken = function(token, cb){
	try{
	  var data = jwt.decode(token, tokenSecret);
	  cb(null, data);
	}
	catch(e){
		winston.log('auth.js line ~33 decodeToken error: ~~~~~~~' + e);
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
		next(null, req, res);
	}
};

/**
 * Middleware to set up req.headers on req.feathers.headers.
 * Can then be used in hooks
 */
var setHeaders = function(req, res, next){
	req.feathers.headers = req.headers;
	next(null, req, res);
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
		admin: isAdmin,
		date: new Date().getTime()
  };

  // Prepare the user.
  delete user.password;

  user.token = jwt.encode(tokenUser, tokenSecret);

  return user;
};


/**
 * Set up the custom REST routes.
 */
exports.setup = function(app, feathers){

	// All REST routes will set up req.feathers.user if a token is passed.
	app.all('*', setHeaders);
	app.post('*', getToken);


	/**
	 * POST login.
	 */
	app.post('/api/login', function(req, res){

		var User = mongoose.models.User;

		User.find({email:req.body.email.toLowerCase()}, '', {}, function(err, users){
			// Mongoose Errors
			if (err) {
				winston.log(err);
				res.json('401', err);

			// User found
			} else if(users[0]){

				// Use the first, and only, matching user.
				var user = users[0];

				// If user isn't verified, send message.
				if (user.verified === false) {

					var secret;

					// If a secret isn't set and the account isn't verified, set up a new secret and send it out.
					// otherwise the original secret will remain and be sent in the verification email.
					if (!user.secret) {
						secret = user.secret = randomString();

						// Update the user in the db with the newly-set secret.
						user.save(function(err, user){});
					} else {
						secret = user.secret;
					}

					// Resend verification email.
					var protocol = 'http';
					if (req.headers['x-forwarded-proto'] == 'https') {
						protocol = 'https';
					}
					var url = protocol +'://'+req.headers.host+'/#!verify';

			    var body = 'Click here to verify your email address: \n '+ url + '/' + secret +
			    '\n\n or go to this page: '+ url +
			    '\n\n and enter this code: ' + secret;

					// Send an email
					postmark.send({
						'From': 'xxx',
						'To': user.email,
						'Subject': 'Verify Your Email Address',
						'TextBody': body
			    }, function(error, success) {
		        if(error) {
							winston.log('Unable to send via postmark: ' + error.message);
		        }
			    });

					res.json({
						status:'not verified',
						message:'That account has not been verified. Please check your email to verify your address.'
					});



				// Account already verified
				} else {
					// Compare the password.
					bcrypt.compare(req.body.password, user.password, function(err, isMatch) {

						// Error checking the password.
						if (err){
							return res.json(err);

						// No check-password errors
						} else {
							// Passwords matched, so send a token.
							if (isMatch) {
			          var token = exports.generateToken(user);
					      return res.json(token);

					    // Passwords didn't match.
							} else {
								return res.json({
									status:'invalid login',
									message: 'Invalid Login'
								});
							}
						}
					});
				}

			// User not found.
			} else {
				return res.json({
					status:'invalid login',
					message: 'Invalid Login'
				});
			}
		});


	});

	/**
	 * Verify a user's account by passing a secret.
	 */
	app.post('/api/verify', function(req, res){
		var User = mongoose.models.User;

		User.find({secret:req.body.secret}, '', {}, function(err, users){
			// Mongoose Errors
			if (err) {
				winston.log(err);
				res.json('401', err);

			// User found
			} else if (users[0]) {
				var user = users[0];
				user.secret = undefined;
				user.verified = true;
				// Update the user and send back the credentials.
				user.save(function(err, user){
					if (err) {
						winston.log(err);
						res.json(err);
					} else{
	          // ...and send the token to the user.
            var token = exports.generateToken(user);
  		      return res.json(token);
					}
				});
			// Couldn't find a user with that secret.
			} else {
				res.json({
					status:'invalid secret',
					message: 'We couldn\'t find a user with that secret.'
				});
			}
		});
	});



	/**
	 * POST token.
	 */
	app.post('/api/tokenlogin', function(req, res){
		// If there's no token, send error.
		if (!req.body.token) {
			res.json({
				status: 'no token',
				message:'token is required for token login.'
			});

		// If there's a token, decode it.
		} else {
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

	app.post('/api/passwordemail', function(req, res){

		if (!req.body.email) {
			return res.json({
				status: 'email required',
				message: 'Please pass an email address to send a password reset request.'
			});
		} else {

			var User = mongoose.models.User;

			User.find({email:req.body.email.toLowerCase()}, '', {}, function(err, users){
				// Mongoose Errors
				if (err) {
					winston.log(err);
					return res.json('401', err);

				// A user was found, create a secret and send a password change request.
				} else if (users[0]) {
					var user = users[0];

					var secret;

					if (!user.secret) {
						secret = user.secret = randomString();
					} else {
						secret = user.secret;
					}
					// Update the user and send back the credentials.
					user.save(function(err, user){

						// Resend verification email.
						var protocol = 'http';
						if (req.headers['x-forwarded-proto'] == 'https') {
							protocol = 'https';
						}
						var url = protocol +'://'+req.headers.host+'/#!passwordchange';

						var body = 'Click here to change your password: \n '+ url + '/' + secret +
						'\n\n or go to this page: '+ url +
						'\n\n and enter this code: ' + secret;

						// Send an email
						postmark.send({
							'From': 'xxx',
							'To': user.email,
							'Subject': 'Password Change Request',
							'TextBody': body
				    });

						return res.json('success');
					});

				// No user was found.
				} else {
					return res.json({
						status: 'User Not Found',
						message: 'Could not find a user with that email address.'
					});

				}
			});
		}


	});


	/**
	 * Pass in a secret and password to change a user's password.
	 */
	app.post('/api/passwordchange', function(req, res){

		if (!req.body.secret) {
			return res.json({
				status: 'missing secret',
				message: 'Please include the secret to look up the correct user.'
			});
		}

		if (!req.body.password || !req.body.password2) {
			return res.json({
				status: 'missing password',
				message: 'Please include the password and matching password2 to change the password.'
			});
		}

		if (req.body.password !== req.body.password2) {
			return res.json({
				status: 'password mismatch',
				message: 'The passwords must match'
			});
		}

		var User = mongoose.models.User;

		User.findOne({secret:req.body.secret}, '', {}, function(err, user){
			// Mongoose Errors
			if (err) {
				winston.log(err);
				return res.json('401', err);
			// A user was found, save the password.
			} else if (user) {

				user.password = req.body.password;
				user.secret = undefined;

				user.save(function(err, data){
					// ...and send the token to the user.
          var token = exports.generateToken(user);
		      return res.json(token);
				});

			// Couldn't find the user using the passed code
			} else {
				res.json({
					status: 'invalid code',
					message: 'We could not find a user using that code.'
				});
			}
		});
	});



};