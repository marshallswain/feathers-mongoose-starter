'use strict';


export default can.Component.extend({
	tag: 'sc-jquery-ui',
	template: can.view('/apps/main/components/jquery-ui/jquery-ui.mustache'),
	scope: {},
	helpers: {
		accordion: function(){
			return function(el){
				$(el).one('inserted', function(){
					$(el ).accordion();
				});

			};
		}
	}
});
