/* Gulp configuration file */

// add gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    coffeelint = require('gulp-coffeelint'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    prettify = require('gulp-html-prettify'),
    server = require('gulp-server-livereload');

/* Add tasks */

// setup server and watch for changes
gulp.task('default', ['server', 'watch']);

// build, setup server, and watch for changes
gulp.task('test', ['build', 'server', 'watch']);

// build to ./test/
gulp.task('build', ['jade', 'sass', 'coffee']);

// watch for changes and compile them
gulp.task('watch', function() {
  var jadew = gulp.watch('./src/jade/*.jade', ['jade']);
  jadew.on('change', function(event) {
    gutil.log('File ' + event.path.substr(event.path.lastIndexOf('/')+1) + ' was ' + event.type + ', compiling jade...');
  });

  var sassw = gulp.watch('./src/sass/*.sass', ['sass']);
  sassw.on('change', function(event) {
    gutil.log('File ' + event.path.substr(event.path.lastIndexOf('/')+1) + ' was ' + event.type + ', compiling sass...');
  });

  var coffeew = gulp.watch('./src/coffee/*.coffee', ['coffee']);
  coffeew.on('change', function(event) {
    gutil.log('File ' + event.path.substr(event.path.lastIndexOf('/')+1) + ' was ' + event.type + ', compiling coffee...');
  });

  gutil.log('Gulp is watching!');
  return ;
});

// run livereloading server at test/
gulp.task('server', function() {
  return gulp.src('./test/')
    .pipe(server({
      livereload: true
    }));
});

// compile jade
gulp.task('jade', function() {
  return gulp.src('./src/jade/[^_]*.jade')
    .pipe(jade())
    .pipe(prettify())
    .pipe(gulp.dest('./test/'));
});

// compile sass
gulp.task('sass', function () {
  return gulp.src('./src/sass/[^_]*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./test/css'));
});

// compile coffee
gulp.task('coffee', function () {
  return gulp.src('./src/coffee/[^_]*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .pipe(coffee())
    .pipe(gulp.dest('./test/js'));
});
