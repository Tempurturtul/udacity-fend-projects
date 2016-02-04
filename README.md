# fend-optimization

This is the fourth project in Udacity's [Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001) program. It provides a portfolio website that must be optimized.

## Project Notes

Source code may be found in the `src` directory. Distribution files are created automatically in a `dist` directory by the `gulp build` task. See `gulpfile.js` for details regarding gulp tasks.

Distribution files may also be viewed on the [gh-pages](https://github.com/Tempurturtul/fend-optimization/tree/gh-pages) branch, or by inspecting the [live site](http://tempurturtul.github.io/fend-optimization/).

## Optimization Process
1. Concatenated appropriate js and css files (only applied to two css files used in `/views/pizza.html`).
1. Minified css, js, html, and images.
1. Applied `media` and `async` attributes where appropriate.
1. Where present, moved google analytics scripts to end of body.
1. Refactored `views/js/main.js`.
