var bio = {
  "name" : "Matthew Feidt",
  "role" : "Web Developer",
  "contacts" : {
    "mobile" : "717-303-9839",
    "email" : "tempurturtul@gmail.com",
    "github" : "Tempurturtul",
    "twitter" : "@tempurturtul",
    "location" : "Brasher Falls, NY"
  },
  "bioPic" : "images/self.jpg",
  "welcomeMessage" : "Welcome to my work-in-progress resume!",
  "skills" : [
    "HTML",
    "CSS",
    "JavaScript",
    "jQuery",
    "NodeJS",
    "AngularJS",
    "Git",
    "Gulp",
    "Vagrant"
  ]
};

var education = {
  "schools": [
    {
      "name": "Central Penn College",
      "dates": "2008 - 2011",
      "location": "Harrisburg, PA",
      "degree": "BS",
      "majors": ["Security Management"],
      "url": "http://www.centralpenn.edu/"
    }
  ],
  "onlineCourses": [
    {
      "title": "JavaScript Basics",
      "school": "Udacity",
      "dates": "2015",
      "url": "https://www.udacity.com/course/javascript-basics--ud804"
    }
  ]
};

var work = {
  "jobs": [
    {
      "title": "Security Officer",
      "employer": "Government",
      "dates": "2012 - Current",
      "location": "Massena, NY",
      "description": "Sensitive security work requiring routine background " +
      "investigations, strict adherence to Standard Operating Procedures, " +
      "and regular professional interaction with both stakeholders and the " +
      "public. Supervisory and peer-mentoring roles fulfilled on multiple " +
      "occasions at the request of managment."
    }
  ]
};

var projects = {
  "projects": [
    {
      "title": "Portfolio",
      "dates": "November 2015",
      "description": "A web development portfolio built as the first project " +
      "in Udacity's Front-End Web Development Nanodegree program.",
      "images": [
        "images/fend-portfolio-top.png",
        "images/fend-portfolio-work.png",
        "images/fend-portfolio-contact.png"
      ]
    }
  ]
};

bio.display = function() {
  var formattedName = HTMLheaderName.replace('%data%', bio.name);
  var formattedRole = HTMLheaderRole.replace('%data%', bio.role);
  var formattedMobile = HTMLmobile.replace('%data%', bio.contacts.mobile);
  var formattedEmail = HTMLemail.replace('%data%', bio.contacts.email);
  var formattedGithub = HTMLgithub.replace('%data%', bio.contacts.github);
  var formattedTwitter = HTMLtwitter.replace('%data%', bio.contacts.twitter);
  var formattedLocation = HTMLlocation.replace('%data%', bio.contacts.location);
  var formattedBioPic = HTMLbioPic.replace('%data%', bio.bioPic);
  var formattedWelcomeMsg = HTMLwelcomeMsg.replace('%data%', bio.welcomeMessage);

  $('#header').prepend(formattedRole);
  $('#header').prepend(formattedName);
  $('#topContacts').append(formattedMobile);
  $('#topContacts').append(formattedEmail);
  $('#topContacts').append(formattedGithub);
  $('#topContacts').append(formattedTwitter);
  $('#topContacts').append(formattedLocation);
  $('#footerContacts').append(formattedMobile);
  $('#footerContacts').append(formattedEmail);
  $('#footerContacts').append(formattedGithub);
  $('#footerContacts').append(formattedTwitter);
  $('#footerContacts').append(formattedLocation);
  $('#header').append(formattedBioPic);
  $('#header').append(formattedWelcomeMsg);

  if (bio.skills.length) {
    $('#header').append(HTMLskillsStart);

    bio.skills.forEach(function(skill) {
      var formattedSkill = HTMLskills.replace('%data%', skill);
      $('#skills').append(formattedSkill);
    })
  }
};

education.display = function() {
  for (school in education.schools) {
    school = education.schools[school];

    $('#education').append(HTMLschoolStart);

    var formattedSchoolName = HTMLschoolName.replace('%data%', school.name);
    var formattedSchoolDegree = HTMLschoolDegree.replace('%data%', school.degree);
    var formattedSchoolDates = HTMLschoolDates.replace('%data%', school.dates);
    var formattedSchoolLocation = HTMLschoolLocation.replace('%data%', school.location);

    $('.education-entry:last').append(formattedSchoolName + formattedSchoolDegree);
    $('.education-entry:last').append(formattedSchoolDates);
    $('.education-entry:last').append(formattedSchoolLocation);

    for (major in school.majors) {
      var major = school.majors[major];
      var formattedSchoolMajor = HTMLschoolMajor.replace('%data%', major);
      $('.education-entry:last').append(formattedSchoolMajor);
    }
  }

  if (education.onlineCourses.length) {
    $('#education').append(HTMLonlineClasses);

    for (course in education.onlineCourses) {
      course = education.onlineCourses[course];

      $('#education').append(HTMLschoolStart);

      var formattedCourseTitle = HTMLonlineTitle.replace('%data%', course.title);
      var formattedCourseSchool = HTMLonlineSchool.replace('%data%', course.school);
      var formattedCourseDates = HTMLonlineDates.replace('%data%', course.dates);
      var formattedCourseUrl = HTMLonlineURL.replace('%data%', course.url);

      $('.education-entry:last').append(formattedCourseTitle + formattedCourseSchool);
      $('.education-entry:last').append(formattedCourseDates);
      $('.education-entry:last').append(formattedCourseUrl);
    }
  }
};

work.display = function () {
  for (job in work.jobs) {
    job = work.jobs[job];

    $('#workExperience').append(HTMLworkStart);

    var formattedWorkTitle = HTMLworkTitle.replace('%data%', job.title);
    var formattedWorkEmployer = HTMLworkEmployer.replace('%data%', job.employer);
    var formattedWorkDates = HTMLworkDates.replace('%data%', job.dates);
    var formattedWorkLocation = HTMLworkLocation.replace('%data%', job.location);
    var formattedWorkDescription = HTMLworkDescription.replace('%data%', job.description);

    $('.work-entry:last').append(formattedWorkEmployer + formattedWorkTitle);
    $('.work-entry:last').append(formattedWorkDates);
    $('.work-entry:last').append(formattedWorkLocation);
    $('.work-entry:last').append(formattedWorkDescription);
  }
};

projects.display = function() {
  for (project in projects.projects) {
    project = projects.projects[project];

    $('#projects').append(HTMLprojectStart);

    var formattedProjectTitle = HTMLprojectTitle.replace('%data%', project.title);
    var formattedProjectDates = HTMLprojectDates.replace('%data%', project.dates);
    var formattedProjectDescription = HTMLprojectDescription.replace('%data%', project.description);

    $('.project-entry:last').append(formattedProjectTitle);
    $('.project-entry:last').append(formattedProjectDates);
    $('.project-entry:last').append(formattedProjectDescription);

    for (image in project.images) {
      image = project.images[image];

      var formattedProjectImage = HTMLprojectImage.replace('%data%', image);
      $('.project-entry:last').append(formattedProjectImage);
    }
  }
};


bio.display();
education.display();
work.display();
projects.display();
$('#mapDiv').append(googleMap);
