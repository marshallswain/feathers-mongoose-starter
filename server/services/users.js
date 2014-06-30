var mongoose = require('mongoose'),
  ObjectId = mongoose.Schema.Types.ObjectId,
  MongooseService = require('feathers-mongoose-advanced'),
  SALT_WORK_FACTOR = 10,
  bcrypt = require('bcrypt'),
  hooks = require("../hook-filters");

var schema = new mongoose.Schema({
  email: {type: String, required: true, unique: true },
  password: {type: String, required: true },
  verified: Boolean,
  secret: String,
  emailUpdates: Boolean,
  agreesToTerms: Boolean,
  admin: Boolean
});

// Create a virtual field for id.
schema.virtual('id').get(function(){
    return this._id.toHexString();
});
// Ensure virtual fields are serialised.
schema.set('toJSON', {virtuals: true});
schema.set('toObject', {virtuals: true});

// Bcrypt middleware
schema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Password verification
schema.methods.comparePassword = function(candidatePassword, cb) {

  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = function(app){

  var serviceURL = 'api/users';

  app.use(serviceURL, new MongooseService( mongoose.model('User', schema) ));

  var service = app.lookup(serviceURL);

  service.before({
    // find:   hooks.requireAuth,
    get:    hooks.requireAuth,
    update: hooks.requireAuth,
    remove: hooks.requireAuth
  });

  service.before({
    create:   hooks.requireAdminToSetAdmin
  });

  service.before({
    create:   hooks.setSecret
  });

  service.after({
    create:   hooks.sendVerificationEmail
  });

  // service.after({
  //   find: function (hook, next) {
  //     // if (!hook.params.user) {
  //     //   return next(new Error('You are not logged in'));
  //     // }
  //     // console.log(hook);
  //     next();
  //   },

  //   create: function(hook, next) {
  //     hook.data.createdAt = new Date();

  //     next();
  //   }
  // });

};