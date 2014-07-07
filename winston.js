'use strict';

/**
 * Configuration for winston logging.
 */

var winston = require('winston');
require('winston-email');

var MongoDB = require('winston-mongodb').MongoDB;

/**
 * Winston Email configuration
 */
winston.add(winston.transports.Email, {
  from   : 'xxx',
  to     : 'xxx',
  service: 'Gmail',
  auth   : { user: 'xxx', pass: 'xxx'},
  tags   : ['appname'] //optional tags in the subject line
});

/**
 * Winston MongoDB configuration
 */
winston.add(MongoDB, {
	collection: 'log',
	dbUri: 'mongodb://localhost/test'
});

module.exports = winston;