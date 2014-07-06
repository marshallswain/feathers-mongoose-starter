## FeathersJS server with Gulp/Webpack and CanJS


### What's Included
 * **CanJS** & **jQuery 2** for the client-side framework. - http://canjs.com
 * **jQuery++** - http://jquerypp.com/
 * **Outdated Browser** - http://outdatedbrowser.com
 * **FeathersJS** realtime express server with **Socket.io** & REST configured - http://feathersjs.com/
 * **canjs-feathers** - https://github.com/feathersjs/canjs-feathers
 * **winston** logging on both the client and server. Ready to log to console, email, and MongoDB. - https://github.com/flatiron/winston
 * **MongoDB and Mongoose** for the database.
 * User Signup & simple token auth out of the box.
 * **Postmark** for sending signup emails. - http://postmarkapp.com
 * The build system:
	* **Gulp.js** - http://gulpjs.com/
	* **Webpack** flexible, es6-compatible module bundler - http://webpack.github.io/
	* **can-compile** for CanJS template compilation - http://daffl.github.io/can-compile/


### Setup
1. Configuration
	* **server.js** - Set up the database uri and server port number.
	* **webpack.config.js** - Set up the entry point and output folders for your apps.
	* **gulpfile.js** - Set up can-compile and gulp tasks.
	* **server/setup/auth.js** - Customize the tokenSecret that will be used to hash auth tokens.  Also setup the Postmark API Key and setup the Postmark send data with your email addresses.
	* **server/hook-library.js** - Update the Postmark API Key and setup the Postmark.send data.
	* **winston.js** - Set up logging.
2. Install Modules -
	* Run **bower install** In the public directory.
	* Run **npm install** in the root directory.
3. Start Services
	* Run **node server** to start the server.
	* Run **gulp**   You may have to do **sudo npm install -g gulp** if you haven't already done so.
4. Open [http://localhost]()


### Folder Structure
 * **apps** - where you put individual client-side apps.  This is the source folder for the build system.
 * **public/assets** - default destination for webpack builds.  Can be changed in webpack.config.js's output.path and output.publicPath
 * **server/services** - Each file in here contains a feathers service.
 * **server/setup** - Configuration for Feathers REST, Socket.io, and Auth.
 * **server/event-library.js** - Some useful Feathers event filters to control socket broadcast security.
 * **server/hook-library.js** - Some useful hooks for controlling read/write security on services.  Open a service to see how they are used.


### On Security
 * This currently uses **jwt-simple** for token auth.  Tokens don't expire, so this is only a marginal improvement over using cookies.
 * You'll probably want to turn off webpack's source maps to build your production-ready app.