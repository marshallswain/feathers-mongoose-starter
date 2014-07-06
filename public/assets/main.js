/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	__webpack_require__(8);
	var Session = __webpack_require__(2)["default"];
	
	
	__webpack_require__(3);
	__webpack_require__(4);__webpack_require__(5);__webpack_require__(6);__webpack_require__(7);
	// Everything revolves around the appState.
	var appState = __webpack_require__(1)["default"];
	
	// Routes
	can.route('passwordemail/:email',{page: 'passwordemail'});
	can.route('passwordchange/:secret',{page: 'passwordchange'});
	can.route('verify/:secret',{page: 'verify'});
	can.route(':page',{page: 'home'});
	
	
	// Register Mustache Helper
	can.mustache.registerHelper('linkTo', function(page)  {return can.mustache.safeString(can.route.link(page,{page: page}))} );
	can.mustache.registerHelper('hrefTo', function(page)  {return can.mustache.safeString(can.route.url({page: page}))} );
	
	$(document.body).append( can.view('/apps/main/site.mustache', appState) );
	
	var pages = {
		login: '<sc-login session="{session}"></sc-login>'
	};
	
	appState.bind('showPage', function(ev, newVal)  {
		if(newVal) {
			var template =  pages[newVal] || '<sc-'+newVal+'></sc-'+newVal+'>';
			$('#main').html(  can.mustache( template )( appState ) );
		}
	});
	
	Session.findOne({}).then(
		// Successful token login
		function(session)  {
			appState.attr({
				session: session,
				ready : true
			});
			can.route.ready();
		},
		// Failed token login.
		function()  {
			appState.attr('ready', true);
			can.route.ready();
		});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	var Todo = __webpack_require__(11).Todo;
	var Secret = __webpack_require__(11).Secret;
	
	
	// Defines the state of the application
	var AppState = can.Map.extend({
		define : {
			todos: {serialize: false },
			secrets: {serialize: false },
			tickets: {serialize: false },
			session : {
				serialize: false,
				set: function() {
					// When there is a session, start the websockets.
					can.Feathers.connect('', {query: 'token=' + localStorage.getItem('featherstoken'), transports: ['websocket', 'xhr-polling'] });
	
					// Fetch the user's data
					this.attr('todos', new Todo.List({}));
					this.attr('secrets', new Secret.List({}));
	
	
				},
				remove: function() {
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
				get: function() { return !!this.attr('session'); }
			},
			// Set to true once we know if a session has been established or not.
			ready: {
				serialize: false
			},
			showPage: {
				get: function() {
					if( this.attr('session') ) {
						return this.attr('page');
					} else if(this.attr('ready')){
						// Only certain pages allowed when not logged in.
						var allowed = [
							'home',
							'signup',
							'verify',
							'passwordemail',
							'passwordchange'
						];
						if (can.inArray(can.route.attr('page'), allowed) >= 0) {
							return can.route.attr('page');
						} else {
							return 'login';
						}
					}
				}
			}
		},
		logout: function() {
			var self = this;
			this.attr('session').destroy( function(test) {self.removeAttr('session'); });
		}
	});
	
	var appState = new AppState();
	exports["default"] = appState;
	window.appState = appState;
	
	Todo.bind('created', function(ev, todo){
		if (appState.attr('isLoggedIn')) {
			appState.attr('todos').push(todo);
		}
	});
	
	can.route.map(appState);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	exports["default"] = can.Model.extend('Session', {
	
		// Check for a token and attempt to decode it.
		findOne: function(){
			var d = new can.Deferred();
	
			// Check for a token.
			var token = localStorage.getItem('featherstoken');
	
			// If there's a token...
			if(token) {
	
				// Get it decoded to get the user data.
				can.ajax({
				  url: '/api/tokenlogin',
				  type: 'POST',
				  dataType:'json',
				  data: {token:token}
				}).then(function(response){
	
					if (response.error) {
						d.reject({});
				  // ... resolve with the user.
					} else {
					  d.resolve(response);
					}
				});
			// If there's no token, reject.
			} else {
				d.reject({});
			}
			return d;
		},
	
		// Login with username and password.
		create: function(data){
			var d = new can.Deferred();
			if(data.email && data.password) {
				// Get it decoded to get the user data.
				can.ajax({
				  url: '/api/login',
				  type: 'POST',
				  dataType:'json',
				  data: {email:data.email, password:data.password}
				}).then(
					function(response)  {
	
						if (response.message) {
							d.reject(response);
					  // ... resolve with the user.
						} else {
							localStorage.setItem('featherstoken', response.token);
						  d.resolve(response);
						}
					}, function(){
						console.log(arguments);
						d.reject(arguments);
					});
	
			} else {
				d.reject({error: 'incorrect username or password'});
			}
			return d;
		},
		destroy: function(data){
			var d = new can.Deferred();
			d.resolve();
			return d;
	
		}
	},{});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(12);__webpack_require__(13);__webpack_require__(14);__webpack_require__(15);__webpack_require__(16);__webpack_require__(17);__webpack_require__(18);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	module.exports = can.Component.extend({
		tag: 'sc-home',
		template: can.view('/apps/main/components/home/home.mustache'),
		scope: {}
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	module.exports = can.Component.extend({
		tag: 'sc-secrets',
		template: can.view('/apps/main/components/secrets/secrets.mustache'),
		scope: {}
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	module.exports = can.Component.extend({
		tag: 'sc-todos',
		template: can.view('/apps/main/components/todos/todos.mustache'),
		scope: {}
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	var Ticket = __webpack_require__(11).Ticket;
	
	module.exports = can.Component.extend({
		tag: 'sc-support',
		template: can.view('/apps/main/components/tickets/tickets.mustache'),
		scope: {},
		events: {
			init: function(el, ev){
				can.route.attr('tickets', new Ticket.List({}));
			}
		}
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(10)
		// The css code:
		(__webpack_require__(9))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		"input.form-control.top{\n\tborder-bottom-left-radius: 0;\n\tborder-bottom-right-radius: 0;\n\tborder-bottom:0;\n}\ninput.form-control.bottom{\n\tborder-top-left-radius: 0;\n\tborder-top-right-radius: 0;\n}\n\n.well h1:first-child, .well h2:first-child, .well h3:first-child, .well h4:first-child{\n\tmargin-top:0 !important;\n}";

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function addStyle(cssCode) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(styleElement);
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = cssCode;
		} else {
			styleElement.appendChild(document.createTextNode(cssCode));
		}
		return function() {
			head.removeChild(styleElement);
		};
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	var Todo = can.Feathers.Model.extend('Todo', {
		resource: 'api/todos'
	}, {});
	exports.Todo = Todo;
	var Secret = can.Feathers.Model.extend('Secret', {
		resource: 'api/secrets'
	}, {});
	exports.Secret = Secret;
	var Ticket = can.Feathers.Model.extend('Ticket', {
		resource: 'api/tickets'
	}, {});
	exports.Ticket = Ticket;
	var User = can.Feathers.Model.extend('User', {
		resource: 'api/users'
	}, {});
	exports.User = User;
	var PublicUser = can.Model.extend('PublicUser', {
		resource: 'api/users'
	}, {});
	exports.PublicUser = PublicUser;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	var Session = __webpack_require__(2)["default"];
	
	can.Component.extend({
		tag: 'sc-login',
		template: can.view('/apps/main/components/auth/login/login.mustache'),
		scope: {
			notVerified: false,
			invalidLogin: false,
			login: function(scope, el, ev){var this$0 = this;
				// Reset messages.
				this.attr('invalidLogin', false);
				this.attr('notVerified', false);
	
				this.attr('email', 'support@brycecanyonhalfmarathon.com');
				this.attr('password', 'swains');
				ev.preventDefault();
				this.attr('loggingIn', true);
				var self = this;
				new Session({
					email: this.attr('email'),
					password: this.attr('password')
				}).save(
					function(session)  {
						can.route.attr({
							session :session,
							loggingIn: false
						});
						can.route.attr('page', 'home');
					}, function(error)  {
						switch(error.status){
							case 'not verified':
								winston.log('invalid login', self.attr('email') + ' tried to login without verifying the account first.');
								can.route.attr('page', 'verify');
								break;
							case 'invalid login':
								winston.log('invalid login', self.attr('email') + ' is having trouble logging in.');
								this$0.attr('invalidLogin', true);
								break;
						}
					});
			},
			resetPassword: function(scope, el, ev){
				can.route.attr('email', this.attr('email'));
				can.route.attr('page', 'passwordemail');
			}
		}
	});

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// We need a token to fully hook up the websocket, so we use a PublicUser
	var PublicUser = __webpack_require__(11).PublicUser;
	var Session = __webpack_require__(2)["default"];
	__webpack_require__(19);
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
						function(user)  {
							can.route.attr('page', 'verify');
						},
						function(error, err, status)  {
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

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	var Session = __webpack_require__(2)["default"];
	
	can.Component.extend({
		tag: 'sc-verify',
		template: can.view('/apps/main/components/auth/verify/verify.mustache'),
		scope: {
			define:{
				secret:{
					set: function(value){
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
				.done(function(data)  {
					localStorage.setItem('featherstoken', data.token);
	
					can.route.removeAttr('secret');
	
					Session.findOne({}).then(
						// Successful token login
						function(session)  {
							can.route.attr({
								session: session,
								ready : true
							});
						},
						// Failed token login.
						function()  {
							can.route.attr('ready', true);
						});
	
	
					can.route.attr('page', 'home');
				})
				.fail(function(response) {
					console.log('error');
				});
	
			}
		}
	});

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	can.Component.extend({
		tag: 'sc-passwordchangesuccess',
		template: can.view('/apps/main/components/auth/passwordchangesuccess/passwordchangesuccess.mustache'),
	});

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	var Session = __webpack_require__(2)["default"];
	
	can.Component.extend({
		tag: 'sc-passwordchange',
		template: can.view('/apps/main/components/auth/passwordchange/passwordchange.mustache'),
		scope: {
			define:{
				secret:{
					set: function(value){
						can.route.attr('secret', value);
					},
					get: function(){
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
				.done(function(response)  {
	
					if (response.status) {
						scope.attr('invalidCode', true);
						return;
					}
	
					localStorage.setItem('featherstoken', response.token);
	
					can.route.removeAttr('secret');
	
					Session.findOne({}).then(
						// Successful token login
						function(session)  {
							can.route.attr({
								session: session,
								ready : true
							});
							can.route.attr('page', 'passwordchangesuccess');
						},
						// Failed token login.
						function(error)  {
							console.error(error);
						});
	
				})
				.fail(function(response) {
					console.log('error');
				});
	
			},
			tryagain: function(scope, el, ev){
				ev.preventDefault();
				can.route.removeAttr('secret');
				can.route.attr('email', localStorage.getItem('email'));
				can.route.attr('page', 'passwordemail');
			}
		}
	});

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
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
				.done(function(data)  {
					localStorage.setItem('email', can.route.attr('email'));
					can.route.removeAttr('email');
					can.route.attr('page', 'passwordchange');
				})
				.fail(function(response) {
					console.log('error');
				});
	
			}
		}
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	__webpack_require__(21);
	module.exports = can.Component.extend({
		tag: 'sc-my-account',
		template: can.view('/apps/main/components/auth/my-account/my-account.mustache'),
		scope: {}
	});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	var dispose = __webpack_require__(10)
		// The css code:
		(__webpack_require__(20))
	if(false) {
		module.hot.accept();
		module.hot.dispose(dispose);
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports =
		".signup-messages p{\n\tpadding: 4px 8px;\n}";

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	var User = __webpack_require__(11).User;
	
	module.exports = can.Component.extend({
		tag: 'change-password',
		template: can.view('/apps/main/components/auth/change-password/change-password.mustache'),
		scope: {
			minLength: 6,
			passwordTooShort: false,
			success:false,
			passwordMismatch:false,
			// Change a message attr for three seconds.
			setMessageAttr: function(attrString){
				var scope = this;
				scope.attr(attrString, true);
				window.setTimeout(function(){scope.attr(attrString, false);}, 3000);
			},
			changePassword: function(scope, el, ev){
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
						function()  {
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

/***/ }
/******/ ])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2svYm9vdHN0cmFwIDFmMGYwZjYxZTZmNGIzZGZlMzIyIiwiLi9hcHBzL21haW4vbWFpbi5qcyIsIi4vYXBwcy9tYWluL2FwcFN0YXRlLmpzIiwiLi9hcHBzL21haW4vbW9kZWxzL3Nlc3Npb24uanMiLCIuL2FwcHMvbWFpbi9jb21wb25lbnRzL2F1dGgvYXV0aC5qcyIsIi4vYXBwcy9tYWluL2NvbXBvbmVudHMvaG9tZS9ob21lLmpzIiwiLi9hcHBzL21haW4vY29tcG9uZW50cy9zZWNyZXRzL3NlY3JldHMuanMiLCIuL2FwcHMvbWFpbi9jb21wb25lbnRzL3RvZG9zL3RvZG9zLmpzIiwiLi9hcHBzL21haW4vY29tcG9uZW50cy90aWNrZXRzL3RpY2tldHMuanMiLCIuL2FwcHMvbWFpbi9tYWluLmNzcyIsIi4vYXBwcy9tYWluL21haW4uY3NzKiIsIi4vfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGUuanMiLCIuL2FwcHMvbWFpbi9tb2RlbHMuanMiLCIuL2FwcHMvbWFpbi9jb21wb25lbnRzL2F1dGgvbG9naW4vbG9naW4uanMiLCIuL2FwcHMvbWFpbi9jb21wb25lbnRzL2F1dGgvc2lnbnVwL3NpZ251cC5qcyIsIi4vYXBwcy9tYWluL2NvbXBvbmVudHMvYXV0aC92ZXJpZnkvdmVyaWZ5LmpzIiwiLi9hcHBzL21haW4vY29tcG9uZW50cy9hdXRoL3Bhc3N3b3JkY2hhbmdlc3VjY2Vzcy9wYXNzd29yZGNoYW5nZXN1Y2Nlc3MuanMiLCIuL2FwcHMvbWFpbi9jb21wb25lbnRzL2F1dGgvcGFzc3dvcmRjaGFuZ2UvcGFzc3dvcmRjaGFuZ2UuanMiLCIuL2FwcHMvbWFpbi9jb21wb25lbnRzL2F1dGgvcGFzc3dvcmRlbWFpbC9wYXNzd29yZGVtYWlsLmpzIiwiLi9hcHBzL21haW4vY29tcG9uZW50cy9hdXRoL215LWFjY291bnQvbXktYWNjb3VudC5qcyIsIi4vYXBwcy9tYWluL2NvbXBvbmVudHMvYXV0aC9zaWdudXAvc2lnbnVwLmNzcyIsIi4vYXBwcy9tYWluL2NvbXBvbmVudHMvYXV0aC9zaWdudXAvc2lnbnVwLmNzcyoiLCIuL2FwcHMvbWFpbi9jb21wb25lbnRzL2F1dGgvY2hhbmdlLXBhc3N3b3JkL2NoYW5nZS1wYXNzd29yZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx3Qzs7Ozs7OztBQ3RDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0Esd0JBQXFDLHVCQUEyQyx1QkFBdUM7QUFDdkg7QUFDQTs7QUFFQTtBQUNBLG1DQUFrQyxzQkFBc0I7QUFDeEQscUNBQW9DLHVCQUF1QjtBQUMzRCw2QkFBNEIsZUFBZTtBQUMzQyxvQkFBbUIsYUFBYTs7O0FBR2hDO0FBQ0Esd0RBQXVELG9EQUFvRCxXQUFXLEdBQUc7QUFDekgsd0RBQXVELDhDQUE4QyxXQUFXLEdBQUc7O0FBRW5IOztBQUVBO0FBQ0EsOEJBQTZCLFFBQVE7QUFDckM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7O0FBRUQsbUJBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFFLEU7Ozs7OztBQ2pERjtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLFdBQVUsa0JBQWtCO0FBQzVCLGFBQVksa0JBQWtCO0FBQzlCLGFBQVksa0JBQWtCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQThCLG1HQUFtRzs7QUFFakk7QUFDQSx3Q0FBdUM7QUFDdkMsNENBQTJDOzs7QUFHM0MsS0FBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDLEU7Ozs7OztBQ3hFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsK0JBQStCO0FBQzFDLEtBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUk7QUFDSjtBQUNBO0FBQ0EsS0FBSTs7QUFFSjtBQUNBO0FBQ0EsRUFBQyxFOzs7Ozs7QUNoQ0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQyxFOzs7Ozs7QUNSRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7Ozs7OztBQ1BBO0FBQUEsZ0Q7Ozs7OztBQ0FBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWdDLCtCQUErQjtBQUMvRCxJQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTTs7QUFFTjtBQUNBLEtBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQyxFIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2Fzc2V0cy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxucmVxdWlyZShcIi4vbWFpbi5jc3NcIik7XG52YXIgU2Vzc2lvbiA9IHJlcXVpcmUoXCIuL21vZGVscy9zZXNzaW9uXCIpW1wiZGVmYXVsdFwiXTtcblxuXG5yZXF1aXJlKFwiLi9jb21wb25lbnRzL2F1dGgvYXV0aC5qc1wiKTtcbnJlcXVpcmUoXCIuL2NvbXBvbmVudHMvaG9tZS9ob21lLmpzXCIpO3JlcXVpcmUoXCIuL2NvbXBvbmVudHMvc2VjcmV0cy9zZWNyZXRzLmpzXCIpO3JlcXVpcmUoXCIuL2NvbXBvbmVudHMvdG9kb3MvdG9kb3MuanNcIik7cmVxdWlyZShcIi4vY29tcG9uZW50cy90aWNrZXRzL3RpY2tldHMuanNcIik7XG4vLyBFdmVyeXRoaW5nIHJldm9sdmVzIGFyb3VuZCB0aGUgYXBwU3RhdGUuXG52YXIgYXBwU3RhdGUgPSByZXF1aXJlKFwiLi9hcHBTdGF0ZS5qc1wiKVtcImRlZmF1bHRcIl07XG5cbi8vIFJvdXRlc1xuY2FuLnJvdXRlKCdwYXNzd29yZGVtYWlsLzplbWFpbCcse3BhZ2U6ICdwYXNzd29yZGVtYWlsJ30pO1xuY2FuLnJvdXRlKCdwYXNzd29yZGNoYW5nZS86c2VjcmV0Jyx7cGFnZTogJ3Bhc3N3b3JkY2hhbmdlJ30pO1xuY2FuLnJvdXRlKCd2ZXJpZnkvOnNlY3JldCcse3BhZ2U6ICd2ZXJpZnknfSk7XG5jYW4ucm91dGUoJzpwYWdlJyx7cGFnZTogJ2hvbWUnfSk7XG5cblxuLy8gUmVnaXN0ZXIgTXVzdGFjaGUgSGVscGVyXG5jYW4ubXVzdGFjaGUucmVnaXN0ZXJIZWxwZXIoJ2xpbmtUbycsIGZ1bmN0aW9uKHBhZ2UpICB7cmV0dXJuIGNhbi5tdXN0YWNoZS5zYWZlU3RyaW5nKGNhbi5yb3V0ZS5saW5rKHBhZ2Use3BhZ2U6IHBhZ2V9KSl9ICk7XG5jYW4ubXVzdGFjaGUucmVnaXN0ZXJIZWxwZXIoJ2hyZWZUbycsIGZ1bmN0aW9uKHBhZ2UpICB7cmV0dXJuIGNhbi5tdXN0YWNoZS5zYWZlU3RyaW5nKGNhbi5yb3V0ZS51cmwoe3BhZ2U6IHBhZ2V9KSl9ICk7XG5cbiQoZG9jdW1lbnQuYm9keSkuYXBwZW5kKCBjYW4udmlldygnL2FwcHMvbWFpbi9zaXRlLm11c3RhY2hlJywgYXBwU3RhdGUpICk7XG5cbnZhciBwYWdlcyA9IHtcblx0bG9naW46ICc8c2MtbG9naW4gc2Vzc2lvbj1cIntzZXNzaW9ufVwiPjwvc2MtbG9naW4+J1xufTtcblxuYXBwU3RhdGUuYmluZCgnc2hvd1BhZ2UnLCBmdW5jdGlvbihldiwgbmV3VmFsKSAge1xuXHRpZihuZXdWYWwpIHtcblx0XHR2YXIgdGVtcGxhdGUgPSAgcGFnZXNbbmV3VmFsXSB8fCAnPHNjLScrbmV3VmFsKyc+PC9zYy0nK25ld1ZhbCsnPic7XG5cdFx0JCgnI21haW4nKS5odG1sKCAgY2FuLm11c3RhY2hlKCB0ZW1wbGF0ZSApKCBhcHBTdGF0ZSApICk7XG5cdH1cbn0pO1xuXG5TZXNzaW9uLmZpbmRPbmUoe30pLnRoZW4oXG5cdC8vIFN1Y2Nlc3NmdWwgdG9rZW4gbG9naW5cblx0ZnVuY3Rpb24oc2Vzc2lvbikgIHtcblx0XHRhcHBTdGF0ZS5hdHRyKHtcblx0XHRcdHNlc3Npb246IHNlc3Npb24sXG5cdFx0XHRyZWFkeSA6IHRydWVcblx0XHR9KTtcblx0XHRjYW4ucm91dGUucmVhZHkoKTtcblx0fSxcblx0Ly8gRmFpbGVkIHRva2VuIGxvZ2luLlxuXHRmdW5jdGlvbigpICB7XG5cdFx0YXBwU3RhdGUuYXR0cigncmVhZHknLCB0cnVlKTtcblx0XHRjYW4ucm91dGUucmVhZHkoKTtcblx0fSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBUb2RvID0gcmVxdWlyZShcIi4vbW9kZWxzLmpzXCIpLlRvZG87XG52YXIgU2VjcmV0ID0gcmVxdWlyZShcIi4vbW9kZWxzLmpzXCIpLlNlY3JldDtcblxuXG4vLyBEZWZpbmVzIHRoZSBzdGF0ZSBvZiB0aGUgYXBwbGljYXRpb25cbnZhciBBcHBTdGF0ZSA9IGNhbi5NYXAuZXh0ZW5kKHtcblx0ZGVmaW5lIDoge1xuXHRcdHRvZG9zOiB7c2VyaWFsaXplOiBmYWxzZSB9LFxuXHRcdHNlY3JldHM6IHtzZXJpYWxpemU6IGZhbHNlIH0sXG5cdFx0dGlja2V0czoge3NlcmlhbGl6ZTogZmFsc2UgfSxcblx0XHRzZXNzaW9uIDoge1xuXHRcdFx0c2VyaWFsaXplOiBmYWxzZSxcblx0XHRcdHNldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vIFdoZW4gdGhlcmUgaXMgYSBzZXNzaW9uLCBzdGFydCB0aGUgd2Vic29ja2V0cy5cblx0XHRcdFx0Y2FuLkZlYXRoZXJzLmNvbm5lY3QoJycsIHtxdWVyeTogJ3Rva2VuPScgKyBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZmVhdGhlcnN0b2tlbicpLCB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCcsICd4aHItcG9sbGluZyddIH0pO1xuXG5cdFx0XHRcdC8vIEZldGNoIHRoZSB1c2VyJ3MgZGF0YVxuXHRcdFx0XHR0aGlzLmF0dHIoJ3RvZG9zJywgbmV3IFRvZG8uTGlzdCh7fSkpO1xuXHRcdFx0XHR0aGlzLmF0dHIoJ3NlY3JldHMnLCBuZXcgU2VjcmV0Lkxpc3Qoe30pKTtcblxuXG5cdFx0XHR9LFxuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gV2hlbiB0aGUgc2Vzc2lvbiBpcyByZW1vdmVkLCBzdG9wIHJvdXRpbmcuXG5cdFx0XHRcdGNhbi5yb3V0ZS5hdHRyKCdwYWdlJywgJ2hvbWUnKTtcblxuXHRcdFx0XHQvLyBSZW1vdmUgZGF0YS5cblx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyKCd0b2RvcycpO1xuXHRcdFx0XHR0aGlzLnJlbW92ZUF0dHIoJ3NlY3JldHMnKTtcblxuXHRcdFx0XHQvLyBjYW4ucm91dGUuX3RlYXJkb3duKCk7XG5cdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdmZWF0aGVyc3Rva2VuJyk7XG5cblx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpc0xvZ2dlZEluOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gISF0aGlzLmF0dHIoJ3Nlc3Npb24nKTsgfVxuXHRcdH0sXG5cdFx0Ly8gU2V0IHRvIHRydWUgb25jZSB3ZSBrbm93IGlmIGEgc2Vzc2lvbiBoYXMgYmVlbiBlc3RhYmxpc2hlZCBvciBub3QuXG5cdFx0cmVhZHk6IHtcblx0XHRcdHNlcmlhbGl6ZTogZmFsc2Vcblx0XHR9LFxuXHRcdHNob3dQYWdlOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiggdGhpcy5hdHRyKCdzZXNzaW9uJykgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuYXR0cigncGFnZScpO1xuXHRcdFx0XHR9IGVsc2UgaWYodGhpcy5hdHRyKCdyZWFkeScpKXtcblx0XHRcdFx0XHQvLyBPbmx5IGNlcnRhaW4gcGFnZXMgYWxsb3dlZCB3aGVuIG5vdCBsb2dnZWQgaW4uXG5cdFx0XHRcdFx0dmFyIGFsbG93ZWQgPSBbXG5cdFx0XHRcdFx0XHQnaG9tZScsXG5cdFx0XHRcdFx0XHQnc2lnbnVwJyxcblx0XHRcdFx0XHRcdCd2ZXJpZnknLFxuXHRcdFx0XHRcdFx0J3Bhc3N3b3JkZW1haWwnLFxuXHRcdFx0XHRcdFx0J3Bhc3N3b3JkY2hhbmdlJ1xuXHRcdFx0XHRcdF07XG5cdFx0XHRcdFx0aWYgKGNhbi5pbkFycmF5KGNhbi5yb3V0ZS5hdHRyKCdwYWdlJyksIGFsbG93ZWQpID49IDApIHtcblx0XHRcdFx0XHRcdHJldHVybiBjYW4ucm91dGUuYXR0cigncGFnZScpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJ2xvZ2luJztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGxvZ291dDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHRoaXMuYXR0cignc2Vzc2lvbicpLmRlc3Ryb3koIGZ1bmN0aW9uKHRlc3QpIHtzZWxmLnJlbW92ZUF0dHIoJ3Nlc3Npb24nKTsgfSk7XG5cdH1cbn0pO1xuXG52YXIgYXBwU3RhdGUgPSBuZXcgQXBwU3RhdGUoKTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gYXBwU3RhdGU7XG53aW5kb3cuYXBwU3RhdGUgPSBhcHBTdGF0ZTtcblxuVG9kby5iaW5kKCdjcmVhdGVkJywgZnVuY3Rpb24oZXYsIHRvZG8pe1xuXHRpZiAoYXBwU3RhdGUuYXR0cignaXNMb2dnZWRJbicpKSB7XG5cdFx0YXBwU3RhdGUuYXR0cigndG9kb3MnKS5wdXNoKHRvZG8pO1xuXHR9XG59KTtcblxuY2FuLnJvdXRlLm1hcChhcHBTdGF0ZSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4ndXNlIHN0cmljdCc7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gY2FuLk1vZGVsLmV4dGVuZCgnU2Vzc2lvbicsIHtcblxuXHQvLyBDaGVjayBmb3IgYSB0b2tlbiBhbmQgYXR0ZW1wdCB0byBkZWNvZGUgaXQuXG5cdGZpbmRPbmU6IGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGQgPSBuZXcgY2FuLkRlZmVycmVkKCk7XG5cblx0XHQvLyBDaGVjayBmb3IgYSB0b2tlbi5cblx0XHR2YXIgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZmVhdGhlcnN0b2tlbicpO1xuXG5cdFx0Ly8gSWYgdGhlcmUncyBhIHRva2VuLi4uXG5cdFx0aWYodG9rZW4pIHtcblxuXHRcdFx0Ly8gR2V0IGl0IGRlY29kZWQgdG8gZ2V0IHRoZSB1c2VyIGRhdGEuXG5cdFx0XHRjYW4uYWpheCh7XG5cdFx0XHQgIHVybDogJy9hcGkvdG9rZW5sb2dpbicsXG5cdFx0XHQgIHR5cGU6ICdQT1NUJyxcblx0XHRcdCAgZGF0YVR5cGU6J2pzb24nLFxuXHRcdFx0ICBkYXRhOiB7dG9rZW46dG9rZW59XG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblxuXHRcdFx0XHRpZiAocmVzcG9uc2UuZXJyb3IpIHtcblx0XHRcdFx0XHRkLnJlamVjdCh7fSk7XG5cdFx0XHQgIC8vIC4uLiByZXNvbHZlIHdpdGggdGhlIHVzZXIuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCAgZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0Ly8gSWYgdGhlcmUncyBubyB0b2tlbiwgcmVqZWN0LlxuXHRcdH0gZWxzZSB7XG5cdFx0XHRkLnJlamVjdCh7fSk7XG5cdFx0fVxuXHRcdHJldHVybiBkO1xuXHR9LFxuXG5cdC8vIExvZ2luIHdpdGggdXNlcm5hbWUgYW5kIHBhc3N3b3JkLlxuXHRjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdHZhciBkID0gbmV3IGNhbi5EZWZlcnJlZCgpO1xuXHRcdGlmKGRhdGEuZW1haWwgJiYgZGF0YS5wYXNzd29yZCkge1xuXHRcdFx0Ly8gR2V0IGl0IGRlY29kZWQgdG8gZ2V0IHRoZSB1c2VyIGRhdGEuXG5cdFx0XHRjYW4uYWpheCh7XG5cdFx0XHQgIHVybDogJy9hcGkvbG9naW4nLFxuXHRcdFx0ICB0eXBlOiAnUE9TVCcsXG5cdFx0XHQgIGRhdGFUeXBlOidqc29uJyxcblx0XHRcdCAgZGF0YToge2VtYWlsOmRhdGEuZW1haWwsIHBhc3N3b3JkOmRhdGEucGFzc3dvcmR9XG5cdFx0XHR9KS50aGVuKFxuXHRcdFx0XHRmdW5jdGlvbihyZXNwb25zZSkgIHtcblxuXHRcdFx0XHRcdGlmIChyZXNwb25zZS5tZXNzYWdlKSB7XG5cdFx0XHRcdFx0XHRkLnJlamVjdChyZXNwb25zZSk7XG5cdFx0XHRcdCAgLy8gLi4uIHJlc29sdmUgd2l0aCB0aGUgdXNlci5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2ZlYXRoZXJzdG9rZW4nLCByZXNwb25zZS50b2tlbik7XG5cdFx0XHRcdFx0ICBkLnJlc29sdmUocmVzcG9uc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xuXHRcdFx0XHRcdGQucmVqZWN0KGFyZ3VtZW50cyk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0fSBlbHNlIHtcblx0XHRcdGQucmVqZWN0KHtlcnJvcjogJ2luY29ycmVjdCB1c2VybmFtZSBvciBwYXNzd29yZCd9KTtcblx0XHR9XG5cdFx0cmV0dXJuIGQ7XG5cdH0sXG5cdGRlc3Ryb3k6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdHZhciBkID0gbmV3IGNhbi5EZWZlcnJlZCgpO1xuXHRcdGQucmVzb2x2ZSgpO1xuXHRcdHJldHVybiBkO1xuXG5cdH1cbn0se30pOyIsIlwidXNlIHN0cmljdFwiO1xucmVxdWlyZShcIi4vbG9naW4vbG9naW4uanNcIik7cmVxdWlyZShcIi4vc2lnbnVwL3NpZ251cC5qc1wiKTtyZXF1aXJlKFwiLi92ZXJpZnkvdmVyaWZ5LmpzXCIpO3JlcXVpcmUoXCIuL3Bhc3N3b3JkY2hhbmdlc3VjY2Vzcy9wYXNzd29yZGNoYW5nZXN1Y2Nlc3MuanNcIik7cmVxdWlyZShcIi4vcGFzc3dvcmRjaGFuZ2UvcGFzc3dvcmRjaGFuZ2UuanNcIik7cmVxdWlyZShcIi4vcGFzc3dvcmRlbWFpbC9wYXNzd29yZGVtYWlsLmpzXCIpO3JlcXVpcmUoXCIuL215LWFjY291bnQvbXktYWNjb3VudC5qc1wiKTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBjYW4uQ29tcG9uZW50LmV4dGVuZCh7XG5cdHRhZzogJ3NjLWhvbWUnLFxuXHR0ZW1wbGF0ZTogY2FuLnZpZXcoJy9hcHBzL21haW4vY29tcG9uZW50cy9ob21lL2hvbWUubXVzdGFjaGUnKSxcblx0c2NvcGU6IHt9XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBjYW4uQ29tcG9uZW50LmV4dGVuZCh7XG5cdHRhZzogJ3NjLXNlY3JldHMnLFxuXHR0ZW1wbGF0ZTogY2FuLnZpZXcoJy9hcHBzL21haW4vY29tcG9uZW50cy9zZWNyZXRzL3NlY3JldHMubXVzdGFjaGUnKSxcblx0c2NvcGU6IHt9XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBjYW4uQ29tcG9uZW50LmV4dGVuZCh7XG5cdHRhZzogJ3NjLXRvZG9zJyxcblx0dGVtcGxhdGU6IGNhbi52aWV3KCcvYXBwcy9tYWluL2NvbXBvbmVudHMvdG9kb3MvdG9kb3MubXVzdGFjaGUnKSxcblx0c2NvcGU6IHt9XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxudmFyIFRpY2tldCA9IHJlcXVpcmUoXCIuLi8uLi9tb2RlbHMuanNcIikuVGlja2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNhbi5Db21wb25lbnQuZXh0ZW5kKHtcblx0dGFnOiAnc2Mtc3VwcG9ydCcsXG5cdHRlbXBsYXRlOiBjYW4udmlldygnL2FwcHMvbWFpbi9jb21wb25lbnRzL3RpY2tldHMvdGlja2V0cy5tdXN0YWNoZScpLFxuXHRzY29wZToge30sXG5cdGV2ZW50czoge1xuXHRcdGluaXQ6IGZ1bmN0aW9uKGVsLCBldil7XG5cdFx0XHRjYW4ucm91dGUuYXR0cigndGlja2V0cycsIG5ldyBUaWNrZXQuTGlzdCh7fSkpO1xuXHRcdH1cblx0fVxufSk7IiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcbnZhciBkaXNwb3NlID0gcmVxdWlyZShcIiEvVXNlcnMvbWFyc2hhbGx0aG9tcHNvbi9Ecm9wYm94L1NpdGVzL2Z0ZXN0My9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlLmpzXCIpXG5cdC8vIFRoZSBjc3MgY29kZTpcblx0KHJlcXVpcmUoXCIhIS9Vc2Vycy9tYXJzaGFsbHRob21wc29uL0Ryb3Bib3gvU2l0ZXMvZnRlc3QzL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS9Vc2Vycy9tYXJzaGFsbHRob21wc29uL0Ryb3Bib3gvU2l0ZXMvZnRlc3QzL2FwcHMvbWFpbi9tYWluLmNzc1wiKSlcbmlmKG1vZHVsZS5ob3QpIHtcblx0bW9kdWxlLmhvdC5hY2NlcHQoKTtcblx0bW9kdWxlLmhvdC5kaXNwb3NlKGRpc3Bvc2UpO1xufSIsImlucHV0LmZvcm0tY29udHJvbC50b3B7XG5cdGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XG5cdGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAwO1xuXHRib3JkZXItYm90dG9tOjA7XG59XG5pbnB1dC5mb3JtLWNvbnRyb2wuYm90dG9te1xuXHRib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAwO1xuXHRib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcbn1cblxuLndlbGwgaDE6Zmlyc3QtY2hpbGQsIC53ZWxsIGgyOmZpcnN0LWNoaWxkLCAud2VsbCBoMzpmaXJzdC1jaGlsZCwgLndlbGwgaDQ6Zmlyc3QtY2hpbGR7XG5cdG1hcmdpbi10b3A6MCAhaW1wb3J0YW50O1xufSIsIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYWRkU3R5bGUoY3NzQ29kZSkge1xyXG5cdGlmKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xyXG5cdFx0aWYodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XHJcblx0fVxyXG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcblx0c3R5bGVFbGVtZW50LnR5cGUgPSBcInRleHQvY3NzXCI7XHJcblx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcblx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc0NvZGU7XHJcblx0fSBlbHNlIHtcclxuXHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3NDb2RlKSk7XHJcblx0fVxyXG5cdHJldHVybiBmdW5jdGlvbigpIHtcclxuXHRcdGhlYWQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHR9O1xyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiO1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgVG9kbyA9IGNhbi5GZWF0aGVycy5Nb2RlbC5leHRlbmQoJ1RvZG8nLCB7XG5cdHJlc291cmNlOiAnYXBpL3RvZG9zJ1xufSwge30pO1xuZXhwb3J0cy5Ub2RvID0gVG9kbztcbnZhciBTZWNyZXQgPSBjYW4uRmVhdGhlcnMuTW9kZWwuZXh0ZW5kKCdTZWNyZXQnLCB7XG5cdHJlc291cmNlOiAnYXBpL3NlY3JldHMnXG59LCB7fSk7XG5leHBvcnRzLlNlY3JldCA9IFNlY3JldDtcbnZhciBUaWNrZXQgPSBjYW4uRmVhdGhlcnMuTW9kZWwuZXh0ZW5kKCdUaWNrZXQnLCB7XG5cdHJlc291cmNlOiAnYXBpL3RpY2tldHMnXG59LCB7fSk7XG5leHBvcnRzLlRpY2tldCA9IFRpY2tldDtcbnZhciBVc2VyID0gY2FuLkZlYXRoZXJzLk1vZGVsLmV4dGVuZCgnVXNlcicsIHtcblx0cmVzb3VyY2U6ICdhcGkvdXNlcnMnXG59LCB7fSk7XG5leHBvcnRzLlVzZXIgPSBVc2VyO1xudmFyIFB1YmxpY1VzZXIgPSBjYW4uTW9kZWwuZXh0ZW5kKCdQdWJsaWNVc2VyJywge1xuXHRyZXNvdXJjZTogJ2FwaS91c2Vycydcbn0sIHt9KTtcbmV4cG9ydHMuUHVibGljVXNlciA9IFB1YmxpY1VzZXI7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBTZXNzaW9uID0gcmVxdWlyZShcIi4uLy4uLy4uL21vZGVscy9zZXNzaW9uXCIpW1wiZGVmYXVsdFwiXTtcblxuY2FuLkNvbXBvbmVudC5leHRlbmQoe1xuXHR0YWc6ICdzYy1sb2dpbicsXG5cdHRlbXBsYXRlOiBjYW4udmlldygnL2FwcHMvbWFpbi9jb21wb25lbnRzL2F1dGgvbG9naW4vbG9naW4ubXVzdGFjaGUnKSxcblx0c2NvcGU6IHtcblx0XHRub3RWZXJpZmllZDogZmFsc2UsXG5cdFx0aW52YWxpZExvZ2luOiBmYWxzZSxcblx0XHRsb2dpbjogZnVuY3Rpb24oc2NvcGUsIGVsLCBldil7dmFyIHRoaXMkMCA9IHRoaXM7XG5cdFx0XHQvLyBSZXNldCBtZXNzYWdlcy5cblx0XHRcdHRoaXMuYXR0cignaW52YWxpZExvZ2luJywgZmFsc2UpO1xuXHRcdFx0dGhpcy5hdHRyKCdub3RWZXJpZmllZCcsIGZhbHNlKTtcblxuXHRcdFx0dGhpcy5hdHRyKCdlbWFpbCcsICdzdXBwb3J0QGJyeWNlY2FueW9uaGFsZm1hcmF0aG9uLmNvbScpO1xuXHRcdFx0dGhpcy5hdHRyKCdwYXNzd29yZCcsICdzd2FpbnMnKTtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR0aGlzLmF0dHIoJ2xvZ2dpbmdJbicsIHRydWUpO1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0bmV3IFNlc3Npb24oe1xuXHRcdFx0XHRlbWFpbDogdGhpcy5hdHRyKCdlbWFpbCcpLFxuXHRcdFx0XHRwYXNzd29yZDogdGhpcy5hdHRyKCdwYXNzd29yZCcpXG5cdFx0XHR9KS5zYXZlKFxuXHRcdFx0XHRmdW5jdGlvbihzZXNzaW9uKSAge1xuXHRcdFx0XHRcdGNhbi5yb3V0ZS5hdHRyKHtcblx0XHRcdFx0XHRcdHNlc3Npb24gOnNlc3Npb24sXG5cdFx0XHRcdFx0XHRsb2dnaW5nSW46IGZhbHNlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Y2FuLnJvdXRlLmF0dHIoJ3BhZ2UnLCAnaG9tZScpO1xuXHRcdFx0XHR9LCBmdW5jdGlvbihlcnJvcikgIHtcblx0XHRcdFx0XHRzd2l0Y2goZXJyb3Iuc3RhdHVzKXtcblx0XHRcdFx0XHRcdGNhc2UgJ25vdCB2ZXJpZmllZCc6XG5cdFx0XHRcdFx0XHRcdHdpbnN0b24ubG9nKCdpbnZhbGlkIGxvZ2luJywgc2VsZi5hdHRyKCdlbWFpbCcpICsgJyB0cmllZCB0byBsb2dpbiB3aXRob3V0IHZlcmlmeWluZyB0aGUgYWNjb3VudCBmaXJzdC4nKTtcblx0XHRcdFx0XHRcdFx0Y2FuLnJvdXRlLmF0dHIoJ3BhZ2UnLCAndmVyaWZ5Jyk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0Y2FzZSAnaW52YWxpZCBsb2dpbic6XG5cdFx0XHRcdFx0XHRcdHdpbnN0b24ubG9nKCdpbnZhbGlkIGxvZ2luJywgc2VsZi5hdHRyKCdlbWFpbCcpICsgJyBpcyBoYXZpbmcgdHJvdWJsZSBsb2dnaW5nIGluLicpO1xuXHRcdFx0XHRcdFx0XHR0aGlzJDAuYXR0cignaW52YWxpZExvZ2luJywgdHJ1ZSk7XG5cdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0fSxcblx0XHRyZXNldFBhc3N3b3JkOiBmdW5jdGlvbihzY29wZSwgZWwsIGV2KXtcblx0XHRcdGNhbi5yb3V0ZS5hdHRyKCdlbWFpbCcsIHRoaXMuYXR0cignZW1haWwnKSk7XG5cdFx0XHRjYW4ucm91dGUuYXR0cigncGFnZScsICdwYXNzd29yZGVtYWlsJyk7XG5cdFx0fVxuXHR9XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcbi8vIFdlIG5lZWQgYSB0b2tlbiB0byBmdWxseSBob29rIHVwIHRoZSB3ZWJzb2NrZXQsIHNvIHdlIHVzZSBhIFB1YmxpY1VzZXJcbnZhciBQdWJsaWNVc2VyID0gcmVxdWlyZShcIi4uLy4uLy4uL21vZGVscy5qc1wiKS5QdWJsaWNVc2VyO1xudmFyIFNlc3Npb24gPSByZXF1aXJlKFwiLi4vLi4vLi4vbW9kZWxzL3Nlc3Npb25cIilbXCJkZWZhdWx0XCJdO1xucmVxdWlyZShcIi4vc2lnbnVwLmNzc1wiKTtcbmNhbi5Db21wb25lbnQuZXh0ZW5kKHtcblx0dGFnOiAnc2Mtc2lnbnVwJyxcblx0dGVtcGxhdGU6IGNhbi52aWV3KCcvYXBwcy9tYWluL2NvbXBvbmVudHMvYXV0aC9zaWdudXAvc2lnbnVwLm11c3RhY2hlJyksXG5cdHNjb3BlOiB7XG5cdFx0dXNlcjp7fSxcblx0XHRlbWFpbE1pc21hdGNoOiBmYWxzZSxcblx0XHRwYXNzd29yZE1pc21hdGNoOiBmYWxzZSxcblx0XHRlbWFpbFRha2VuOiBmYWxzZSxcblx0XHRzaWdudXA6IGZ1bmN0aW9uKHNjb3BlLCBlbCwgZXYpe1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblxuXHRcdFx0dGhpcy5hdHRyKCd1c2VyLmVtYWlsJywgJ3N1cHBvcnRAYnJ5Y2VjYW55b25oYWxmbWFyYXRob24uY29tJyk7XG5cdFx0XHR0aGlzLmF0dHIoJ3VzZXIuZW1haWwyJywgJ3N1cHBvcnRAYnJ5Y2VjYW55b25oYWxmbWFyYXRob24uY29tJyk7XG5cdFx0XHR0aGlzLmF0dHIoJ3VzZXIucGFzc3dvcmQnLCAnc3dhaW5zJyk7XG5cdFx0XHR0aGlzLmF0dHIoJ3VzZXIucGFzc3dvcmQyJywgJ3N3YWlucycpO1xuXG5cdFx0XHRpZiAodGhpcy5hdHRyKCd1c2VyLmVtYWlsJykgIT0gdGhpcy5hdHRyKCd1c2VyLmVtYWlsMicpKSB7XG5cdFx0XHRcdHRoaXMuYXR0cignZW1haWxNaXNtYXRjaCcsIHRydWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5hdHRyKCdlbWFpbE1pc21hdGNoJywgZmFsc2UpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5hdHRyKCd1c2VyLnBhc3N3b3JkJykgIT0gdGhpcy5hdHRyKCd1c2VyLnBhc3N3b3JkMicpKSB7XG5cdFx0XHRcdHRoaXMuYXR0cigncGFzc3dvcmRNaXNtYXRjaCcsIHRydWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5hdHRyKCdwYXNzd29yZE1pc21hdGNoJywgZmFsc2UpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXRoaXMuZW1haWxNaXNtYXRjaCAmJiAhdGhpcy5wYXNzd29yZE1pc21hdGNoKSB7XG5cdFx0XHRcdG5ldyBQdWJsaWNVc2VyKHRoaXMudXNlci5hdHRyKCkpLnNhdmUoXG5cdFx0XHRcdFx0ZnVuY3Rpb24odXNlcikgIHtcblx0XHRcdFx0XHRcdGNhbi5yb3V0ZS5hdHRyKCdwYWdlJywgJ3ZlcmlmeScpO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZnVuY3Rpb24oZXJyb3IsIGVyciwgc3RhdHVzKSAge1xuXHRcdFx0XHRcdFx0c3dpdGNoKHN0YXR1cyl7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ0NvbmZsaWN0Jzpcblx0XHRcdFx0XHRcdFx0XHR3aW5zdG9uLmxvZygnaW52YWxpZCBsb2dpbicsIHNlbGYuYXR0cignZW1haWwnKSArICcgdHJpZWQgdG8gcmVwZWF0IHNpZ251cC4nKTtcblx0XHRcdFx0XHRcdFx0XHRzZWxmLmF0dHIoJ2VtYWlsVGFrZW4nLCB0cnVlKTtcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdH1cblx0fVxufSk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBTZXNzaW9uID0gcmVxdWlyZShcIi4uLy4uLy4uL21vZGVscy9zZXNzaW9uXCIpW1wiZGVmYXVsdFwiXTtcblxuY2FuLkNvbXBvbmVudC5leHRlbmQoe1xuXHR0YWc6ICdzYy12ZXJpZnknLFxuXHR0ZW1wbGF0ZTogY2FuLnZpZXcoJy9hcHBzL21haW4vY29tcG9uZW50cy9hdXRoL3ZlcmlmeS92ZXJpZnkubXVzdGFjaGUnKSxcblx0c2NvcGU6IHtcblx0XHRkZWZpbmU6e1xuXHRcdFx0c2VjcmV0Ontcblx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSl7XG5cdFx0XHRcdFx0Y2FuLnJvdXRlLmF0dHIoJ3NlY3JldCcsIHZhbHVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0bm90VmVyaWZpZWQ6ZmFsc2UsXG5cdFx0dmVyaWZ5OiBmdW5jdGlvbihzY29wZSwgZWwsIGV2KXtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGlmICghY2FuLnJvdXRlLmF0dHIoJ3NlY3JldCcpKSB7XG5cdFx0XHRcdGNhbi5yb3V0ZS5hdHRyKCdzZWNyZXQnLCB0aGlzLnNlY3JldCk7XG5cdFx0XHR9XG5cblx0XHRcdGNhbi4kLmFqYXgoe1xuXHRcdFx0XHR1cmw6ICcvYXBpL3ZlcmlmeScsXG5cdFx0XHRcdHR5cGU6ICdQT1NUJyxcblx0XHRcdFx0ZGF0YVR5cGU6J2pzb24nLFxuXHRcdFx0XHRkYXRhOiB7c2VjcmV0OiBjYW4ucm91dGUuYXR0cignc2VjcmV0Jyl9LFxuXHRcdFx0fSlcblx0XHRcdC5kb25lKGZ1bmN0aW9uKGRhdGEpICB7XG5cdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdmZWF0aGVyc3Rva2VuJywgZGF0YS50b2tlbik7XG5cblx0XHRcdFx0Y2FuLnJvdXRlLnJlbW92ZUF0dHIoJ3NlY3JldCcpO1xuXG5cdFx0XHRcdFNlc3Npb24uZmluZE9uZSh7fSkudGhlbihcblx0XHRcdFx0XHQvLyBTdWNjZXNzZnVsIHRva2VuIGxvZ2luXG5cdFx0XHRcdFx0ZnVuY3Rpb24oc2Vzc2lvbikgIHtcblx0XHRcdFx0XHRcdGNhbi5yb3V0ZS5hdHRyKHtcblx0XHRcdFx0XHRcdFx0c2Vzc2lvbjogc2Vzc2lvbixcblx0XHRcdFx0XHRcdFx0cmVhZHkgOiB0cnVlXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdC8vIEZhaWxlZCB0b2tlbiBsb2dpbi5cblx0XHRcdFx0XHRmdW5jdGlvbigpICB7XG5cdFx0XHRcdFx0XHRjYW4ucm91dGUuYXR0cigncmVhZHknLCB0cnVlKTtcblx0XHRcdFx0XHR9KTtcblxuXG5cdFx0XHRcdGNhbi5yb3V0ZS5hdHRyKCdwYWdlJywgJ2hvbWUnKTtcblx0XHRcdH0pXG5cdFx0XHQuZmFpbChmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnZXJyb3InKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXHR9XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxuY2FuLkNvbXBvbmVudC5leHRlbmQoe1xuXHR0YWc6ICdzYy1wYXNzd29yZGNoYW5nZXN1Y2Nlc3MnLFxuXHR0ZW1wbGF0ZTogY2FuLnZpZXcoJy9hcHBzL21haW4vY29tcG9uZW50cy9hdXRoL3Bhc3N3b3JkY2hhbmdlc3VjY2Vzcy9wYXNzd29yZGNoYW5nZXN1Y2Nlc3MubXVzdGFjaGUnKSxcbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgU2Vzc2lvbiA9IHJlcXVpcmUoXCIuLi8uLi8uLi9tb2RlbHMvc2Vzc2lvblwiKVtcImRlZmF1bHRcIl07XG5cbmNhbi5Db21wb25lbnQuZXh0ZW5kKHtcblx0dGFnOiAnc2MtcGFzc3dvcmRjaGFuZ2UnLFxuXHR0ZW1wbGF0ZTogY2FuLnZpZXcoJy9hcHBzL21haW4vY29tcG9uZW50cy9hdXRoL3Bhc3N3b3JkY2hhbmdlL3Bhc3N3b3JkY2hhbmdlLm11c3RhY2hlJyksXG5cdHNjb3BlOiB7XG5cdFx0ZGVmaW5lOntcblx0XHRcdHNlY3JldDp7XG5cdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpe1xuXHRcdFx0XHRcdGNhbi5yb3V0ZS5hdHRyKCdzZWNyZXQnLCB2YWx1ZSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldDogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRyZXR1cm4gY2FuLnJvdXRlLmF0dHIoJ3NlY3JldCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpbnZhbGlkQ29kZTpmYWxzZSxcblx0XHRub3RWZXJpZmllZDpmYWxzZSxcblx0XHRzZW5kOiBmdW5jdGlvbihzY29wZSwgZWwsIGV2KXtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGNhbi4kLmFqYXgoe1xuXHRcdFx0XHR1cmw6ICcvYXBpL3Bhc3N3b3JkY2hhbmdlJyxcblx0XHRcdFx0dHlwZTogJ1BPU1QnLFxuXHRcdFx0XHRkYXRhVHlwZTonanNvbicsXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRzZWNyZXQ6IHNjb3BlLmF0dHIoJ3NlY3JldCcpLFxuXHRcdFx0XHRcdHBhc3N3b3JkOiBzY29wZS5hdHRyKCdwYXNzd29yZCcpLFxuXHRcdFx0XHRcdHBhc3N3b3JkMjogc2NvcGUuYXR0cigncGFzc3dvcmQyJylcblx0XHRcdFx0fSxcblx0XHRcdH0pXG5cdFx0XHQuZG9uZShmdW5jdGlvbihyZXNwb25zZSkgIHtcblxuXHRcdFx0XHRpZiAocmVzcG9uc2Uuc3RhdHVzKSB7XG5cdFx0XHRcdFx0c2NvcGUuYXR0cignaW52YWxpZENvZGUnLCB0cnVlKTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZmVhdGhlcnN0b2tlbicsIHJlc3BvbnNlLnRva2VuKTtcblxuXHRcdFx0XHRjYW4ucm91dGUucmVtb3ZlQXR0cignc2VjcmV0Jyk7XG5cblx0XHRcdFx0U2Vzc2lvbi5maW5kT25lKHt9KS50aGVuKFxuXHRcdFx0XHRcdC8vIFN1Y2Nlc3NmdWwgdG9rZW4gbG9naW5cblx0XHRcdFx0XHRmdW5jdGlvbihzZXNzaW9uKSAge1xuXHRcdFx0XHRcdFx0Y2FuLnJvdXRlLmF0dHIoe1xuXHRcdFx0XHRcdFx0XHRzZXNzaW9uOiBzZXNzaW9uLFxuXHRcdFx0XHRcdFx0XHRyZWFkeSA6IHRydWVcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y2FuLnJvdXRlLmF0dHIoJ3BhZ2UnLCAncGFzc3dvcmRjaGFuZ2VzdWNjZXNzJyk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHQvLyBGYWlsZWQgdG9rZW4gbG9naW4uXG5cdFx0XHRcdFx0ZnVuY3Rpb24oZXJyb3IpICB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKGVycm9yKTtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0fSlcblx0XHRcdC5mYWlsKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdlcnJvcicpO1xuXHRcdFx0fSk7XG5cblx0XHR9LFxuXHRcdHRyeWFnYWluOiBmdW5jdGlvbihzY29wZSwgZWwsIGV2KXtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRjYW4ucm91dGUucmVtb3ZlQXR0cignc2VjcmV0Jyk7XG5cdFx0XHRjYW4ucm91dGUuYXR0cignZW1haWwnLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnZW1haWwnKSk7XG5cdFx0XHRjYW4ucm91dGUuYXR0cigncGFnZScsICdwYXNzd29yZGVtYWlsJyk7XG5cdFx0fVxuXHR9XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxuY2FuLkNvbXBvbmVudC5leHRlbmQoe1xuXHR0YWc6ICdzYy1wYXNzd29yZGVtYWlsJyxcblx0dGVtcGxhdGU6IGNhbi52aWV3KCcvYXBwcy9tYWluL2NvbXBvbmVudHMvYXV0aC9wYXNzd29yZGVtYWlsL3Bhc3N3b3JkZW1haWwubXVzdGFjaGUnKSxcblx0c2NvcGU6IHtcblx0XHRub25leGlzdGVudDpmYWxzZSxcblx0XHRzZW5kOiBmdW5jdGlvbihzY29wZSwgZWwsIGV2KXtcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdGlmICghY2FuLnJvdXRlLmF0dHIoJ2VtYWlsJykpIHtcblx0XHRcdFx0Y2FuLnJvdXRlLmF0dHIoJ2VtYWlsJywgdGhpcy5lbWFpbCk7XG5cdFx0XHR9XG5cblx0XHRcdGNhbi4kLmFqYXgoe1xuXHRcdFx0XHR1cmw6ICcvYXBpL3Bhc3N3b3JkZW1haWwnLFxuXHRcdFx0XHR0eXBlOiAnUE9TVCcsXG5cdFx0XHRcdGRhdGFUeXBlOidqc29uJyxcblx0XHRcdFx0ZGF0YToge2VtYWlsOiBjYW4ucm91dGUuYXR0cignZW1haWwnKX0sXG5cdFx0XHR9KVxuXHRcdFx0LmRvbmUoZnVuY3Rpb24oZGF0YSkgIHtcblx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2VtYWlsJywgY2FuLnJvdXRlLmF0dHIoJ2VtYWlsJykpO1xuXHRcdFx0XHRjYW4ucm91dGUucmVtb3ZlQXR0cignZW1haWwnKTtcblx0XHRcdFx0Y2FuLnJvdXRlLmF0dHIoJ3BhZ2UnLCAncGFzc3dvcmRjaGFuZ2UnKTtcblx0XHRcdH0pXG5cdFx0XHQuZmFpbChmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnZXJyb3InKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXHR9XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxucmVxdWlyZShcIi4uL2NoYW5nZS1wYXNzd29yZC9jaGFuZ2UtcGFzc3dvcmQuanNcIik7XG5tb2R1bGUuZXhwb3J0cyA9IGNhbi5Db21wb25lbnQuZXh0ZW5kKHtcblx0dGFnOiAnc2MtbXktYWNjb3VudCcsXG5cdHRlbXBsYXRlOiBjYW4udmlldygnL2FwcHMvbWFpbi9jb21wb25lbnRzL2F1dGgvbXktYWNjb3VudC9teS1hY2NvdW50Lm11c3RhY2hlJyksXG5cdHNjb3BlOiB7fVxufSk7IiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcbnZhciBkaXNwb3NlID0gcmVxdWlyZShcIiEvVXNlcnMvbWFyc2hhbGx0aG9tcHNvbi9Ecm9wYm94L1NpdGVzL2Z0ZXN0My9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlLmpzXCIpXG5cdC8vIFRoZSBjc3MgY29kZTpcblx0KHJlcXVpcmUoXCIhIS9Vc2Vycy9tYXJzaGFsbHRob21wc29uL0Ryb3Bib3gvU2l0ZXMvZnRlc3QzL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS9Vc2Vycy9tYXJzaGFsbHRob21wc29uL0Ryb3Bib3gvU2l0ZXMvZnRlc3QzL2FwcHMvbWFpbi9jb21wb25lbnRzL2F1dGgvc2lnbnVwL3NpZ251cC5jc3NcIikpXG5pZihtb2R1bGUuaG90KSB7XG5cdG1vZHVsZS5ob3QuYWNjZXB0KCk7XG5cdG1vZHVsZS5ob3QuZGlzcG9zZShkaXNwb3NlKTtcbn0iLCIuc2lnbnVwLW1lc3NhZ2VzIHB7XG5cdHBhZGRpbmc6IDRweCA4cHg7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBVc2VyID0gcmVxdWlyZShcIi4uLy4uLy4uL21vZGVscy5qc1wiKS5Vc2VyO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNhbi5Db21wb25lbnQuZXh0ZW5kKHtcblx0dGFnOiAnY2hhbmdlLXBhc3N3b3JkJyxcblx0dGVtcGxhdGU6IGNhbi52aWV3KCcvYXBwcy9tYWluL2NvbXBvbmVudHMvYXV0aC9jaGFuZ2UtcGFzc3dvcmQvY2hhbmdlLXBhc3N3b3JkLm11c3RhY2hlJyksXG5cdHNjb3BlOiB7XG5cdFx0bWluTGVuZ3RoOiA2LFxuXHRcdHBhc3N3b3JkVG9vU2hvcnQ6IGZhbHNlLFxuXHRcdHN1Y2Nlc3M6ZmFsc2UsXG5cdFx0cGFzc3dvcmRNaXNtYXRjaDpmYWxzZSxcblx0XHQvLyBDaGFuZ2UgYSBtZXNzYWdlIGF0dHIgZm9yIHRocmVlIHNlY29uZHMuXG5cdFx0c2V0TWVzc2FnZUF0dHI6IGZ1bmN0aW9uKGF0dHJTdHJpbmcpe1xuXHRcdFx0dmFyIHNjb3BlID0gdGhpcztcblx0XHRcdHNjb3BlLmF0dHIoYXR0clN0cmluZywgdHJ1ZSk7XG5cdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpe3Njb3BlLmF0dHIoYXR0clN0cmluZywgZmFsc2UpO30sIDMwMDApO1xuXHRcdH0sXG5cdFx0Y2hhbmdlUGFzc3dvcmQ6IGZ1bmN0aW9uKHNjb3BlLCBlbCwgZXYpe1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0aWYgKHNjb3BlLmF0dHIoJ3Bhc3N3b3JkJykubGVuZ3RoIDwgc2NvcGUuYXR0cignbWluTGVuZ3RoJykpIHtcblx0XHRcdFx0c2NvcGUuc2V0TWVzc2FnZUF0dHIoJ3Bhc3N3b3JkVG9vU2hvcnQnKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiBwYXNzd29yZHMgbWF0Y2gsIHNhdmUgdGhlIHVzZXIuXG5cdFx0XHRpZiAoc2NvcGUuYXR0cigncGFzc3dvcmQnKSA9PSBzY29wZS5hdHRyKCdwYXNzd29yZDInKSkge1xuXHRcdFx0XHQvLyBTZXQgdXAgcGFzc3dvcmQgZGF0YS5cblx0XHRcdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRcdFx0aWQ6IGNhbi5yb3V0ZS5hdHRyKCdzZXNzaW9uLl9pZCcpLFxuXHRcdFx0XHRcdHBhc3N3b3JkOiBzY29wZS5hdHRyKCdwYXNzd29yZCcpLFxuXHRcdFx0XHRcdHVwZGF0ZVBhc3N3b3JkOiB0cnVlXG5cdFx0XHRcdH07XG5cdFx0XHRcdC8vIFNhdmUgdGhlIG5ldyBwYXNzd29yZC5cblx0XHRcdFx0bmV3IFVzZXIoZGF0YSkuc2F2ZShcblx0XHRcdFx0XHRmdW5jdGlvbigpICB7XG5cdFx0XHRcdFx0XHRzY29wZS5hdHRyKCdwYXNzd29yZCcsICcnKTtcblx0XHRcdFx0XHRcdHNjb3BlLmF0dHIoJ3Bhc3N3b3JkMicsICcnKTtcblx0XHRcdFx0XHRcdHNjb3BlLnNldE1lc3NhZ2VBdHRyKCdzdWNjZXNzJyk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdC8vIFBhc3N3b3JkcyBkaWRuJ3QgbWF0Y2guICBBbGVydCB1c2VyLlxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gQWxlcnQgdGhlIHVzZXIgdGhhdCB0aGUgcGFzc3dvcmRzIG11c3QgbWF0Y2guXG5cdFx0XHRcdHNjb3BlLnNldE1lc3NhZ2VBdHRyKCdwYXNzd29yZE1pc21hdGNoJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59KTsiXSwic291cmNlUm9vdCI6IndlYnBhY2stbW9kdWxlOi8vIn0=