'use strict';

import Session from '../../../models/session';

can.Component.extend({
	tag: 'sc-login',
	template: can.view('/apps/main/components/auth/login/login.mustache'),
	scope: {
		notVerified: false,
		invalidLogin: false,
		login(scope, el, ev){
			// Reset messages.
			this.attr('invalidLogin', false);
			this.attr('notVerified', false);

			this.attr('email', 'support@brycecanyonhalfmarathon.com');
			this.attr('password', 'swains');
			ev.preventDefault();
			this.attr('loggingIn', true);
			var self = this;
			new Session({
				email: this.attr('email'),
				password: this.attr('password')
			}).save(
				(session) => {
					can.route.attr({
						session :session,
						loggingIn: false
					});
					can.route.attr('page', 'home');
				}, (error) => {
					switch(error.status){
						case 'not verified':
							winston.log('invalid login', self.attr('email') + ' tried to login without verifying the account first.');
							can.route.attr('page', 'verify');
							break;
						case 'invalid login':
							winston.log('invalid login', self.attr('email') + ' is having trouble logging in.');
							this.attr('invalidLogin', true);
							break;
					}
				});
		},
		resetPassword(scope, el, ev){
			can.route.attr('email', this.attr('email'));
			can.route.attr('page', 'passwordemail');
		}
	}
});
