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
	
	var Session = __webpack_require__(2)["default"];
	__webpack_require__(3);__webpack_require__(4);__webpack_require__(5);__webpack_require__(6);__webpack_require__(7);
	// Everything revolves around the appState.
	var appState = __webpack_require__(1)["default"];
	
	// Setup route.
	can.route(':page',{page: 'home'});
	
	
	// Register Mustache Helper
	can.mustache.registerHelper('linkTo', function(page)  {return can.mustache.safeString(can.route.link(page,{page: page}))}  );
	
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
			console.log(session);
			appState.attr({
				session: session,
				ready : true
			});
			can.route.ready();
		},
		// Failed token login.
		function()  {
			console.log('2');
			appState.attr('ready', true);
			can.route.ready();
		});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	var Todo = __webpack_require__(8).Todo;
	var Secret = __webpack_require__(8).Secret;
	
	
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
				set: function() {
					// When there is a session, start routing.
					can.route.map(appState);
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
		create: function(data){
			var d = new can.Deferred();
			if(data.email && data.password) {
				// Get it decoded to get the user data.
				can.ajax({
				  url: '/api/login',
				  type: 'POST',
				  data: {email:data.email, password:data.password}
				}).then(function(response){
	
					if (response.error) {
						d.reject(response);
				  // ... resolve with the user.
					} else {
	
						localStorage.setItem('featherstoken', response.token);
					  d.resolve(response);
					}
				});
	
			} else {
				d.reject({message: 'incorrect username or password'});
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
	'use strict';
	
	var Session = __webpack_require__(2)["default"];
	
	can.Component.extend({
		tag: 'sc-login',
		template: can.view('/apps/main/components/login/login.mustache'),
		scope: {
			login: function(scope, el, ev){
				this.attr('email', 'marshall@creativeideal.net');
				this.attr('password', 'swains');
				ev.preventDefault();
				this.attr('loggingIn', true);
				var self = this;
				new Session({
					email: this.attr('email'),
					password: this.attr('password')
				}).save(function(session){
					self.attr({
						session :session,
						loggingIn: false
					});
					can.route.attr('page', 'home');
				});
			}
		}
	});

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
	
	
	exports["default"] = can.Component.extend({
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	module.exports = can.Component.extend({
		tag: 'sc-secrets',
		template: can.view('/apps/main/components/secrets/secrets.mustache'),
		scope: {}
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	'use strict';
	
	module.exports = can.Component.extend({
		tag: 'sc-todos',
		template: can.view('/apps/main/components/todos/todos.mustache'),
		scope: {}
	});

/***/ },
/* 8 */
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

/***/ }
/******/ ])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2svYm9vdHN0cmFwIDc2MDI1YTYzOTAxMzRlNjIwYTQ1IiwiLi9hcHBzL21haW4vbWFpbi5qcyIsIi4vYXBwcy9tYWluL2FwcFN0YXRlLmpzIiwiLi9hcHBzL21haW4vbW9kZWxzL3Nlc3Npb24uanMiLCIuL2FwcHMvbWFpbi9jb21wb25lbnRzL2xvZ2luL2xvZ2luLmpzIiwiLi9hcHBzL21haW4vY29tcG9uZW50cy9ob21lL2hvbWUuanMiLCIuL2FwcHMvbWFpbi9jb21wb25lbnRzL2pxdWVyeS11aS9qcXVlcnktdWkuanMiLCIuL2FwcHMvbWFpbi9jb21wb25lbnRzL3NlY3JldHMvc2VjcmV0cy5qcyIsIi4vYXBwcy9tYWluL2NvbXBvbmVudHMvdG9kb3MvdG9kb3MuanMiLCIuL2FwcHMvbWFpbi9tb2RlbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esd0M7Ozs7Ozs7QUN0Q0E7QUFDQTs7QUFFQTtBQUNBLHdCQUF1Qyx1QkFBcUMsdUJBQStDLHVCQUEyQztBQUN0SztBQUNBOztBQUVBO0FBQ0Esb0JBQW1CLGFBQWE7OztBQUdoQztBQUNBLHdEQUF1RCxvREFBb0QsV0FBVyxHQUFHOztBQUV6SDs7QUFFQTtBQUNBLDhCQUE2QixRQUFRO0FBQ3JDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOztBQUVELG1CQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQSxHQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUUsRTs7Ozs7O0FDM0NGO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBOEIsbUdBQW1HOztBQUVqSTtBQUNBLHdDQUF1QztBQUN2Qyw0Q0FBMkM7O0FBRTNDLEtBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBLHFCQUFvQiwrQkFBK0I7QUFDbkQsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxPQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUU7QUFDRjtBQUNBO0FBQ0EsaURBQWdELDJCQUEyQixFQUFFO0FBQzdFO0FBQ0EsRUFBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDLEU7Ozs7OztBQzlFRDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFZO0FBQ1osS0FBSTs7QUFFSjtBQUNBLGlCQUFnQjtBQUNoQjtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSTtBQUNKO0FBQ0EsSUFBRztBQUNILGVBQWM7QUFDZDtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBWTtBQUNaLEtBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFJOztBQUVKLElBQUc7QUFDSCxjQUFhLDBDQUEwQztBQUN2RDtBQUNBO0FBQ0EsR0FBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBQyxHQUFHLEU7Ozs7OztBQ2xFSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLEtBQUk7QUFDSjtBQUNBO0FBQ0EsRUFBQyxFOzs7Ozs7QUMzQkQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUMsRTs7Ozs7O0FDUEQ7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsV0FBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEVBQUMsRTs7Ozs7O0FDbEJEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDLEU7Ozs7OztBQ1BEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDLEU7Ozs7OztBQ1BEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUMsSUFBSTtBQUNMO0FBQ0E7QUFDQTtBQUNBLEVBQUMsSUFBSTtBQUNMLHlCIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2Fzc2V0cy9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxudmFyIFNlc3Npb24gPSByZXF1aXJlKFwiLi9tb2RlbHMvc2Vzc2lvblwiKVtcImRlZmF1bHRcIl07XG5yZXF1aXJlKFwiLi9jb21wb25lbnRzL2xvZ2luL2xvZ2luLmpzXCIpO3JlcXVpcmUoXCIuL2NvbXBvbmVudHMvaG9tZS9ob21lLmpzXCIpO3JlcXVpcmUoXCIuL2NvbXBvbmVudHMvanF1ZXJ5LXVpL2pxdWVyeS11aS5qc1wiKTtyZXF1aXJlKFwiLi9jb21wb25lbnRzL3NlY3JldHMvc2VjcmV0cy5qc1wiKTtyZXF1aXJlKFwiLi9jb21wb25lbnRzL3RvZG9zL3RvZG9zLmpzXCIpO1xuLy8gRXZlcnl0aGluZyByZXZvbHZlcyBhcm91bmQgdGhlIGFwcFN0YXRlLlxudmFyIGFwcFN0YXRlID0gcmVxdWlyZShcIi4vYXBwU3RhdGUuanNcIilbXCJkZWZhdWx0XCJdO1xuXG4vLyBTZXR1cCByb3V0ZS5cbmNhbi5yb3V0ZSgnOnBhZ2UnLHtwYWdlOiAnaG9tZSd9KTtcblxuXG4vLyBSZWdpc3RlciBNdXN0YWNoZSBIZWxwZXJcbmNhbi5tdXN0YWNoZS5yZWdpc3RlckhlbHBlcignbGlua1RvJywgZnVuY3Rpb24ocGFnZSkgIHtyZXR1cm4gY2FuLm11c3RhY2hlLnNhZmVTdHJpbmcoY2FuLnJvdXRlLmxpbmsocGFnZSx7cGFnZTogcGFnZX0pKX0gICk7XG5cbiQoZG9jdW1lbnQuYm9keSkuYXBwZW5kKCBjYW4udmlldygnL2FwcHMvbWFpbi9zaXRlLm11c3RhY2hlJywgYXBwU3RhdGUpICk7XG5cbnZhciBwYWdlcyA9IHtcblx0bG9naW46ICc8c2MtbG9naW4gc2Vzc2lvbj1cIntzZXNzaW9ufVwiPjwvc2MtbG9naW4+J1xufTtcblxuYXBwU3RhdGUuYmluZCgnc2hvd1BhZ2UnLCBmdW5jdGlvbihldiwgbmV3VmFsKSAge1xuXHRpZihuZXdWYWwpIHtcblx0XHR2YXIgdGVtcGxhdGUgPSAgcGFnZXNbbmV3VmFsXSB8fCAnPHNjLScrbmV3VmFsKyc+PC9zYy0nK25ld1ZhbCsnPic7XG5cdFx0JCgnI21haW4nKS5odG1sKCAgY2FuLm11c3RhY2hlKCB0ZW1wbGF0ZSApKCBhcHBTdGF0ZSApICk7XG5cdH1cbn0pO1xuXG5TZXNzaW9uLmZpbmRPbmUoe30pLnRoZW4oXG5cdC8vIFN1Y2Nlc3NmdWwgdG9rZW4gbG9naW5cblx0ZnVuY3Rpb24oc2Vzc2lvbikgIHtcblx0XHRjb25zb2xlLmxvZyhzZXNzaW9uKTtcblx0XHRhcHBTdGF0ZS5hdHRyKHtcblx0XHRcdHNlc3Npb246IHNlc3Npb24sXG5cdFx0XHRyZWFkeSA6IHRydWVcblx0XHR9KTtcblx0XHRjYW4ucm91dGUucmVhZHkoKTtcblx0fSxcblx0Ly8gRmFpbGVkIHRva2VuIGxvZ2luLlxuXHRmdW5jdGlvbigpICB7XG5cdFx0Y29uc29sZS5sb2coJzInKTtcblx0XHRhcHBTdGF0ZS5hdHRyKCdyZWFkeScsIHRydWUpO1xuXHRcdGNhbi5yb3V0ZS5yZWFkeSgpO1xuXHR9KTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxudmFyIFRvZG8gPSByZXF1aXJlKFwiLi9tb2RlbHMuanNcIikuVG9kbztcbnZhciBTZWNyZXQgPSByZXF1aXJlKFwiLi9tb2RlbHMuanNcIikuU2VjcmV0O1xuXG5cbi8vIERlZmluZXMgdGhlIHN0YXRlIG9mIHRoZSBhcHBsaWNhdGlvblxudmFyIEFwcFN0YXRlID0gY2FuLk1hcC5leHRlbmQoe1xuXHRkZWZpbmUgOiB7XG5cdFx0dG9kb3M6IHtcblx0XHRcdHNlcmlhbGl6ZTogZmFsc2Vcblx0XHR9LFxuXHRcdHNlY3JldHM6IHtcblx0XHRcdHNlcmlhbGl6ZTogZmFsc2Vcblx0XHR9LFxuXHRcdHNlc3Npb24gOiB7XG5cdFx0XHRzZXJpYWxpemU6IGZhbHNlLFxuXHRcdFx0c2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gV2hlbiB0aGVyZSBpcyBhIHNlc3Npb24sIHN0YXJ0IHJvdXRpbmcuXG5cdFx0XHRcdGNhbi5yb3V0ZS5tYXAoYXBwU3RhdGUpO1xuXHRcdFx0XHRjYW4uRmVhdGhlcnMuY29ubmVjdCgnJywge3F1ZXJ5OiAndG9rZW49JyArIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdmZWF0aGVyc3Rva2VuJyksIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0JywgJ3hoci1wb2xsaW5nJ10gfSk7XG5cblx0XHRcdFx0Ly8gRmV0Y2ggdGhlIHVzZXIncyBkYXRhXG5cdFx0XHRcdHRoaXMuYXR0cigndG9kb3MnLCBuZXcgVG9kby5MaXN0KHt9KSk7XG5cdFx0XHRcdHRoaXMuYXR0cignc2VjcmV0cycsIG5ldyBTZWNyZXQuTGlzdCh7fSkpO1xuXG5cdFx0XHR9LFxuXHRcdFx0cmVtb3ZlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gV2hlbiB0aGUgc2Vzc2lvbiBpcyByZW1vdmVkLCBzdG9wIHJvdXRpbmcuXG5cdFx0XHRcdGNhbi5yb3V0ZS5hdHRyKCdwYWdlJywgJ2hvbWUnKTtcblxuXHRcdFx0XHQvLyBSZW1vdmUgZGF0YS5cblx0XHRcdFx0dGhpcy5yZW1vdmVBdHRyKCd0b2RvcycpO1xuXHRcdFx0XHR0aGlzLnJlbW92ZUF0dHIoJ3NlY3JldHMnKTtcblxuXHRcdFx0XHQvLyBjYW4ucm91dGUuX3RlYXJkb3duKCk7XG5cdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdmZWF0aGVyc3Rva2VuJyk7XG5cblx0XHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRpc0xvZ2dlZEluOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gISF0aGlzLmF0dHIoJ3Nlc3Npb24nKTsgfVxuXHRcdH0sXG5cdFx0Ly8gU2V0IHRvIHRydWUgb25jZSB3ZSBrbm93IGlmIGEgc2Vzc2lvbiBoYXMgYmVlbiBlc3RhYmxpc2hlZCBvciBub3QuXG5cdFx0cmVhZHk6IHtcblx0XHRcdHNlcmlhbGl6ZTogZmFsc2Vcblx0XHR9LFxuXHRcdHNob3dQYWdlOiB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiggdGhpcy5hdHRyKCdzZXNzaW9uJykgKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuYXR0cigncGFnZScpO1xuXHRcdFx0XHR9IGVsc2UgaWYodGhpcy5hdHRyKCdyZWFkeScpKXtcblx0XHRcdFx0XHQvLyBBbGxvdyB0aGUgaG9tZSBwYWdlIG9yIGxvZ2luIHBhZ2Ugd2l0aG91dCBhIHNlc3Npb24uXG5cdFx0XHRcdFx0aWYgKGNhbi5yb3V0ZS5hdHRyKCdwYWdlJykgPT0gJ2hvbWUnKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJ2hvbWUnO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gJ2xvZ2luJztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdGxvZ291dDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHRoaXMuYXR0cignc2Vzc2lvbicpLmRlc3Ryb3koIGZ1bmN0aW9uKHRlc3QpIHtzZWxmLnJlbW92ZUF0dHIoJ3Nlc3Npb24nKTsgfSk7XG5cdH1cbn0pO1xuXG52YXIgYXBwU3RhdGUgPSBuZXcgQXBwU3RhdGUoKTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gYXBwU3RhdGU7XG53aW5kb3cuYXBwU3RhdGUgPSBhcHBTdGF0ZTtcblxuVG9kby5iaW5kKCdjcmVhdGVkJywgZnVuY3Rpb24oZXYsIHRvZG8pe1xuXHRpZiAoYXBwU3RhdGUuYXR0cignaXNMb2dnZWRJbicpKSB7XG5cdFx0YXBwU3RhdGUuYXR0cigndG9kb3MnKS5wdXNoKHRvZG8pO1xuXHR9XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBjYW4uTW9kZWwuZXh0ZW5kKCdTZXNzaW9uJywge1xuXG5cdC8vIENoZWNrIGZvciBhIHRva2VuIGFuZCBhdHRlbXB0IHRvIGRlY29kZSBpdC5cblx0ZmluZE9uZTogZnVuY3Rpb24oKXtcblx0XHR2YXIgZCA9IG5ldyBjYW4uRGVmZXJyZWQoKTtcblxuXHRcdC8vIENoZWNrIGZvciBhIHRva2VuLlxuXHRcdHZhciB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdmZWF0aGVyc3Rva2VuJyk7XG5cblx0XHQvLyBJZiB0aGVyZSdzIGEgdG9rZW4uLi5cblx0XHRpZih0b2tlbikge1xuXG5cdFx0XHQvLyBHZXQgaXQgZGVjb2RlZCB0byBnZXQgdGhlIHVzZXIgZGF0YS5cblx0XHRcdGNhbi5hamF4KHtcblx0XHRcdCAgdXJsOiAnL2FwaS90b2tlbmxvZ2luJyxcblx0XHRcdCAgdHlwZTogJ1BPU1QnLFxuXHRcdFx0ICBkYXRhOiB7dG9rZW46dG9rZW59XG5cdFx0XHR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblxuXHRcdFx0XHRpZiAocmVzcG9uc2UuZXJyb3IpIHtcblx0XHRcdFx0XHRkLnJlamVjdCh7fSk7XG5cdFx0XHQgIC8vIC4uLiByZXNvbHZlIHdpdGggdGhlIHVzZXIuXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCAgZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0Ly8gSWYgdGhlcmUncyBubyB0b2tlbiwgcmVqZWN0LlxuXHRcdH0gZWxzZSB7XG5cdFx0XHRkLnJlamVjdCh7fSk7XG5cdFx0fVxuXHRcdHJldHVybiBkO1xuXHR9LFxuXHRjcmVhdGU6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdHZhciBkID0gbmV3IGNhbi5EZWZlcnJlZCgpO1xuXHRcdGlmKGRhdGEuZW1haWwgJiYgZGF0YS5wYXNzd29yZCkge1xuXHRcdFx0Ly8gR2V0IGl0IGRlY29kZWQgdG8gZ2V0IHRoZSB1c2VyIGRhdGEuXG5cdFx0XHRjYW4uYWpheCh7XG5cdFx0XHQgIHVybDogJy9hcGkvbG9naW4nLFxuXHRcdFx0ICB0eXBlOiAnUE9TVCcsXG5cdFx0XHQgIGRhdGE6IHtlbWFpbDpkYXRhLmVtYWlsLCBwYXNzd29yZDpkYXRhLnBhc3N3b3JkfVxuXHRcdFx0fSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cblx0XHRcdFx0aWYgKHJlc3BvbnNlLmVycm9yKSB7XG5cdFx0XHRcdFx0ZC5yZWplY3QocmVzcG9uc2UpO1xuXHRcdFx0ICAvLyAuLi4gcmVzb2x2ZSB3aXRoIHRoZSB1c2VyLlxuXHRcdFx0XHR9IGVsc2Uge1xuXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2ZlYXRoZXJzdG9rZW4nLCByZXNwb25zZS50b2tlbik7XG5cdFx0XHRcdCAgZC5yZXNvbHZlKHJlc3BvbnNlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHR9IGVsc2Uge1xuXHRcdFx0ZC5yZWplY3Qoe21lc3NhZ2U6ICdpbmNvcnJlY3QgdXNlcm5hbWUgb3IgcGFzc3dvcmQnfSk7XG5cdFx0fVxuXHRcdHJldHVybiBkO1xuXHR9LFxuXHRkZXN0cm95OiBmdW5jdGlvbihkYXRhKXtcblx0XHR2YXIgZCA9IG5ldyBjYW4uRGVmZXJyZWQoKTtcblx0XHRkLnJlc29sdmUoKTtcblx0XHRyZXR1cm4gZDtcblxuXHR9XG59LHt9KTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxudmFyIFNlc3Npb24gPSByZXF1aXJlKFwiLi4vLi4vbW9kZWxzL3Nlc3Npb25cIilbXCJkZWZhdWx0XCJdO1xuXG5jYW4uQ29tcG9uZW50LmV4dGVuZCh7XG5cdHRhZzogJ3NjLWxvZ2luJyxcblx0dGVtcGxhdGU6IGNhbi52aWV3KCcvYXBwcy9tYWluL2NvbXBvbmVudHMvbG9naW4vbG9naW4ubXVzdGFjaGUnKSxcblx0c2NvcGU6IHtcblx0XHRsb2dpbjogZnVuY3Rpb24oc2NvcGUsIGVsLCBldil7XG5cdFx0XHR0aGlzLmF0dHIoJ2VtYWlsJywgJ21hcnNoYWxsQGNyZWF0aXZlaWRlYWwubmV0Jyk7XG5cdFx0XHR0aGlzLmF0dHIoJ3Bhc3N3b3JkJywgJ3N3YWlucycpO1xuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHRoaXMuYXR0cignbG9nZ2luZ0luJywgdHJ1ZSk7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRuZXcgU2Vzc2lvbih7XG5cdFx0XHRcdGVtYWlsOiB0aGlzLmF0dHIoJ2VtYWlsJyksXG5cdFx0XHRcdHBhc3N3b3JkOiB0aGlzLmF0dHIoJ3Bhc3N3b3JkJylcblx0XHRcdH0pLnNhdmUoZnVuY3Rpb24oc2Vzc2lvbil7XG5cdFx0XHRcdHNlbGYuYXR0cih7XG5cdFx0XHRcdFx0c2Vzc2lvbiA6c2Vzc2lvbixcblx0XHRcdFx0XHRsb2dnaW5nSW46IGZhbHNlXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRjYW4ucm91dGUuYXR0cigncGFnZScsICdob21lJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNhbi5Db21wb25lbnQuZXh0ZW5kKHtcblx0dGFnOiAnc2MtaG9tZScsXG5cdHRlbXBsYXRlOiBjYW4udmlldygnL2FwcHMvbWFpbi9jb21wb25lbnRzL2hvbWUvaG9tZS5tdXN0YWNoZScpLFxuXHRzY29wZToge31cbn0pOyIsIlwidXNlIHN0cmljdFwiO1xuJ3VzZSBzdHJpY3QnO1xuXG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gY2FuLkNvbXBvbmVudC5leHRlbmQoe1xuXHR0YWc6ICdzYy1qcXVlcnktdWknLFxuXHR0ZW1wbGF0ZTogY2FuLnZpZXcoJy9hcHBzL21haW4vY29tcG9uZW50cy9qcXVlcnktdWkvanF1ZXJ5LXVpLm11c3RhY2hlJyksXG5cdHNjb3BlOiB7fSxcblx0aGVscGVyczoge1xuXHRcdGFjY29yZGlvbjogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBmdW5jdGlvbihlbCl7XG5cdFx0XHRcdCQoZWwpLm9uZSgnaW5zZXJ0ZWQnLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCQoZWwgKS5hY2NvcmRpb24oKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdH07XG5cdFx0fVxuXHR9XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBjYW4uQ29tcG9uZW50LmV4dGVuZCh7XG5cdHRhZzogJ3NjLXNlY3JldHMnLFxuXHR0ZW1wbGF0ZTogY2FuLnZpZXcoJy9hcHBzL21haW4vY29tcG9uZW50cy9zZWNyZXRzL3NlY3JldHMubXVzdGFjaGUnKSxcblx0c2NvcGU6IHt9XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBjYW4uQ29tcG9uZW50LmV4dGVuZCh7XG5cdHRhZzogJ3NjLXRvZG9zJyxcblx0dGVtcGxhdGU6IGNhbi52aWV3KCcvYXBwcy9tYWluL2NvbXBvbmVudHMvdG9kb3MvdG9kb3MubXVzdGFjaGUnKSxcblx0c2NvcGU6IHt9XG59KTsiLCJcInVzZSBzdHJpY3RcIjtcbid1c2Ugc3RyaWN0JztcblxudmFyIFRvZG8gPSBjYW4uRmVhdGhlcnMuTW9kZWwuZXh0ZW5kKCdUb2RvJywge1xuXHRyZXNvdXJjZTogJ2FwaS90b2Rvcydcbn0sIHt9KTtcbmV4cG9ydHMuVG9kbyA9IFRvZG87XG52YXIgU2VjcmV0ID0gY2FuLkZlYXRoZXJzLk1vZGVsLmV4dGVuZCgnU2VjcmV0Jywge1xuXHRyZXNvdXJjZTogJ2FwaS9zZWNyZXRzJ1xufSwge30pO1xuZXhwb3J0cy5TZWNyZXQgPSBTZWNyZXQ7Il0sInNvdXJjZVJvb3QiOiJ3ZWJwYWNrLW1vZHVsZTovLyJ9