# fend-optimization

This is the **4th** project in Udacity's [Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001) program. It provides a portfolio website that must be optimized to achieve a high [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) score and steady FPS.

**[View completed project here.](http://tempurturtul.github.io/fend-optimization/)**

## Optimization Process
1. Concatenated appropriate `.js` and `.css` files.
1. Minified `.css`, `.js`, `.html`, and images.
1. Applied `media` and `async` attributes where appropriate.
1. Moved google analytics scripts to end of body.
1. Refactored `views/js/main.js`.
1. Replaced pizzeria thumbnail with a resized image.
1. Replaced remotely hosted thumbnails with locally hosted versions (allowing image optimization and manipulation of `cache-control` headers).
1. Set `cache-control` `max-age` to 1 year for appropriate resources.
1. Applied finger-prints to appropriate resources.
1. Inlined critical and other appropriate `.css`.
1. Removed use of google fonts.

## Quickstart

- Install [Node](https://nodejs.org/en/) and [Gulp](http://gulpjs.com/).
- Clone this repository and install dependencies.
```
  git clone https://github.com/Tempurturtul/fend-optimization.git
  cd fend-optimization/
  npm install
```
- Run the desired gulp task. *(See `gulpfile.js` for additional tasks.)*
```
  gulp # Lints then serves source files.
  gulp build # Builds distribution files.
  gulp serve:dest # Serves distribution files.
  gulp psi # Displays the PageSpeed Insights report. (Modify the psiPath variable in gulpfile.js to test different pages.)
```

## Known Issues

- `gulp build` sometimes returns an error related to file streams being manipulated by `gulp-imagemin` closing too early. Resolve by re-running the `gulp build` task.
