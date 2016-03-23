$(document).ready(function() {
  var model = {
    init: function() {
      this.locations = gatherLocations();

      function gatherLocations() {
        var places = [];

        places.push(model.getBio().contacts.location);

        model.getWork().jobs.forEach(function(job) {
          places.push(job.location);
        });

        model.getEducation().schools.forEach(function(school) {
          if (school.location && school.location !== 'Online') {
            places.push(school.location);
          }
        });

        // Remove duplicates.
        places = places.reduce(function(acc, curr) {
          if (acc.indexOf(curr) === -1) {
            acc.push(curr);
          }
          return acc;
        }, []);

        return {
          places: places
        };
      }
    },

    getBio: function() {
      return {
        'name' : 'Matthew Feidt',
        'role' : 'Web Developer',
        'contacts' : {
          'mobile' : '717-303-9839',
          'email' : 'tempurturtul@gmail.com',
          'github' : 'https://github.com/Tempurturtul',
          'twitter' : 'https://twitter.com/tempurturtul',
          'location' : 'Massena, NY'
        },
        'welcomeMessage' : 'I\'m currently seeking employment as a front-end web ' +
        'developer and am happy to relocate as necessary within the United States. ' +
        'Please don\'t hesitate to contact me! This resume was last updated in ' +
        'March of 2016.',
        'skills' : [
          'HTML',
          'CSS',
          'JavaScript',
          'jQuery',
          'Knockout',
          'AngularJS',
          'Node.js',
          'Gulp'
        ],
        'biopic' : 'img/self.png'
      };
    },

    getWork: function() {
      return {
        'jobs': [
          {
            'employer': 'U.S. Government',
            'title': 'Security Officer',
            'location': 'Massena, NY',
            'dates': '2012 - Current',
            'description': 'I gained this position shortly after graduating from ' +
            'college. I perform critical security work requiring strict adherence ' +
            'to a set of Standard Operating Procedures, am entrusted with ' +
            'Sensitive Security Information, and am required to constantly adapt ' +
            'to an evolving threat environment. Due to my high performance, I\'ve ' +
            'been directed to fulfill supervisory and peer-mentoring roles on ' +
            'multiple occasions.'
          }
        ]
      };
    },

    getProjects: function() {
      return {
        'projects': [
          {
            'title': 'Optimization',
            'dates': 'February 2016',
            'description': 'Given a poorly optimized website, I was tasked with ' +
            'optimizing the site to achieve a high PageSpeed Insights score and ' +
            'consistently high FPS. Optimization techniques used include concatenating ' +
            'and minifying files, inlining critical css, modifying cache-control ' +
            'headers, and refactoring JavaScript. The full optimization process ' +
            'is detailed in the GitHub repository for this project.',
            'images': [
              'img/fend-optimization-home.png',
              'img/fend-optimization-game.png',
              'img/fend-optimization-pizzeria.png'
            ],
            'github': 'https://github.com/Tempurturtul/fend-optimization',
            'url': 'https://tempurturtul.github.io/fend-optimization/'
          },
          {
            'title': 'Frogger Clone',
            'dates': 'January 2016',
            'description': 'A clone of the popular frogger game built using a ' +
            'barebones game engine provided by Udacity. I worked heavily with ' +
            'the HTML5 canvas element in this project, and used JavaScript ' +
            'inheritance, the browser\'s local storage, and the Web Audio API ' +
            'while implementing various features. The game features a persistent ' +
            'scoreboard, menus, canvas-drawn buttons, and mobile support.',
            'images': [
              'img/fend-frogger-start.png',
              'img/fend-frogger-gameplay.png',
              'img/fend-frogger-scores.png'
            ],
            'github': 'https://github.com/Tempurturtul/fend-frogger',
            'url': 'https://tempurturtul.github.io/fend-frogger/'
          },
          {
            'title': 'Resume',
            'dates': 'December 2015',
            'description': 'My online resume for web development (which you are ' +
            'currently viewing). It dynamically creates page content with data ' +
            'retrieved from a JSON object, allowing me to make quick and easy ' +
            'edits and updates. I utilized CSS transitions, a Polymer ' +
            'element, and Google Maps\' API to provide additional functionality. I ' +
            'also expanded my workflow options with this project by learning to ' +
            'use Bower and by refining my usage of Gulp. I refactored the project ' +
            'two months after completing it to use a Model-View-Controller design ' +
            'pattern as part of Udactiy\'s JavaScript Design Patterns course.',
            'images': [
              'img/fend-resume-top.png',
              'img/fend-resume-mid.png',
              'img/fend-resume-bot.png'
            ],
            'github': 'https://github.com/Tempurturtul/fend-resume',
            'url': 'https://tempurturtul.github.io/fend-resume/'
          },
          {
            'title': 'Portfolio',
            'dates': 'November 2015',
            'description': 'A web development portfolio built as the first ' +
            'project in Udacity\'s Front-End Web Development Nanodegree program. ' +
            'It features a navigation bar that docks to the top of the window and ' +
            'indicates the section currently being viewed, and a contact form that ' +
            'originally used the Mandrill API to send emails to my inbox. Mandrill ' +
            'ended support for their free-tier accounts in April 2016, at which ' +
            'point I migrated the contact form to Formspree.',
            'images': [
              'img/fend-portfolio-top.png',
              'img/fend-portfolio-work.png',
              'img/fend-portfolio-contact.png'
            ],
            'github': 'https://github.com/Tempurturtul/fend-portfolio',
            'url': 'https://tempurturtul.github.io/fend-portfolio/'
          },
          {
            'title': 'Twitch Streamers - Angular Refactor',
            'dates': 'October 2015',
            'description': 'An old project refactored to use AngularJS, incomplete ' +
            'but functional. Features the ability to add, remove, sort, and filter ' +
            'tracked streamers. I learned AngularJS best practices by following ' +
            'John Papa\'s Angular Style Guide while working on this project. ' +
            'I also experimented with a testing framework using Karma, Mocha, and ' +
            'PhantomJS; and used Vagrant to create a portable, reproducible ' +
            'development environment.',
            'images': [],
            'github': 'https://github.com/Tempurturtul/fcc-twitch-streamers/tree/angular-refactor',
            'url': ''
          }
        ]
      };
    },

    getEducation: function() {
      return {
        'schools': [
          {
            'name': 'Udacity',
            'location': 'Online',
            'degree': 'Nanodegree',
            'majors': ['Front-End Web Developer'],
            'dates': 2016,
            'url': 'https://www.udacity.com/nanodegree',
            'description': 'A miniature degree program developed by Udacity in ' +
            'partnership with AT&T, Google, Hack Reactor, and GitHub. Designed to ' +
            'give graduates the ability to build "beautiful, responsive websites ' +
            'optimized for security and performance." I completed multiple projects ' +
            'as part of this nanodegree, including projects focusing on optimization, ' +
            'design patterns, and refactoring.'
          },
          {
            'name': 'Central Penn College',
            'location': 'Harrisburg, PA',
            'degree': 'BS',
            'majors': ['Security Management'],
            'dates': 2011,
            'url': 'https://www.centralpenn.edu/',
            'description': 'An accelerated four-year degree program focusing on ' +
            'intelligence analysis, management, and police work. I obtained an ' +
            'Intelligence Analysis certificate and completed a 400-hour internship ' +
            'with a local police department as part of the degree program. ' +
            'Graduated Magna Cum Laude with a 3.7 GPA.'
          }
        ],
        'onlineCourses': [
          {
            'title': 'JavaScript Design Patterns',
            'school': 'Udacity',
            'date': 2016,
            'url': 'https://www.udacity.com/course/javascript-design-patterns--ud989-nd',
            'description': 'Required as part of Udacity\'s Front-End Web Developer ' +
            'nanodegree. Teaches methods for organizing code and the importance of ' +
            'separating concerns. Introduces the Model-View-* organizational ' +
            'method and the Knockout and Backbone frameworks. Also covers refactoring ' +
            'unorganized code and working with an unknown codebase.'
          },
          {
            'title': 'JavaScript Basics',
            'school': 'Udacity',
            'date': 2015,
            'url': 'https://www.udacity.com/course/javascript-basics--ud804',
            'description': 'Required as part of Udacity\'s Front-End Web Developer ' +
            'nanodegree. Focused on data types and flow control, and directed the ' +
            'development of this resume site.'
          },
          {
            'title': 'Workshoppers',
            'school': 'NodeSchool',
            'date': 2015,
            'url': 'https://nodeschool.io/#workshopper-list',
            'description': 'Learned essential skills for working with Node.js. ' +
            'Various topics covered such as Git and Github, asynchronous i/o, ' +
            'npm modules, streams, express.js framework basics, promises, MongoDB ' +
            'basics, debugging skills, and testing.'
          },
          {
            'title': 'Programming Languages',
            'school': 'Univeristy of Washington',
            'date': 2014,
            'url': 'https://www.coursera.org/course/proglang',
            'description': 'Learned many of the concepts fundamental to all ' +
            'programming languages. Used both functional programming and ' +
            'object-oriented programming, and worked with SML, Racket, and Ruby. ' +
            'Explored the key issues in designing and using programming languages, ' +
            'including discussions on modularity and both static and dynamic ' +
            'typing.'
          },
          {
            'title': 'HTML5 and CSS3 Fundamentals',
            'school': 'Microsoft Virtual Academy',
            'date': 2014,
            'url': 'https://mva.microsoft.com/en-US/training-courses/html5-css3-fundamentals-development-for-absolute-beginners-14207',
            'description': 'Learned the fundamentals of web development with HTML5 and CSS3.'
          }
        ]
      };
    },

    getLocations: function() {
      return this.locations;
    }
  };

  var octopus = {
    init: function() {
      model.init();
      view.init();
    },

    getBio: function() {
      return model.getBio();
    },

    getWork: function() {
      return model.getWork();
    },

    getProjects: function() {
      return model.getProjects();
    },

    getEducation: function() {
      return model.getEducation();
    },

    getLocations: function() {
      return model.getLocations();
    }
  };

  var view = {
    init: function() {
      this.bioView.init();
      this.workView.init();
      this.projectsView.init();
      this.educationView.init();
      this.locationsView.init();

      this.popup = popup;
      this.toggleIronCollapse = toggleIronCollapse;
      this.invertFAIconDirection = invertFAIconDirection;

      // On collapse-button click...
      $('.collapse-button').click(function() {
        var $targetCollapse;
        var $faIcon = $(this).find('.fa');

        if ($(this).hasClass('collapse-prev')) {
          $targetCollapse = $(this).prev('iron-collapse');
        } else {
          $targetCollapse = $(this).next('iron-collapse');
        }

        toggleIronCollapse($targetCollapse);
        invertFAIconDirection($faIcon);
      });

      // On protective-overlay click...
      $('.protective-overlay').click(function() {
        $(this).hide();
      });

      // On protective-overlay's parent mouse-leave...
      $('.protective-overlay').parent().mouseleave(function() {
        $(this).children('.protective-overlay').show();
      });

      // TODO: Keep popup in desired position on window resize.
      // TODO: Keep popup from going beyond 100% height or width.
      /**
       * Creates a dismissable popup message at the given position.
       * @param {string} msg
       * @param {Object} pos
       * @param {number} pos.x
       * @param {number} pos.y
       */
      function popup(msg, pos) {
        var $body = $('body');

        // If the body is wider than 300 px...
        if ($body.width() >= 300) {
          // If the popup would extend beyond the edge of the body...
          if (pos.x + 300 > $body.width()) {
            // Reposition the popup so it doesn't extend beyond the edge of the body.
            pos.x = $body.width() - 300;
          }
        }
        // Otherwise...
        else {
          // Reposition the popup to the left edge of the body.
          pos.x = 0;
        }

        var popupClass = 'popup';
        var popupStyle = 'text-align: center;' +
                         'color: #333;' +
                         'background: white;' +
                         'border: solid 2px #444;' +
                         'border-radius: 5px;' +
                         'box-sizing: border-box;' +
                         'padding: 20px;' +
                         'width: 100%;' +
                         'max-width: 300px;' +
                         'position: absolute;' +
                         'top: ' + pos.y + 'px;' +
                         'left: ' + pos.x + 'px;' +
                         'cursor: pointer;' +
                         'font-weight: bold;' +
                         'font-size: 1rem;';
        var elem = '<div class="' + popupClass + '" style="' + popupStyle + '">' + msg + '</div>';

        // Dismiss existing popups.
        $body.children('.' + popupClass).remove();
        // Add new popup.
        $body.append(elem);
        // Dismiss popup on click.
        $('.' + popupClass).click(function() {
          $(this).remove();
        });
      }

      function toggleIronCollapse($collapse) {
        // The state of the iron-collapse element.
        var isOpened = $collapse.attr('opened');

        if (isOpened) {
          // Close the iron-collapse element.
          $collapse.removeAttr('opened');
        } else {
          // Open the iron-collapse element.
          $collapse.attr('opened', true);
        }
      }

      function invertFAIconDirection($faIcon) {
        var iconClasses = $faIcon.attr('class').split(' ');

        // For every class on the button's icon...
        iconClasses.forEach(function(iconClass) {
          var re = /fa-.*(up|down|left|right).*/.exec(iconClass);

          // If the class starts with fa- and has the word up, down, left, or right in it...
          if (re) {
            var newClass;

            if (re[1] === 'up') {
              newClass = iconClass.replace(/up/g, 'down');
            } else if (re[1] === 'down') {
              newClass = iconClass.replace(/down/g, 'up');
            } else if (re[1] === 'left') {
              newClass = iconClass.replace(/left/g, 'right');
            } else {
              newClass = iconClass.replace(/right/g, 'left');
            }

            // Replace the button's icon's class.
            $faIcon.removeClass(iconClass);
            $faIcon.addClass(newClass);
          }
        });
      }
    },

    bioView: {
      init: function() {
        var bio = octopus.getBio();

        var formattedName = helper.HTMLheaderName.replace(/%data%/g, bio.name);
        var formattedRole = helper.HTMLheaderRole.replace(/%data%/g, bio.role);
        var formattedMobile = helper.HTMLmobile.replace(/%data%/g, bio.contacts.mobile);
        var formattedEmail = helper.HTMLemail.replace(/%data%/g, bio.contacts.email);

        // Replace %url-data% with the full bio.contacts.github value.
        var formattedGithub = helper.HTMLgithub.replace(/%url-data%/g, bio.contacts.github)
        // Replace %data% with the substring occuring after the last '/' in bio.contacts.github.
                                               .replace(/%data%/g, bio.contacts.github.slice(bio.contacts.github.lastIndexOf('/') + 1));

        // Replace %url-data% with the full bio.contacts.twitter value.
        var formattedTwitter = helper.HTMLtwitter.replace(/%url-data%/g, bio.contacts.twitter)
        // Replace %data% with the substring occuring after the last '/' in bio.contacts.twitter.
                                                 .replace(/%data%/g, bio.contacts.twitter.slice(bio.contacts.twitter.lastIndexOf('/') + 1));


        var formattedLocation = helper.HTMLlocation.replace(/%data%/g, bio.contacts.location);
        var formattedBioPic = helper.HTMLbioPic.replace(/%data%/g, bio.biopic);
        var formattedWelcomeMsg = helper.HTMLwelcomeMsg.replace(/%data%/g, bio.welcomeMessage);

        $('header').prepend(formattedRole)
                   .prepend(formattedName)
                   .append(formattedBioPic);
        $('header .row:last').append(formattedWelcomeMsg);
        $('.contacts-list').append(formattedMobile)
                           .append(formattedEmail)
                           .append(formattedGithub)
                           .append(formattedTwitter)
                           .append(formattedLocation);

        if (bio.skills.length) {
          $('header').append(helper.HTMLskillsStart);

          bio.skills.forEach(function(skill) {
            var formattedSkill = helper.HTMLskills.replace(/%data%/g, skill);
            $('#skills').append(formattedSkill);
          });
        }
      }
    },

    workView: {
      init: function() {
        var work = octopus.getWork();

        work.jobs.forEach(function(job) {
          $('#work-experience').append(helper.HTMLworkStart);

          var formattedWorkTitle = helper.HTMLworkTitle.replace(/%data%/g, job.title);
          var formattedWorkEmployer = helper.HTMLworkEmployer.replace(/%data%/g, job.employer);
          var formattedWorkDates = helper.HTMLworkDates.replace(/%data%/g, job.dates);
          var formattedWorkLocation = helper.HTMLworkLocation.replace(/%data%/g, job.location);
          var formattedWorkDescription = helper.HTMLworkDescription.replace(/%data%/g, job.description);

          $('.work-entry:last').append(formattedWorkEmployer + formattedWorkTitle)
                               .append(formattedWorkDates);
          $('.work-entry:last .row:last').append(formattedWorkLocation);
          $('.work-entry:last').append(formattedWorkDescription);
        });

        // On .work-entry h3 click...
        $('.work-entry > h3').click(function(e) {
          var msg = 'Please contact me directly if you would like more details ' +
          'regarding this position.';
          var pos = {
            x: e.pageX,
            y: e.pageY
          };

          view.popup(msg, pos);
        });
      }
    },

    projectsView: {
      init: function() {
        var projects = octopus.getProjects();

        projects.projects.forEach(function(project) {
          $('#projects').append(helper.HTMLprojectStart);

          var formattedProjectTitle;

          // If additional project.url data is present...
          if (project.url) {
            formattedProjectTitle = helper.HTMLprojectTitleWithUrl.replace(/%data%/g, project.title).replace(/%url-data%/g, project.url);
          } else {
            formattedProjectTitle = helper.HTMLprojectTitle.replace(/%data%/g, project.title);
          }

          var formattedProjectDates = helper.HTMLprojectDates.replace(/%data%/g, project.dates);
          var formattedProjectDescription = helper.HTMLprojectDescription.replace(/%data%/g, project.description);

          $('.project-entry:last').append(formattedProjectTitle)
                                  .append(formattedProjectDates);

          // If additional project.github data is present...
          if (project.github) {
            var formattedProjectGithub = helper.HTMLprojectGithub.replace(/%data%/g, project.github);

            $('.project-entry:last .row:last').append(formattedProjectGithub);
          }

          $('.project-entry:last').append(formattedProjectDescription);

          if (project.images.length) {
            $('.project-entry:last').append(helper.HTMLprojectImageStart);

            project.images.forEach(function(image) {
              var formattedProjectImage = helper.HTMLprojectImage.replace(/%data%/g, image);
              $('.project-images:last').append(formattedProjectImage);
            });
          }
        });
      }
    },

    educationView: {
      init: function() {
        var education = octopus.getEducation();

        education.schools.forEach(function(school) {
          $('#education').append(helper.HTMLschoolStart);

          var formattedSchoolName = helper.HTMLschoolName.replace(/%data%/g, school.name)
                                                         .replace(/%url-data%/g, school.url);
          var formattedSchoolDegree = helper.HTMLschoolDegree.replace(/%data%/g, school.degree);
          var formattedSchoolDates = helper.HTMLschoolDates.replace(/%data%/g, school.dates);
          var formattedSchoolLocation = helper.HTMLschoolLocation.replace(/%data%/g, school.location);

          $('.education-entry:last').append(formattedSchoolName + formattedSchoolDegree)
                                    .append(formattedSchoolDates);
          $('.education-entry:last .row:last').append(formattedSchoolLocation);

          if (school.majors.length) {
            var formattedSchoolMajor = helper.HTMLschoolMajor.replace(/%data%/g, school.majors.join(', '));
            $('.education-entry:last').append(formattedSchoolMajor);
          }

          // Optional school description.
          if (school.description) {
            var formattedSchoolDescription = helper.HTMLschoolDescription.replace(/%data%/g, school.description);
            $('.education-entry:last').append(formattedSchoolDescription);
          }
        });

        if (education.onlineCourses.length) {
          $('#education').append(helper.HTMLonlineClasses);

          education.onlineCourses.forEach(function(course) {
            $('#education').append(helper.HTMLschoolStart);

            var formattedCourseTitle = helper.HTMLonlineTitle.replace(/%data%/g, course.title)
                                                      .replace(/%url-data%/g, course.url);
            var formattedCourseSchool = helper.HTMLonlineSchool.replace(/%data%/g, course.school);
            var formattedCourseDate = helper.HTMLonlineDate.replace(/%data%/g, course.date);

            $('.education-entry:last').append(formattedCourseTitle + formattedCourseSchool)
                                      .append(formattedCourseDate);

            // Optional course description.
            if (course.description) {
              var formattedCourseDescription = helper.HTMLonlineDescription.replace(/%data%/g, course.description);
              $('.education-entry:last').append(formattedCourseDescription);
            }
          });
        }
      }
    },

    locationsView: {
      init: function() {
        var locations = octopus.getLocations();

        $('#places').append(helper.HTMLmap);

        // An overlay on the map to prevent the user from interacting with it unintentionally.
        // Clicking hides until mouse leaves map area.
        $('#map-container').append(helper.HTMLprotectiveOverlay);

        var map = new google.maps.Map(document.querySelector('#map'), {disableDefaultUI: true});
        var service = new google.maps.places.PlacesService(map);
        var bounds = new google.maps.LatLngBounds();

        window.addEventListener('resize', function() {
          map.fitBounds(bounds);
        });

        locations.places.forEach(function(place) {
          service.textSearch({query: place}, handleResults);
        });

        function handleResults(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            createMapMarker(results[0]);
          } else {
            console.error(status);
          }
        }

        function createMapMarker(placeData) {
          var lat = placeData.geometry.location.lat();
          var lng = placeData.geometry.location.lng();
          var name = placeData.formatted_address;

          var marker = new google.maps.Marker({
            map: map,
            position: placeData.geometry.location,
            title: name
          });

          var infoWindow = new google.maps.InfoWindow({
            content: name
          });

          marker.addListener('click', function() {
            infoWindow.open(map, marker);
          });

          bounds.extend(new google.maps.LatLng(lat, lng));
          map.fitBounds(bounds);
          map.setCenter(bounds.getCenter());
        }
      }
    }
  };

  octopus.init();
});
