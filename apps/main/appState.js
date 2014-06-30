'use strict';

import  {Todo} from './models.js';
import  {Secret} from './models.js';


// Defines the state of the application
var AppState = can.Map.extend({
	define : {
		todos: {
			serialize: false
		},
		secrets: {
			serialize: false
		},
		session : {
			serialize: false,
			set() {
				// When there is a session, start routing.
				can.route.map(appState);
				can.Feathers.connect('', {query: 'token=' + localStorage.getItem('featherstoken'), transports: ['websocket', 'xhr-polling'] });

				// Fetch the user's data
				this.attr('todos', new Todo.List({}));
				this.attr('secrets', new Secret.List({}));

			},
			remove() {
				// When the session is removed, stop routing.
				can.route.attr('page', 'home');

				// Remove data.
				this.removeAttr('todos');
				this.removeAttr('secrets');

				// can.route._teardown();
				localStorage.removeItem('featherstoken');

				location.reload();
			}
		},
		isLoggedIn: {
			get() { return !!this.attr('session'); }
		},
		// Set to true once we know if a session has been established or not.
		ready: {
			serialize: false
		},
		showPage: {
			get() {
				if( this.attr('session') ) {
					return this.attr('page');
				} else if(this.attr('ready')){
					// Allow the home page or login page without a session.
					if (can.route.attr('page') == 'home') {
						return 'home';
					} else {
						return 'login';
					}
				}
			}
		}
	},
	logout() {
		var self = this;
		this.attr('session').destroy( function(test) {self.removeAttr('session'); });
	}
});

var appState = new AppState();
export default appState;
window.appState = appState;

Todo.bind('created', function(ev, todo){
	if (appState.attr('isLoggedIn')) {
		appState.attr('todos').push(todo);
	}
});

