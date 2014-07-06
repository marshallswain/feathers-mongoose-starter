'use strict';

import Session from '../../../models/session';

can.Component.extend({
	tag: 'sc-passwordchange',
	template: can.view('/apps/main/components/auth/passwordchange/passwordchange.mustache'),
	scope: {
		define:{
			secret:{
				set(value){
					can.route.attr('secret', value);
				},
				get(){
					return can.route.attr('secret');
				}
			}
		},
		invalidCode:false,
		notVerified:false,
		send: function(scope, el, ev){
			ev.preventDefault();

			can.$.ajax({
				url: '/api/passwordchange',
				type: 'POST',
				dataType:'json',
				data: {
					secret: scope.attr('secret'),
					password: scope.attr('password'),
					password2: scope.attr('password2')
				},
			})
			.done((response) => {

				if (response.status) {
					scope.attr('invalidCode', true);
					return;
				}

				localStorage.setItem('featherstoken', response.token);

				can.route.removeAttr('secret');

				Session.findOne({}).then(
					// Successful token login
					(session) => {
						can.route.attr({
							session: session,
							ready : true
						});
						can.route.attr('page', 'passwordchangesuccess');
					},
					// Failed token login.
					(error) => {
						console.error(error);
					});

			})
			.fail((response) =>{
				console.log('error');
			});

		},
		tryagain(scope, el, ev){
			ev.preventDefault();
			can.route.removeAttr('secret');
			can.route.attr('email', localStorage.getItem('email'));
			can.route.attr('page', 'passwordemail');
		}
	}
});
