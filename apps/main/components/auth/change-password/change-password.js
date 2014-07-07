'use strict';

import {User} from '../../../models.js';

module.exports = can.Component.extend({
	tag: 'change-password',
	template: can.view('/apps/main/components/auth/change-password/change-password.mustache'),
	scope: {
		minLength: 6,
		passwordTooShort: false,
		success:false,
		passwordMismatch:false,
		// Change a message attr for three seconds.
		setMessageAttr(attrString){
			var scope = this;
			scope.attr(attrString, true);
			window.setTimeout(()=>{scope.attr(attrString, false);}, 3000);
		},
		changePassword(scope, el, ev){
			ev.preventDefault();

			if (scope.attr('password').length < scope.attr('minLength')) {
				scope.setMessageAttr('passwordTooShort');
				return;
			}

			// If passwords match, save the user.
			if (scope.attr('password') == scope.attr('password2')) {
				// Set up password data.
				var data = {
					id: can.route.attr('session._id'),
					password: scope.attr('password'),
					updatePassword: true
				};
				// Save the new password.
				new User(data).save(
					() => {
						scope.attr('password', '');
						scope.attr('password2', '');
						scope.setMessageAttr('success');
					});

			// Passwords didn't match.  Alert user.
			} else {
				// Alert the user that the passwords must match.
				scope.setMessageAttr('passwordMismatch');
			}
		}
	}
});