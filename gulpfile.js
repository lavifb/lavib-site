/* Gulp configuration file */

// add gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    coffeelint = require('gulp-coffeelint'),
    uglify = require('gulp-uglify')
    jade = require('gulp-jade'),
    prettify = require('gulp-html-prettify'),
    sass = require('gulp-sass'),
    minCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    server = require('gulp-server-livereload');

/* Add tasks */

// setup server and watch for changes
gulp.task('default', ['server', 'watch']);

// build, setup server, and watch for changes
gulp.task('test', ['build', 'server', 'watch']);

// build to ./test/
gulp.task('build', ['jade', 'sass', 'coffee']);

// build production level assets to ./public/
gulp.task('prod', ['jade:prod', 'sass:prod', 'coffee:prod']);

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

gulp.task('jade:prod', function() {
  return gulp.src('./src/jade/[^_]*.jade')
    .pipe(jade())
    .pipe(gulp.dest('./public/'));
});

// compile sass
gulp.task('sass', function () {
  return gulp.src('./src/sass/[^_]*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./test/css'));
});

gulp.task('sass:prod', function () {
  return gulp.src('./src/sass/[^_]*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(minCss())
    // .pipe(concat('styles.css'))
    .pipe(gulp.dest('./public/css'));
});

// compile coffee
gulp.task('coffee', function () {
  return gulp.src('./src/coffee/[^_]*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .pipe(coffee())
    .pipe(gulp.dest('./test/js'));
});

gulp.task('coffee:prod', function () {
  return gulp.src('./src/coffee/[^_]*.coffee')
    .pipe(coffee())
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));
});
