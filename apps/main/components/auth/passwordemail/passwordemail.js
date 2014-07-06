'use strict';

can.Component.extend({
	tag: 'sc-passwordemail',
	template: can.view('/apps/main/components/auth/passwordemail/passwordemail.mustache'),
	scope: {
		nonexistent:false,
		send: function(scope, el, ev){
			ev.preventDefault();

			if (!can.route.attr('email')) {
				can.route.attr('email', this.email);
			}

			can.$.ajax({
				url: '/api/passwordemail',
				type: 'POST',
				dataType:'json',
				data: {email: can.route.attr('email')},
			})
			.done((data) => {
				localStorage.setItem('email', can.route.attr('email'));
				can.route.removeAttr('email');
				can.route.attr('page', 'passwordchange');
			})
			.fail((response) =>{
				console.log('error');
			});

		}
	}
});
