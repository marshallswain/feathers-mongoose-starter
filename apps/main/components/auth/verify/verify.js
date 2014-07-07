'use strict';

import Session from '../../../models/session';

can.Component.extend({
	tag: 'sc-verify',
	template: can.view('/apps/main/components/auth/verify/verify.mustache'),
	scope: {
		define:{
			secret:{
				set(value){
					can.route.attr('secret', value);
				}
			}
		},
		notVerified:false,
		verify: function(scope, el, ev){
			ev.preventDefault();

			if (!can.route.attr('secret')) {
				can.route.attr('secret', this.secret);
			}

			can.$.ajax({
				url: '/api/verify',
				type: 'POST',
				dataType:'json',
				data: {secret: can.route.attr('secret')},
			})
			.done((data) => {
				localStorage.setItem('featherstoken', data.token);

				can.route.removeAttr('secret');

				Session.findOne({}).then(
					// Successful token login
					(session) => {
						can.route.attr({
							session: session,
							ready : true
						});
					},
					// Failed token login.
					() => {
						can.route.attr('ready', true);
					});


				can.route.attr('page', 'home');
			})
			.fail((response) =>{
				console.log('error');
			});

		}
	}
});
