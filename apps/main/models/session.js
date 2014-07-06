'use strict';

export default can.Model.extend('Session', {

	// Check for a token and attempt to decode it.
	findOne: function(){
		var d = new can.Deferred();

		// Check for a token.
		var token = localStorage.getItem('featherstoken');

		// If there's a token...
		if(token) {

			// Get it decoded to get the user data.
			can.ajax({
			  url: '/api/tokenlogin',
			  type: 'POST',
			  dataType:'json',
			  data: {token:token}
			}).then(function(response){

				if (response.error) {
					d.reject({});
			  // ... resolve with the user.
				} else {
				  d.resolve(response);
				}
			});
		// If there's no token, reject.
		} else {
			d.reject({});
		}
		return d;
	},

	// Login with username and password.
	create: function(data){
		var d = new can.Deferred();
		if(data.email && data.password) {
			// Get it decoded to get the user data.
			can.ajax({
			  url: '/api/login',
			  type: 'POST',
			  dataType:'json',
			  data: {email:data.email, password:data.password}
			}).then(
				(response) => {

					if (response.message) {
						d.reject(response);
				  // ... resolve with the user.
					} else {
						localStorage.setItem('featherstoken', response.token);
					  d.resolve(response);
					}
				}, ()=>{
					console.log(arguments);
					d.reject(arguments);
				});

		} else {
			d.reject({error: 'incorrect username or password'});
		}
		return d;
	},
	destroy: function(data){
		var d = new can.Deferred();
		d.resolve();
		return d;

	}
},{});