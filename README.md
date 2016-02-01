# fend-optimization

This is the fourth project in Udacity's [Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001) program. It provides a portfolio website that must be optimized.

## Project Notes

Source code may be found in the `src` directory. Distribution files are created automatically in a `dist` directory by the `gulp build` task. See `gulpfile.js` for details regarding gulp tasks.

Distribution files may also be viewed on the [gh-pages](https://github.com/Tempurturtul/fend-optimization/tree/gh-pages) branch, or by inspecting the [live site](http://tempurturtul.github.io/fend-optimization/).

## Optimization Process

1. Unmodified source.
  ```
  Speed:      91 (78 mobile)
  (Usability: 100 mobile)

  CSS size                                   | 3.34 kB
  HTML size                                  | 5.63 kB
  Image size                                 | 29.27 kB
  JavaScript size                            | 164.78 kB
  CSS resources                              | 3
  Hosts                                      | 7
  JS resources                               | 3
  Resources                                  | 35 (34 mobile)
  Static resources                           | 5
  Other size                                 | 42.86 kB (30.04 kB mobile)
  Total size of request bytes sent           | 4.77 kB (4.59 kB mobile)

  Enable GZIP compression                    | 0.15
  Leverage browser caching                   | 0.5 (0.75 mobile)
  Minify JavaScript                          | 0.33
  Minimize render blocking resources         | 6 (24 mobile)
  Optimize images                            | 0.98
  ```
1. Minified css, js, html, and images. Concatenated css and js files. Corrected 404'd image link.
  ```
  Speed:     92 [+1] (79 mobile [+1])
  (Usability: 100 mobile)

  CSS size                                   | 2.67 kB [-0.67]
  HTML size                                  | 5.08 kB [-0.55] (4.81 kB mobile [-0.82])
  Image size                                 | 19.53 kB [-9.74]
  JavaScript size                            | 164.53 kB [-0.25]
  CSS resources                              | 2 [-1]
  Hosts                                      | 7
  JS resources                               | 3
  Resources                                  | 34 [-1] (33 mobile [-1])
  Static resources                           | 5
  Other size                                 | 42.57 kB [-0.29] (30.04 kB mobile)
  Total size of request bytes sent           | 4.74 kB [-0.03] (4.53 kB mobile [-0.06])

  Enable GZIP compression                    | 0.12 [-0.03]
  Leverage browser caching                   | 0.5 (0.75 mobile)
  Minify JavaScript                          | 0.3 [-0.03]
  Minimize render blocking resources         | 6 (24 mobile)
  Optimize images                            | 0 [-0.98]
  ```
1. Separated print.css into media="print" style, applied async to appropriate js. Moved google analytics scripts to end of body. Corrected missing div closing tag. Removed unused css.
  ```
  Speed:     92 (79 mobile)
  (Usability: 100 mobile)

  CSS size                                   | 2.87 kB [+0.2]
  HTML size                                  | 4.34 kB [-0.74] (4.34 kB mobile [-0.47])
  Image size                                 | 19.53 kB
  JavaScript size                            | 164.53 kB
  CSS resources                              | 3 [+1]
  Hosts                                      | 7
  JS resources                               | 3
  Resources                                  | 28 [-6] (28 mobile [-5])
  Static resources                           | 5
  Other size                                 | 42.57 kB (29.75 kB mobile [-0.29])
  Total size of request bytes sent           | 3.63 kB [-1.11] (3.63 kB mobile [-0.9])

  Enable GZIP compression                    | 0.11 [-0.01]
  Leverage browser caching                   | 0.5 (0.75 mobile)
  Minify JavaScript                          | 0.3
  Minimize render blocking resources         | 6 (24 mobile)
  Optimize images                            | 0 [-0.98]
  ```
1. 
