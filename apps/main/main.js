'use strict';

import Session from './models/session';
import './components/login/login.js';
import './components/home/home.js';
import './components/jquery-ui/jquery-ui.js';
import './components/secrets/secrets.js';
import './components/todos/todos.js';

// Everything revolves around the appState.
import appState from './appState.js';

// Setup route.
can.route(':page',{page: 'home'});


// Register Mustache Helper
can.mustache.registerHelper('linkTo', (page) => can.mustache.safeString(can.route.link(page,{page: page}))  );

$(document.body).append( can.view('/apps/main/site.mustache', appState) );

var pages = {
	login: '<sc-login session="{session}"></sc-login>'
};

appState.bind('showPage', (ev, newVal) => {
	if(newVal) {
		var template =  pages[newVal] || '<sc-'+newVal+'></sc-'+newVal+'>';
		$('#main').html(  can.mustache( template )( appState ) );
	}
});

Session.findOne({}).then(
	// Successful token login
	(session) => {
		console.log(session);
		appState.attr({
			session: session,
			ready : true
		});
		can.route.ready();
	},
	// Failed token login.
	() => {
		console.log('2');
		appState.attr('ready', true);
		can.route.ready();
	});

