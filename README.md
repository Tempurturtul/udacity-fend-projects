# fend-optimization

This is the fourth project in Udacity's [Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001) program. It provides a portfolio website that must be optimized.

**[View live site.](http://tempurturtul.github.io/fend-optimization/)**

## Project Notes

Source code may be found in the `src` directory. Distribution files are created automatically in a `dist` directory by the `gulp build` task. See `gulpfile.js` if interested in details regarding gulp tasks.

Distribution files may also be viewed on the [gh-pages](https://github.com/Tempurturtul/fend-optimization/tree/gh-pages) branch, or by inspecting the live site.

## Optimization Process
1. Concatenated appropriate js and css files (only applied to two css files used in `/views/pizza.html`).
1. Minified css, js, html, and images using gulp tasks.
1. Applied `media` and `async` attributes where appropriate.
1. Moved google analytics scripts to end of body.
1. Refactored `views/js/main.js`.
1. Replaced pizzeria thumbnail with resized image.
1. Replaced remotely hosted thumbnails with locally hosted versions. (Allowing image optimization and manipulation of cache-control.)
1. Set cache-control max-age to 1 year for locally hosted, non-html resources.
1. Applied finger-prints to cached locally hosted, non-html resources.
1. Inlined critical and other appropriate css.
1. Removed use of google fonts.
