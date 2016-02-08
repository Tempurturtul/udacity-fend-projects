# fend-optimization

This is the fourth project in Udacity's [Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001) program. It provides a portfolio website that must be optimized.

**[View live site.](http://tempurturtul.github.io/fend-optimization/)**

## Project Notes

Source code may be found in the `src` directory. Distribution files are created automatically in a `dist` directory by the `gulp build` task. See `gulpfile.js` if interested in details regarding gulp tasks.

Distribution files may also be viewed on the [gh-pages](https://github.com/Tempurturtul/fend-optimization/tree/gh-pages) branch, or by inspecting the live site.

## Optimization Process
1. Concatenated appropriate js and css files.
1. Minified css, js, html, and images.
1. Applied `media` and `async` attributes where appropriate.
1. Moved google analytics scripts to end of body.
1. Refactored `views/js/main.js`.
1. Replaced pizzeria thumbnail with resized image.
1. Replaced remotely hosted thumbnails with locally hosted versions (allows image optimization and manipulation of `cache-control`).
1. Set `cache-control` `max-age` to 1 year for locally hosted, non-html resources.
1. Applied finger-prints to cached locally hosted, non-html resources.
1. Inlined critical and other appropriate css.
1. Removed use of google fonts.

## Local Setup

**Prerequisites**
- [Node](https://nodejs.org/en/)
- [Gulp](http://gulpjs.com/)

**Install dependencies.**
- In project directory: `npm install`.

**Run Gulp tasks.**
- `gulp`
  - Lints and serves source files. Use `ctrl-c` to interrupt.
- `gulp build`
  - Creates distribution files in `dist` directory.
- `gulp serve:dest`
  - Serves distribution files. Use `ctrl-c` to interrupt.
- `gulp psi`
  - Get PageSpeed Insights report for file specified by `psiPath` (default root).

## Known Issues

- `gulp build` sometimes returns an error related to file streams being manipulated by `gulp-imagemin` closing too early. Resolve by re-running the task.
