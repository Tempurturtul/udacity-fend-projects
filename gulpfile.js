/*  Tasks:
 *    lint:js           (Lint JavaScript.)
 *    lint:json         (Lint JSON.)
 *    lint              (Run all lint tasks then watch and re-lint.)
 *    clean             (Delete dist files.)
 *    build             (Build dist files.)
 *    serve             (Serve src files then watch and re-serve.)
 *    serve:dist        (Serve dist files then watch and re-serve.)
 *    deploy:gh-pages   (Deploy dist files to gh-pages.)
 *    default           (Lint and serve.)
 */

var DEST = 'dist';
var JS_OUT = 'app.min.js';
var CSS_OUT = 'style.min.css';

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
var browserSync = require('browser-sync').create();
var del = require('del');
var ghPages = require('gulp-gh-pages');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var jsonlint = require('gulp-jsonlint');
var merge = require('merge-stream');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
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

gulp.task('lint', ['lint:js', 'lint:json'], function() {
  gulp.watch(jsFiles, ['lint:js']);
  gulp.watch(jsonFiles, ['lint:json']);
});

gulp.task('clean', function() {
  return del([DEST]);
});

gulp.task('build', ['clean'], function() {
  return merge(
    gulp.src(clientImageFiles)
      .pipe(imagemin({
        progressive: true,  // jpg
        interlaced: true    // gif
      }))
      .pipe(gulp.dest(DEST)),
    gulp.src(clientHTMLFiles)
      .pipe(useref())
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', minifyCSS()))
      .pipe(gulpif('*.html', minifyHTML({
        empty: true,
        quotes: true,
        spare: true
      })))
      .pipe(gulp.dest(DEST)));
});

gulp.task('serve', function() {
  browserSync.init({
      server: {
        baseDir: 'src/client',
        routes: {
          '/bower_components': './bower_components'
        }
      },
      https: false,
      notify: false,
      minify: false
  });

  gulp.watch(clientJSFiles, browserSync.reload);
  gulp.watch(clientCSSFiles, browserSync.reload);
  gulp.watch(clientHTMLFiles, browserSync.reload);
  gulp.watch(clientImageFiles, browserSync.reload);
});

gulp.task('serve:dist', function() {
  browserSync.init({
      server: {
        baseDir: DEST
      },
      https: false,
      notify: false,
      minify: false
  });

  gulp.watch([DEST + '/**/*'], browserSync.reload);
});

gulp.task('deploy:gh-pages', function() {
  return gulp.src(DEST + '/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['lint', 'serve']);
