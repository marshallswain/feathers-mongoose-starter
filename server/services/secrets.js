/**
 * Secrets Service
 * ------------------
 *
 * Security Overview:
 * No Public Access.
 * Users can see and edit their own secrets.
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
  var url = 'api/secrets';

  app.use(url, new MongooseService( mongoose.model('Secret', schema) ));

  var service = app.lookup(url);


  /* * * Set up 'before' hooks * * */
  service.before({
    find:   hooks.requireAuth,
    get:    hooks.requireAuth,
    create: hooks.requireAuth,
    update: hooks.requireAuth,
    remove: hooks.requireAuth
  });

  service.before({
    create: hooks.setUserID,
    update: hooks.setUserID
  });


  /* * * Set up 'after' hooks * * */
  // service.after({
  //   find: function (hook, next) {
  //     return next();
  //   }
  // });


  /* * * Filter socket announcements * * */
  service.created = service.updated = service.patched = service.removed = events.requireAuth;

};