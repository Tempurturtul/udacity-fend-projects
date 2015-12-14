var bio = {
  'name' : 'Matthew Feidt',
  'role' : 'Web Developer',
  'contacts' : {
    'mobile' : '717-303-9839',
    'email' : 'tempurturtul@gmail.com',
    'github' : 'Tempurturtul',
    'twitter' : 'tempurturtul',
    'location' : 'Massena, NY'
  },
  'welcomeMessage' : 'This resume was built as part of the Udacity Front-End ' +
  'Web Developer nanodegree program. The method of construction and the ' +
  'majority of the styling for this site comes from a template provided by ' +
  'said program. Data presented here is accurate as of December 2015.',
  'skills' : [
    'HTML',
    'CSS',
    'JavaScript',
    'jQuery',
    'NodeJS',
    'AngularJS',
    'Polymer',
    'Git',
    'Gulp',
    'Grunt',
    'Vagrant'
  ],
  'biopic' : 'img/self.jpg'
};

var work = {
  'jobs': [
    {
      'employer': 'Government',
      'title': 'Security Officer',
      'location': 'Massena, NY',
      // 'employed': '2012 - Current',
      'dates': '2012 - Current',
      'description': 'Sensitive security work requiring routine background ' +
      'investigations, strict adherence to Standard Operating Procedures, ' +
      'and regular professional interaction with both stakeholders and the ' +
      'public. Supervisory and peer-mentoring roles fulfilled on multiple ' +
      'occasions at the request of managment.'
    }
  ]
};

var projects = {
  'projects': [
    {
      'title': 'Portfolio',
      // 'completed': 'November 2015',
      'dates': 'November 2015',
      'description': 'A web development portfolio built as the first project ' +
      'in Udacity\'s Front-End Web Development Nanodegree program.',
      'images': [
        'img/fend-portfolio-top.png',
        'img/fend-portfolio-work.png',
        'img/fend-portfolio-contact.png'
      ],
      'github': 'https://github.com/Tempurturtul/fend-resume',
      'url': 'http://tempurturtul.github.io/fend-portfolio/'
    }
  ]
};

var education = {
  'schools': [
    {
      'name': 'Central Penn College',
      'location': 'Harrisburg, PA',
      'degree': 'BS',
      'majors': ['Security Management'],
      // 'attended': '2008 - 2011',
      'dates': 2011,
      'url': 'http://www.centralpenn.edu/',
      'description': 'An accelerated four-year degree program focusing on ' +
      'intelligence analysis, management, and police work. Obtained an ' +
      'Intelligence Analysis certificate and completed a 400-hour internship ' +
      'with a local police department as part of the degree program. ' +
      'Graduated Magna Cum Laude with a 3.7 GPA.'
    }
  ],
  'onlineCourses': [
    {
      'title': 'Learn Python The Hard Way',
      'school': 'Zed A. Shaw',
      // 'completed': 'November 2013',
      'date': 2013,
      'url': 'http://learnpythonthehardway.org/book/',
      'description': '"Learn Python by slowly building and establishing skills through techniques like practice and memorization, then applying them to increasingly difficult problems. By the end of the book you will have the tools needed to begin learning more complex programming topics. I like to tell people that my book gives you your \'programming black belt.\' What this means is that you know the basics well enough to now start learning programming."'
    },
    {
      'title': 'HTML5 and CSS3 Fundamentals',
      'school': 'Microsoft Virtual Academy',
      // 'completed': 'February 2014',
      'date': 2014,
      'url': 'https://mva.microsoft.com/en-US/training-courses/html5-css3-fundamentals-development-for-absolute-beginners-14207',
      'description': 'Learn the fundamentals of web development with HTML5 and CSS3.'
    },
    {
      'title': 'Programming Languages',
      'school': 'Univeristy of Washington',
      // 'completed': 'December 2014',
      'date': 2014,
      'url': 'https://www.coursera.org/course/proglang',
      'description': '"Learn many of the concepts that underlie all programming languages. Use functional programming and contrast it with object-oriented programming. Through experience writing programs and studying three different languages, learn the key issues in designing and using programming languages, such as modularity and the complementary benefits of static and dynamic typing. This course is neither particularly theoretical nor just about programming specifics – it will give you a framework for understanding how to use language constructs effectively and how to design correct and elegant programs. By using different languages, you learn to think more deeply than in terms of the particular syntax of one language. The emphasis on functional programming is essential for learning how to write robust, reusable, composable, and elegant programs – in any language."'
    },
    {
      'title': 'JavaScript Basics',
      'school': 'Udacity',
      // 'completed': 'December 2015',
      'date': 2015,
      'url': 'https://www.udacity.com/course/javascript-basics--ud804',
      'description': 'Develop an interactive resume application that reads ' +
      'resume content from a JSON object and dynamically displays that ' +
      'content within a provided template. Focus on data types and flow ' +
      'control.'
    }
  ]
};

var locations = {};

bio.display = function() {
  var formattedName = HTMLheaderName.replace(/%data%/g, bio.name);
  var formattedRole = HTMLheaderRole.replace(/%data%/g, bio.role);
  var formattedMobile = HTMLmobile.replace(/%data%/g, bio.contacts.mobile);
  var formattedEmail = HTMLemail.replace(/%data%/g, bio.contacts.email);
  var formattedGithub = HTMLgithub.replace(/%data%/g, bio.contacts.github);
  var formattedTwitter = HTMLtwitter.replace(/%data%/g, bio.contacts.twitter);
  var formattedLocation = HTMLlocation.replace(/%data%/g, bio.contacts.location);
  var formattedBioPic = HTMLbioPic.replace(/%data%/g, bio.biopic);
  var formattedWelcomeMsg = HTMLwelcomeMsg.replace(/%data%/g, bio.welcomeMessage);

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
    $('header').append(HTMLskillsStart);

    bio.skills.forEach(function(skill) {
      var formattedSkill = HTMLskills.replace(/%data%/g, skill);
      $('#skills').append(formattedSkill);
    });
  }
};

work.display = function () {
  work.jobs.forEach(function(job) {
    $('#work-experience').append(HTMLworkStart);

    var formattedWorkTitle = HTMLworkTitle.replace(/%data%/g, job.title);
    var formattedWorkEmployer = HTMLworkEmployer.replace(/%data%/g, job.employer);
    var formattedWorkDates = HTMLworkDates.replace(/%data%/g, job.dates);
    var formattedWorkLocation = HTMLworkLocation.replace(/%data%/g, job.location);
    var formattedWorkDescription = HTMLworkDescription.replace(/%data%/g, job.description);

    $('.work-entry:last').append(formattedWorkEmployer + formattedWorkTitle)
                         .append(formattedWorkDates);
    $('.work-entry:last .row:last').append(formattedWorkLocation);
    $('.work-entry:last').append(formattedWorkDescription);
  });
};

projects.display = function() {
  projects.projects.forEach(function(project) {
    $('#projects').append(HTMLprojectStart);

    var formattedProjectTitle = HTMLprojectTitle.replace(/%data%/g, project.title);
    var formattedProjectDates = HTMLprojectDates.replace(/%data%/g, project.dates);
    var formattedProjectDescription = HTMLprojectDescription.replace(/%data%/g, project.description);

    $('.project-entry:last').append(formattedProjectTitle)
                            .append(formattedProjectDates);

    if (project.github || project.url) {
      $('.project-entry:last .row:last').append(HTMLprojectLinkStart);

      if (project.github) {
        var formattedProjectGithub = HTMLprojectLink.replace(/%url-data%/g, project.github);
        formattedProjectGithub = formattedProjectGithub.replace(/%data%/g, '<i class="fa fa-github"></i>');

        $('.project-entry:last .links:last').append(formattedProjectGithub);
      }

      if (project.url) {
        var formattedProjectUrl = HTMLprojectLink.replace(/%url-data%/g, project.url);
        formattedProjectUrl = formattedProjectUrl.replace(/%data%/g, '<i class="fa fa-eye"></i>');

        $('.project-entry:last .links:last').append(formattedProjectUrl);
      }
    }

    $('.project-entry:last').append(formattedProjectDescription);

    if (project.images.length) {
      $('.project-entry:last').append(HTMLprojectImageStart);

      project.images.forEach(function(image) {
        var formattedProjectImage = HTMLprojectImage.replace(/%data%/g, image);
        $('.project-images:last').append(formattedProjectImage);
      });
    }
  });
};

education.display = function() {
  education.schools.forEach(function(school) {
    $('#education').append(HTMLschoolStart);

    var formattedSchoolName = HTMLschoolName.replace(/%data%/g, school.name);
    formattedSchoolName = formattedSchoolName.replace(/%url-data%/g, school.url);
    var formattedSchoolDegree = HTMLschoolDegree.replace(/%data%/g, school.degree);
    var formattedSchoolDates = HTMLschoolDates.replace(/%data%/g, school.dates);
    var formattedSchoolLocation = HTMLschoolLocation.replace(/%data%/g, school.location);
    var formattedSchoolDescription = HTMLschoolDescription.replace(/%data%/g, school.description);

    $('.education-entry:last').append(formattedSchoolName + formattedSchoolDegree)
                              .append(formattedSchoolDates);
    $('.education-entry:last .row:last').append(formattedSchoolLocation);

    if (school.majors.length) {
      var formattedSchoolMajor = HTMLschoolMajor.replace(/%data%/g, school.majors.join(', '));
      $('.education-entry:last').append(formattedSchoolMajor);
    }

    $('.education-entry:last').append(formattedSchoolDescription);
  });

  if (education.onlineCourses.length) {
    $('#education').append(HTMLonlineClasses);

    education.onlineCourses.forEach(function(course) {
      $('#education').append(HTMLschoolStart);

      var formattedCourseTitle = HTMLonlineTitle.replace(/%data%/g, course.title);
      formattedCourseTitle = formattedCourseTitle.replace(/%url-data%/g, course.url);
      var formattedCourseSchool = HTMLonlineSchool.replace(/%data%/g, course.school);
      var formattedCourseDate = HTMLonlineDate.replace(/%data%/g, course.date);
      var formattedCourseDescription = HTMLonlineDescription.replace(/%data%/g, course.description);

      $('.education-entry:last').append(formattedCourseTitle + formattedCourseSchool)
                                .append(formattedCourseDate)
                                .append(formattedCourseDescription);
    });
  }
};

locations.updatePlaces = function() {
  var arr = [];

  arr.push(bio.contacts.location);

  work.jobs.forEach(function(job) {
    arr.push(job.location);
  });

  education.schools.forEach(function(school) {
    arr.push(school.location);
  });

  // Remove duplicates.
  arr = arr.reduce(function(acc, curr) {
    if (acc.indexOf(curr) === -1) {
      acc.push(curr);
    }
    return acc;
  }, []);

  locations.places = arr;
};

locations.display = function() {
  $('#places').append(HTMLmap);

  // An overlay on the map to prevent the user from interacting with it unintentionally.
  // Clicking hides until mouse leaves map area.
  $('#map-container').append(HTMLprotectiveOverlay);

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
};
