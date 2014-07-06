'use strict';

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  wpconfig = require('./webpack.config.js'),
  webpack = require('webpack'),
  compilerGulp = require('can-compile/gulp.js');

// Run webpack.
gulp.task('webpack', function() {
  webpack(wpconfig, function(err, stats) {
    if(err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({/* output options */ }));
  });
});



// Mustache Templates for Main app - Uses can-compile
var options = {
  src: ['apps/main/**/*.mustache'],
  out: 'public/assets/main.mustache.js',
  version: '2.1.2'
};
compilerGulp.task('main-views', options, gulp);
compilerGulp.watch('main-views', options, gulp);




// The default task (called when you run `gulp` from cli)
gulp.task('default', [
	'webpack',
  'main-views',
  'main-views-watch'
]);
