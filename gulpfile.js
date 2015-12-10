/*  Tasks:
 *    lint:js           (Lint JavaScript.)
 *    lint:json         (Lint JSON.)
 *    lint              (Run all lint tasks.)
 *    optimize:js       (Optimize .js files.)
 *    optimize:css      (Optimize .css files.)
 *    otimize:img       (Optimize images.)
 *    optimize:html     (Optimize .html files.)
 *    optimize          (Run all optimize tasks.)
 *    serve             (Serve src files.)
 *    serve:dist        (Serve dist files.)
 *    build             (Build dist files.)
 *    deploy:gh-pages   (Deploy dist files to gh-pages.)
 *    default           (Default task - lint, optimize, serve.)
 */

var DEST = 'dist';
var JS = 'app.min.js';
var CSS = 'style.min.css';

/* File globs. */
var jsFiles = [
  '**/*.js',
  '!**/*.min.js',
  '!**/node_modules/**/*.js',
  '!**/bower_components/**/*.js'
];
var jsonFiles = [
  '**/*.json',
  '!**/node_modules/**/*.json',
  '!**/bower_components/**/*.json'
];
var clientJSFiles = [
  'src/client/**/*.js'
];
var clientCSSFiles = [
  'src/client/**/*.css'
];
var clientImageFiles = [
  'src/client/**/img/**/*'
];
var clientHTMLFiles = [
  'src/client/**/*.html'
];

/* Gulp and plugins. */
var gulp = require('gulp');
var concat = require('gulp-concat');
var concatCSS = require('gulp-concat-css');
// var del = require('del');
// var gls = require('gulp-live-server');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var jsonlint = require('gulp-jsonlint');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
// var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');

gulp.task('lint:js', function() {
  return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint:json', function() {
  return gulp.src(jsonFiles)
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

gulp.task('lint', ['lint:js', 'lint:json']);

gulp.task('optimize:js', function() {
  return gulp.src(clientJSFiles)
    .pipe(concat(JS))
    .pipe(uglify())
    .pipe(gulp.dest(DEST));
});

gulp.task('optimize:css', function() {
  return gulp.src(clientCSSFiles)
    .pipe(concatCSS(CSS))
    .pipe(minifyCSS())
    .pipe(gulp.dest(DEST));
});

gulp.task('optimize:img', function() {
  return gulp.src(clientImageFiles)
    .pipe(imagemin({
      progressive: true,  // jpg
      interlaced: true    // gif
    }))
    .pipe(gulp.dest(DEST));
});

gulp.task('optimize:html', function() {
  return gulp.src(clientHTMLFiles)
    // TODO: Okay... useref concatenates, renames, and moves things. Those things must then be minified.  This isn't what I want, I just want to replace references to src code with references to dist code.
    .pipe(useref())
    // .pipe(minifyHTML({
    //   empty: true,
    //   quotes: true,
    //   spare: true
    // }))
    .pipe(gulp.dest(DEST));
});

gulp.task('optimize', [
  'optimize:js',
  'optimize:css',
  'optimize:img',
  'optimize:html'
]);

gulp.task('serve', function() {

});

gulp.task('serve:dist', function() {

});

gulp.task('build', function() {

});

gulp.task('deploy:gh-pages', function() {

});

gulp.task('default', []);
