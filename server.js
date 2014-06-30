var feathers = require('feathers');

var app = feathers(),
  hooks = require('feathers-hooks'),
  mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId;

mongoose.connect('mongodb://localhost/test');


// Set up public directory.
app.use(feathers.static(__dirname + '/public'))
  .configure(hooks());

// Set up REST.
require('./server/setup/rest')(app, feathers);
// Set up Socket.io
require('./server/setup/socket')(app, feathers);

// Load services
require('./server/services/todos.js')(app);
require('./server/services/secrets.js')(app);
require('./server/services/users.js')(app);

// Set up Auth
require('./server/setup/auth').setup(app, feathers);

app.configure(feathers.errors());

// Start the server.
app.listen(80, function() {
  console.log('Feathers server listening on port ' + 80);
});
