'use strict';

// import 'bootstrap';
// import 'bootstrap.css!';

return can.Component.extend({
	tag: 'sc-bootstrap',
	template: can.view('/apps/main/components/bootstrap/bootstrap.mustache'),
	scope: {},
	helpers: {
		carousel: function(){
			return function(el){
				$(el).one('inserted', function(){
					$(el ).carousel();
				});

			};
		}
	}
});