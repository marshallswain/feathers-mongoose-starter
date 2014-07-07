'use strict';

var feathers = require('feathers');

var app = feathers(),
  hooks = require('feathers-hooks'),
  mongoose = require('mongoose'),
  winstonExpress = require('winston-express'),
  winston = require('./winston.js');

winstonExpress(app, winston);

mongoose.connect('mongodb://localhost/test');


// Set up public directory.
app.use(feathers.static(__dirname + '/public'));

// Set up REST.
require('./server/setup/rest')(app, feathers);

// Set up Socket.io
require('./server/setup/socket')(app, feathers);

// Set up Auth
require('./server/setup/auth').setup(app, feathers);
// Setup hooks after auth, so we can handle auth inside hooks.
app.configure(hooks());


// Load services
require('./server/services/todos.js')(app);
require('./server/services/secrets.js')(app);
require('./server/services/tickets.js')(app);
require('./server/services/users.js')(app);


app.configure(feathers.errors());



// Start the server.
app.listen(80, function() {
  console.log('Feathers server listening on port ' + 80);
});
