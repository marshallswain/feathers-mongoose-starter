'use strict';

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  wpconfig = require('./webpack.config.js'),
  webpack = require('webpack');
var compilerGulp = require('can-compile/gulp.js');

// Main
gulp.task('webpack', function() {
  webpack(wpconfig, function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({/* output options */ }));
  });
});

// Steal Build
// gulp.task('steal-build', function() {

//   stealTools.build({
//     config: './public/stealconfig.js',
//     main: 'main'
//   }).then(function(){
//     console.log('build is successful');
//   });
// });



// Home CanJS TEMPLATES
var options = {
  src: ['apps/main/**/*.mustache'],
  out: 'public/assets/main.mustache.js',
  version: '2.1.2'
};

compilerGulp.task('main-views', options, gulp);
compilerGulp.watch('main-views', options, gulp);

// Core CanJS TEMPLATES
// var options = {
//   src: ['client/app-core/**/*.mustache'],
//   out: 'public/assets/core.views.js',
//   version: '2.0.7'
// };

// compilerGulp.task('core-views', options, gulp);
// compilerGulp.watch('core-views', options, gulp);

// // Login CanJS TEMPLATES
// var options = {
//   src: ['client/app-login/**/*.mustache'],
//   out: 'public/assets/login.views.js',
//   version: '2.0.7'
// };

// compilerGulp.task('login-views', options, gulp);
// compilerGulp.watch('login-views', options, gulp);



// The default task (called when you run `gulp` from cli)
gulp.task('default', [
	'webpack',
  'main-views',
  'main-views-watch',
]);
