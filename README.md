# fend-optimization

This is the fourth project in Udacity's [Front-End Web Developer Nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001) program. It provides a portfolio website that must be optimized.

## Project Notes

Source code may be found in the `src` directory.

I heavily automate optimization with [Gulp](http://gulpjs.com/). See `gulpfile.js` for details.

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
1. ...
  ```
  ```
