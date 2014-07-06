// We need a token to fully hook up the websocket, so we use a PublicUser
import {PublicUser} from '../../../models.js';
import Session from '../../../models/session';
import './signup.css';

can.Component.extend({
	tag: 'sc-signup',
	template: can.view('/apps/main/components/auth/signup/signup.mustache'),
	scope: {
		user:{},
		emailMismatch: false,
		passwordMismatch: false,
		emailTaken: false,
		signup: function(scope, el, ev){
			ev.preventDefault();
			var self = this;

			this.attr('user.email', 'support@brycecanyonhalfmarathon.com');
			this.attr('user.email2', 'support@brycecanyonhalfmarathon.com');
			this.attr('user.password', 'swains');
			this.attr('user.password2', 'swains');

			if (this.attr('user.email') != this.attr('user.email2')) {
				this.attr('emailMismatch', true);
			} else {
				this.attr('emailMismatch', false);
			}

			if (this.attr('user.password') != this.attr('user.password2')) {
				this.attr('passwordMismatch', true);
			} else {
				this.attr('passwordMismatch', false);
			}

			if (!this.emailMismatch && !this.passwordMismatch) {
				new PublicUser(this.user.attr()).save(
					(user) => {
						can.route.attr('page', 'verify');
					},
					(error, err, status) => {
						switch(status){
							case 'Conflict':
								winston.log('invalid login', self.attr('email') + ' tried to repeat signup.');
								self.attr('emailTaken', true);
								break;
						}
					});
			}

		}
	}
});
