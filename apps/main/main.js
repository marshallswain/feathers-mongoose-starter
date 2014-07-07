'use strict';

import './main.css';

import Session from './models/session';


import './components/auth/auth.js';

import './components/home/home.js';
import './components/secrets/secrets.js';
import './components/todos/todos.js';
import './components/tickets/tickets.js';

// Everything revolves around the appState.
import appState from './appState.js';

// Routes
can.route('passwordemail/:email',{page: 'passwordemail'});
can.route('passwordchange/:secret',{page: 'passwordchange'});
can.route('verify/:secret',{page: 'verify'});
can.route(':page',{page: 'home'});


// Register Mustache Helper
can.mustache.registerHelper('linkTo', (page) => can.mustache.safeString(can.route.link(page,{page: page})) );
can.mustache.registerHelper('hrefTo', (page) => can.mustache.safeString(can.route.url({page: page})) );

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
		appState.attr({
			session: session,
			ready : true
		});
		can.route.ready();
	},
	// Failed token login.
	() => {
		appState.attr('ready', true);
		can.route.ready();
	});

