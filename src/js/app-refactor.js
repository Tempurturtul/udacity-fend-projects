$(document).ready(function() {
  var model = {
    init: function() {
      this.locations = gatherLocations();

      function gatherLocations() {
        var locations = [];

        locations.push(this.getBio().contacts.location);

        this.getWork().jobs.forEach(function(job) {
          locations.push(job.location);
        });

        this.getEducation().schools.forEach(function(school) {
          if (school.location && school.location !== 'Online') {
            locations.push(school.location);
          }
        });

        // Remove duplicates.
        locations = locations.reduce(function(acc, curr) {
          if (acc.indexOf(curr) === -1) {
            acc.push(curr);
          }
          return acc;
        }, []);

        return locations;
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
        'This resume was last updated in January of 2016. Please don\'t hesitate to ' +
        'contact me!',
        'skills' : [
          'HTML',
          'CSS',
          'JavaScript',
          'jQuery',
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
            'title': 'Frogger Clone',
            'dates': 'January 2016',
            'description': 'A clone of the popular frogger game built using ' +
            'a barebones game engine provided by Udacity. I worked heavily with ' +
            'the HTML5 canvas element and used JavaScript inheritance, the ' +
            'browser\'s local storage, and the Web Audio API. The game features a ' +
            'persistent scoreboard, menus, canvas-drawn buttons, and mobile support.',
            'images': [
              'img/fend-frogger-start.png',
              'img/fend-frogger-gameplay.png',
              'img/fend-frogger-scores.png'
            ],
            'github': 'https://github.com/Tempurturtul/fend-frogger',
            'url': 'http://tempurturtul.github.io/fend-frogger/'
          },
          {
            'title': 'Resume',
            'dates': 'December 2015',
            'description': 'My online resume for web development (which you are ' +
            'currently viewing). It dynamically creates page content with data ' +
            'retrieved from a JSON object. I utilized CSS transitions, a Polymer ' +
            'element, and Google Maps\' API to provide additional functionality. I ' +
            'also expanded my workflow options with this project by learning to ' +
            'use Bower and by refining my usage of Gulp.',
            'images': [
              'img/fend-resume-top.png',
              'img/fend-resume-mid.png',
              'img/fend-resume-bot.png'
            ],
            'github': 'https://github.com/Tempurturtul/fend-resume',
            'url': 'http://tempurturtul.github.io/fend-resume/'
          },
          {
            'title': 'Portfolio',
            'dates': 'November 2015',
            'description': 'A web development portfolio built as the first ' +
            'project in Udacity\'s Front-End Web Development Nanodegree program. ' +
            'It features a navigation bar that docks to the top of the window and ' +
            'indicates the section currently being viewed, and a contact form that ' +
            'uses the Mandrill API to send emails to my inbox.',
            'images': [
              'img/fend-portfolio-top.png',
              'img/fend-portfolio-work.png',
              'img/fend-portfolio-contact.png'
            ],
            'github': 'https://github.com/Tempurturtul/fend-portfolio',
            'url': 'http://tempurturtul.github.io/fend-portfolio/'
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
            'optimized for security and performance."'
          },
          {
            'name': 'Central Penn College',
            'location': 'Harrisburg, PA',
            'degree': 'BS',
            'majors': ['Security Management'],
            'dates': 2011,
            'url': 'http://www.centralpenn.edu/',
            'description': 'An accelerated four-year degree program focusing on ' +
            'intelligence analysis, management, and police work. I obtained an ' +
            'Intelligence Analysis certificate and completed a 400-hour internship ' +
            'with a local police department as part of the degree program. ' +
            'Graduated Magna Cum Laude with a 3.7 GPA.'
          }
        ],
        'onlineCourses': [
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
            'url': 'http://nodeschool.io/#workshopper-list',
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
    }
  };

  var view = {
    init: function() {
      bioView.init();
      workView.init();
      projectsView.init();
      educationView.init();
      locationsView.init();
    },

    bioView: {
      init: function() {

      }
    },

    workView: {
      init: function() {

      }
    },

    projectsView: {
      init: function() {

      }
    },

    educationView: {
      init: function() {

      }
    },

    locationsView: {
      init: function() {

      }
    }
  };

  octopus.init();
});
