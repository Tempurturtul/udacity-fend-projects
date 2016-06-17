// TODO: Optimize images with responsiveness.
// TODO: Optimize audio and video.

/*  gulpfile.js
 *
 *  This is Tempurturtul's gulpfile. It makes a few assumptions about folder
 *  structure and requires some markup on html files. Additionally, relative
 *  paths should be used whenever possible. (See the deploy:gh-pages task for
 *  an explanation, and Requirements: HTML Markup for the exception.) Variables
 *  for making project-specific modifications are included below these comments.
 *  Currently handling automation of front-end tasks only.
 *
 *  Requirements:
 *    Folder Structure:
 *      - Client-side files placed in directory defined by SRC.
 *      - Images placed in arbitrarily deep subdirectory defined by IMAGE.
 *      - Audio placed in arbitrarily deep subdirectory defined by AUDIO.
 *      - Videos placed in arbitrarily deep subdirectory defined by VIDEO.
 *      - Non-bower vendor files placed in arbitrarily deep subdirectory defined
 *        by VENDOR. (This is only necessary if you want to prevent them from
 *        being linted.)
 *      - If using bower, default bower_components directory used.
 *      - NOTE: Folders defined by DEST and TMP will be automatically created
 *        and subject to automated deletion.
 *    HTML Markup:
 *      - Insert gulp-useref build blocks around external .js and .css resources
 *        that need to be included in the production files. (See gulp-useref for
 *        details.)
 *        - NOTE: Use absolute paths when using build:js or build:css in html
 *          not in the top level of the SRC folder.
 *        - Included custom gulp-useref build blocks:
 *          - build:jschanged, build:csschanged
 *            - Updates html with the new name/location of the file(s). Does not
 *              (re)process the file(s).
 *            - Example:
 *              - <!-- Another html file contains a reference to these same
 *              - files. They are concatenated and renamed there, there is no
 *              - need to repeat the process here. -->
 *              - <!-- build:jschanged combined.js -->
 *              - <script src="foo.js"></script>
 *              - <script src="bar.js"></script>
 *              - <!-- endbuild -->
 */

/*  Tasks:
 *    lint:js           (Lint JavaScript.)
 *    lint:json         (Lint JSON.)
 *    lint              (Run all lint tasks, then watch for files to re-lint.)
 *    clean:tmp         (Delete TMP folder.)
 *    clean:dest        (Delete DEST folder.)
 *    clean             (Run all clean tasks.)
 *    prep              (Clean, then output useref-modified and unmodified SRC files to TMP.)
 *    minify:html       (Minify TMP .html files.)
 *    minify:css        (Minify TMP .css files.)
 *    minify:js         (Minify TMP .js files.)
 *    minify:images     (Minify TMP image files.)
 *    minify            (Run all minify tasks.)
 *    build:finalize    (Fingerprint TMP files and replace references, then output them and bower_components to DEST.)
 *    build             (Run all build tasks, then clean TMP.)
 *    serve             (Serve SRC files, then watch for files to reload.)
 *    serve:dest        (Serve DEST files, then watch for files to reload.)
 *    serve:tunnelled   (Serve DEST files tunnelled to a random public url.)
 *    psi:desktop       (Test desktop performance and report results.)
 *    psi:mobile        (Test mobile performance and report results.)
 *    psi               (Run all psi tasks.)
 *    deploy:gh-pages   (Modify detected absolute links and deploy DEST files to gh-pages.)
 *    default           (Lint and serve.)
 */


/* Base directories. */
var SRC = 'src/';
var DEST = 'dist/';
var TMP = '.tmp/';


/* File directories. */
var IMAGE = 'image';
var AUDIO = 'audio';
var VIDEO = 'video';
var VENDOR = 'vendor';


/* Browsers. */
var browsers = ['google-chrome', 'firefox'];


/* Project-specific variables. */
// Path to root url for gh-pages (/project-name).
var ghRoot = '/fend-optimization';
// CSS selectors ignored by uncss.
var uncssIgnoredSelectors = [
  '.mover'
];
// Path to page tested by psi.
var psiPath = '/';
// Cache-control values for local server.
var cacheControlValues = {
  // Set value by path to resource. Overrides type.
  //  Example: '/views/foo.jpg': 'max-age="600"'
  path: {},
  // Set value by resource file extension.
  //  Example: 'jpg': 'max-age=31536000'
  ext: {
    'png': 'max-age=31536000',
    'jpg': 'max-age=31536000',
    'js': 'max-age=31536000',
    'css': 'max-age=31536000',
    'html': 'no-cache'
  }
};


/* File globs. */
var htmlFiles = '**/*.html';
var cssFiles = '**/*.css';
var jsFiles = '**/*.js';
var imageFiles = '**/' + IMAGE + '/**';
var audioFiles = '**/' + AUDIO + '/**';
var videoFiles = '**/' + VIDEO + '/**';
var vendorFiles = '**/' + VENDOR + '/**';
var bowerFiles = 'bower_components/**';
var lintableJS = [
  'gulpfile.js',
  SRC + jsFiles,
  '!' + SRC + vendorFiles
];
var lintableJSON = [
  'package.json',
  'bower.json',
  SRC + '**/*.json',
  '!' + SRC + vendorFiles
];


/* Plugins. */
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var del = require('del');
var ghPages = require('gulp-gh-pages');
var gulpif = require('gulp-if');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var jsonlint = require('gulp-jsonlint');
var merge = require('merge-stream');
var path = require('path');
var plumber = require('gulp-plumber');
var pngquant = require('imagemin-pngquant');
var psi = require('psi');
var replace = require('gulp-replace');
var RevAll = require('gulp-rev-all');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var uncss = require('gulp-uncss');
var url = require('url');
var useref = require('gulp-useref');


/* Custom useref blocks. */
function csschanged(content, target, options, alternateSearchPath) {
  // TODO: Handle alternateSearchPath.
  if (options) {
    return '<link rel="stylesheet" href="' + target + '" ' + options + '>';
  } else {
    return '<link rel="stylesheet" href="' + target + '">';
  }
}

function jschanged(content, target, options, alternateSearchPath) {
  // TODO: Handle alternateSearchPath.
  if (options) {
    return '<script src="' + target + '" ' + options + '></script>';
  } else {
    return '<script src="' + target + '"></script>';
  }
}


/* Custom middleware for setting cache-control headers on local server. */
function middleware(req, res, cb) {
  // The path to the requested file.
  var filePath = url.parse(req.url).pathname;
  // The extension of the requested file (if no extension, assume .html).
  var fileExt = path.extname(req.url) || '.html';

  // Set cache-control value by path if specified.
  if (cacheControlValues.path.hasOwnProperty(filePath)) {
    res.setHeader('cache-control', cacheControlValues.path[filePath]);
  }
  // Else, set by extension if specified (with or without prefixed dot).
  else if (cacheControlValues.ext.hasOwnProperty(fileExt) ||
           cacheControlValues.ext.hasOwnProperty(fileExt.slice(1))) {
    res.setHeader('cache-control', cacheControlValues.ext[fileExt] ||
                                   cacheControlValues.ext[fileExt.slice(1)]);
  }

  cb();
}


/* Gulp tasks. */
gulp.task('lint:js', function() {
  return gulp.src(lintableJS)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint:json', function() {
  return gulp.src(lintableJSON)
    .pipe(jsonlint())
    .pipe(jsonlint.reporter());
});

gulp.task('lint', ['lint:js', 'lint:json'], function() {
  gulp.watch(lintableJS, ['lint:js']);
  gulp.watch(lintableJSON, ['lint:json']);
});

gulp.task('clean:tmp', function() {
  return del([TMP]);
});

gulp.task('clean:dest', function() {
  return del([DEST]);
});

gulp.task('clean', ['clean:tmp', 'clean:dest']);

gulp.task('prep', ['clean'], function() {
  return merge(
    gulp.src(SRC + htmlFiles)
      .pipe(useref({
        // Custom block for case where build:css was already used on content.
        csschanged: csschanged,
        // Custom block for case where build:js was already used on content.
        jschanged: jschanged
      }))
      .pipe(gulp.dest(TMP)),
    gulp.src([SRC + imageFiles, SRC + audioFiles, SRC + videoFiles])
      .pipe(gulp.dest(TMP))
  );
});

gulp.task('minify:html', function() {
  return gulp.src(TMP + htmlFiles)
    .pipe(plumber())
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true,  // uglify
      minifyCSS: true  // clean-css
    }))
    .pipe(gulp.dest(TMP));
});

gulp.task('minify:css', function() {
  return gulp.src(TMP + cssFiles)
    .pipe(plumber())
    .pipe(uncss({
      html: [TMP + htmlFiles],
      ignore: uncssIgnoredSelectors
    }))
    .pipe(cssnano())
    .pipe(gulp.dest(TMP));
});

gulp.task('minify:js', function() {
  return gulp.src(TMP + jsFiles)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(TMP));
});

gulp.task('minify:images', function() {
  return gulp.src(TMP + imageFiles)
    .pipe(plumber())
    .pipe(imagemin({
      use: [pngquant()]  // Better compression than optipng.
    }))
    .pipe(gulp.dest(TMP));
});

// gulp.task('minify:audio', function() {
//   return gulp.src(TMP + audioFiles)
//     // TODO: Optimize audio files.
//     .pipe(gulp.dest(TMP));
// });

// gulp.task('minify:video', function() {
//   return gulp.src(TMP + videoFiles)
//     // TODO: Optimize video files.
//     .pipe(gulp.dest(TMP));
// });

gulp.task('minify', function(cb) {
  runSequence(
    ['minify:html', 'minify:css', 'minify:js'],
    'minify:images',
    cb
  );
});

gulp.task('build:finalize', function() {
  var revAll = new RevAll({
    dontRenameFile: [
      /^\/favicon\.ico$/g,  // Don't fingerprint the favicon.ico file.
      '.html'               // Don't fingerprint .html files.
    ],
    dontUpdateReference: [
      /^\/favicon\.ico$/g,  // Don't update references to the favicon.ico file.
      '.html'               // Don't update references to .html files.
    ]
  });

  return merge(
    gulp.src(TMP + '**')
      .pipe(revAll.revision())
      .pipe(gulp.dest(DEST)),
    gulp.src(bowerFiles)
      .pipe(gulp.dest(DEST + 'bower_components/'))
  );
});

gulp.task('build', ['prep'], function(cb) {
  runSequence(
    'minify',
    'build:finalize',
    'clean:tmp',
    cb
  );
});

gulp.task('serve', function(cb) {
  browserSync.init({
    server: {
      baseDir: SRC,
      routes: {
        '/bower_components': './bower_components'
      },
      // middleware: middleware
    },
    browser: browsers,
    notify: false,  // Prevents pop-over notifications in the browser.
    minify: false   // Prevents minification of client-side JS.
  }, cb);

  gulp.watch([SRC + '**', bowerFiles], browserSync.reload);
});

gulp.task('serve:dest', function(cb) {
  browserSync.init({
    server: {
      baseDir: DEST,
      middleware: middleware
    },
    browser: browsers,
    notify: false,  // Prevents pop-over notifications in the browser.
    minify: false   // Prevents minification of client-side JS.
  }, cb);

  gulp.watch(DEST + '**', browserSync.reload);
});

gulp.task('serve:tunnelled', function(cb) {
  browserSync.init({
    server: {
      baseDir: DEST,
      // Uncomment below to serve SRC files instead.
      // baseDir: SRC,
      // routes: {
      //   '/bower_components': './bower_components'
      // },
      middleware: middleware
    },
    open: false,    // Prevents opening in browser.
    tunnel: true,    // Tunnel the server through a random public url.
    snippetOptions: {
      rule: {
        match: /^qq0qqQ5qqQqq5qq1qQqq\.qqq\)Qqq$/  // Prevents snippet injection (match should never be found).
      }
    }
  }, cb);
});

gulp.task('psi:desktop', ['serve:tunnelled'], function() {
  var site = browserSync.instance.tunnel.url;
  // Ensure http protocol is used to avoid breaking resources.
  site = site.replace(/^https?/, 'http');
  // Add user-defined path.
  site = site + (psiPath || '');

  return psi.output(site, {
    nokey: 'true',
    strategy: 'desktop',
    threshold: 1  // Prevents error if score is below default of 70.
  });
});

gulp.task('psi:mobile', ['serve:tunnelled'], function() {
  var site = browserSync.instance.tunnel.url;
  // Ensure http protocol is used to avoid breaking resources.
  site = site.replace(/^https?/, 'http');
  // Add user-defined path.
  site = site + (psiPath || '');

  return psi.output(site, {
    nokey: 'true',
    strategy: 'mobile',
    threshold: 1  // Prevents error if score is below default of 70.
  });
});

gulp.task('psi', ['psi:desktop', 'psi:mobile'], function() {
  console.log('Terminating psi task...');
  browserSync.exit();
  process.exit(0);
});

gulp.task('deploy:gh-pages', function() {
  // Github Pages resolves absolute urls to username.github.io instead of
  // username.github.io/project-name. Resolved by appending the project-name to
  // any absolute urls to resources found in .html files.
  //   This resolution only applies to src="" and href="" urls. Any other urls
  //   will still need to be relative.

  var resources = /(href|src)=('|")([^'|"]+)\2/gi;

  return gulp.src(DEST + '**')
    .pipe(gulpif('**/*.html', replace(resources, function(match, attribute, quotes, url, offset, string) {
      // If the path isn't absolute, don't modify anything.
      if (!path.isAbsolute(url)) {
        return match;
      }

      // Append the desired root to the beginning of the absolute path.
      var newUrl = path.join(ghRoot, url);

      return match.replace(url, newUrl);
    })))
    .pipe(ghPages());
});

gulp.task('default', ['lint', 'serve']);
