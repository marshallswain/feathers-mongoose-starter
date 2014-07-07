/**
 *
 * A Library of useful socket event filters for FeathersJS
 *
 */


/* Require Auth */
exports.requireAuth = function(data, params, callback){
  if (params.user && data.userID) {

  	// Admins get notifications
  	if (params.user.admin) {
	    callback(null, data);
  	}

  	// User gets own notifications
  	if (params.user._id == data.userID) {
	    callback(null, data);
  	}
  }
};


/* Require Auth for data with a userID. */
exports.requireAuthForPrivate = function(data, params, callback){

	// If there's a userID on the data...
	if (data.userID) {

		// If the user is logged in, allow the event.
		if (params && params.user && params.user._id == data.userID) {
		  callback(null, data);
		}

	// No userID on data, so allow the event.
	} else {
	  callback(null, data);
	}
};