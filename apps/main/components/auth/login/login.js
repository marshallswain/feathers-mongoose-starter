'use strict';

import Session from '../../../models/session';
import appState from '../../../appState.js';
import {User} from '../../../models.js';

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

			ev.preventDefault();
			this.attr('loggingIn', true);
			var self = this;
			new Session({
				email: this.attr('email'),
				password: this.attr('password')
			}).save(
				(session) => {
					appState.attr({
						session : new User(session.attr()),
						loggingIn: false
					});
					can.route.attr('page', 'register');
				}, (error) => {
					console.log(error);
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
