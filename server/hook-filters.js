/**
 *
 * A Library of Useful Hooks for FeathersJS
 *
 * If auth has been implemented, you can find the user object at hook.params.user.
 * All of these examples assume that data belonging to a user contains a 'userID', not user_id, etc.
 *
 */

var errors = require('feathers').errors.types,
  randomString = require('random-string'),
  postmark = require('postmark')('postmark-key-here');


/**
 * Only authenticated users allowed, period!
 *
 * find, get, create, update, remove
 */
exports.requireAuth = function (hook, next) {

  // Allow user to view records without a userID.
  if (!hook.params.user) {
    return next(new errors.NotAuthenticated('Please include a valid auth token in the Authorization header.'));
  }

  return next(null, hook);
};


/**
 * Authenticated users can have their own records (with userID),
 * and non-authenticated users can view records without a userID.
 *
 * find, get, create, update, remove
 */
exports.requireAuthForPrivate = function(hook, next){

  // If no user, limit to public records (no userID)
  if (!hook.params.user) {
    hook.params.query.userID = null;
    return next();
  }

  return next();
};


/**
 * Set up the userID on data.
 *
 * create
 */
exports.setUserID = function(hook, next){

  // If a user is logged in, set up the userID on the data.
  if (hook.params && hook.params.user) {
    hook.data.userID = hook.params.user._id;
  }
  return next();
};


/**
 * If the user is not an admin, remove any admin attribute.  This prevents
 * unauthorized users from setting other users up as administrators.
 * This typically would be used on a user-type service.
 *
 * create, update
 */
exports.requireAdminToSetAdmin = function(hook, next){

  // If not logged in or logged in but not an admin,
  if (hook.params.user && !hook.params.user.admin) {

    // delete admin before save.
    delete hook.data.admin;
  }

  return next();
};


/**
 * When a new user is created by a non-admin, create a secret
 * that will be used as the email verification code.
 * This typically would be used on a user-type service.
 *
 * This could have been done in the Mongoose model if we didn't want
 * to check if the creating user is an admin.
 *
 * create
 */
exports.setSecret = function(hook, next){

  // In the case that this isn't an administrator creating the record...
  if (!(hook.params.user && hook.params.user.admin)) {

    // add a secret to the data.
    hook.data.secret = randomString();
    hook.data.verified = false;
  }

  return next();
};


/**
 * When a new user is created by a non-admin, send a verification email.
 *
 * Probably an 'after' filter.
 *
 * create
 */
exports.sendVerificationEmail = function(hook, next){

  // In the case that this isn't an administrator creating the record...
  if (!(hook.params.user && hook.params.user.admin)) {

    var protocol = 'http';
    // if (req.headers['x-forwarded-proto'] == 'https') {
      // protocol = 'https';
    // }

    var body = 'Click here to verify your email address: \n '+ protocol +'://localhost/#!login/verify/' + hook.data.secret;

    // Send an email
    postmark.send({
      'From': 'support@brycecanyonhalfmarathon.com',
      'To': hook.data.email,
      'Subject': 'Verify Your Account',
      'TextBody': body
    });
  }

  return next();
};


