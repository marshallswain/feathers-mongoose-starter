'use strict';

import Session from '../../models/session';

can.Component.extend({
	tag: 'sc-login',
	template: can.view('/apps/main/components/login/login.mustache'),
	scope: {
		login: function(scope, el, ev){
			this.attr('email', 'marshall@creativeideal.net');
			this.attr('password', 'swains');
			ev.preventDefault();
			this.attr('loggingIn', true);
			var self = this;
			new Session({
				email: this.attr('email'),
				password: this.attr('password')
			}).save(function(session){
				self.attr({
					session :session,
					loggingIn: false
				});
				can.route.attr('page', 'home');
			});
		}
	}
});
