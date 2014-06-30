/**
 * Todos Service
 * ------------------
 *
 * Security Overview:
 * Public can see and edit public.
 * Users can see and edit both public and their own todos.
 * If a user edits a public todo it remains public.
 *
 */

var mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  MongooseService = require('feathers-mongoose-advanced'),
  hooks = require('../hook-filters'),
  events = require('../event-filters');


/* * * Create your schema * * */
var schema = new mongoose.Schema({
  description: String,
  done: Boolean,
  userID: ObjectId
});


/* * * Set up virtual fields * * */
schema.virtual('id').get(function(){
    return this._id.toHexString();
});
schema.set('toJSON', {virtuals: true});
schema.set('toObject', {virtuals: true});



module.exports = function(app){


  /* * * Set up the url for this service * * */
  var url = 'api/todos';

  app.use(url, new MongooseService( mongoose.model('Todo', schema) ));

  var service = app.lookup(url);


  /* * * Set up 'before' hooks * * */
  service.before({
    find:   hooks.requireAuthForPrivate,
    get:    hooks.requireAuthForPrivate,
    create: hooks.requireAuthForPrivate,
    update: hooks.requireAuthForPrivate,
    remove: hooks.requireAuthForPrivate
  });

  service.before({
    create: hooks.setUserID
  });


  /* * * Set up 'after' hooks * * */
  // service.after({
  //   find: function (hook, next) {
  //     return next();
  //   }
  // });


  /* * * Filter socket announcements * * */
  service.created = service.updated = service.patched = service.removed = events.requireAuthForPrivate;

};