var bio = {
  "name" : "Matthew Feidt",
  "role" : "Web Developer",
  "contacts" : {
    "mobile" : "717-303-9839",
    "email" : "tempurturtul@gmail.com",
    "github" : "Tempurturtul",
    "twitter" : "tempurturtul",
    "location" : "Brasher Falls, NY"
  },
  "bioPic" : "images/self.jpg",
  "welcomeMessage" : "This resume was built as part of the Udacity Front-End " +
  "Web Developer nanodegree program. The method of construction and the " +
  "majority of the styling for this site comes from a template provided by " +
  "said program. Data presented here is accurate as of December 2015.",
  "skills" : [
    "HTML",
    "CSS",
    "JavaScript",
    "jQuery",
    "NodeJS",
    "AngularJS",
    "Git",
    "Gulp"
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
      "description": "Developed an interactive resume application that reads " +
      "resume content from a JSON object and dynamically displays that " +
      "content within a provided template. Focus on data types and flow " +
      "control.",
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
      "occasions at the request of managment.",
      "url": "#"
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
      ],
      "url": "http://tempurturtul.github.io/fend-portfolio/"
    }
  ]
};

bio.display = function() {
  var formattedName = HTMLheaderName.replace(/%data%/g, bio.name);
  var formattedRole = HTMLheaderRole.replace(/%data%/g, bio.role);
  var formattedMobile = HTMLmobile.replace(/%data%/g, bio.contacts.mobile);
  var formattedEmail = HTMLemail.replace(/%data%/g, bio.contacts.email);
  var formattedGithub = HTMLgithub.replace(/%data%/g, bio.contacts.github);
  var formattedTwitter = HTMLtwitter.replace(/%data%/g, bio.contacts.twitter);
  var formattedLocation = HTMLlocation.replace(/%data%/g, bio.contacts.location);
  var formattedBioPic = HTMLbioPic.replace(/%data%/g, bio.bioPic);
  var formattedWelcomeMsg = HTMLwelcomeMsg.replace(/%data%/g, bio.welcomeMessage);

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
      var formattedSkill = HTMLskills.replace(/%data%/g, skill);
      $('#skills').append(formattedSkill);
    })
  }
};

education.display = function() {
  for (school in education.schools) {
    school = education.schools[school];

    $('#education').append(HTMLschoolStart);

    var formattedSchoolName = HTMLschoolName.replace(/%data%/g, school.name);
    formattedSchoolName = formattedSchoolName.replace(/%url-data%/g, school.url);
    var formattedSchoolDegree = HTMLschoolDegree.replace(/%data%/g, school.degree);
    var formattedSchoolDates = HTMLschoolDates.replace(/%data%/g, school.dates);
    var formattedSchoolLocation = HTMLschoolLocation.replace(/%data%/g, school.location);

    $('.education-entry:last').append(formattedSchoolName + formattedSchoolDegree);
    $('.education-entry:last').append(formattedSchoolDates);
    $('.education-entry:last').append(formattedSchoolLocation);

    for (major in school.majors) {
      var major = school.majors[major];
      var formattedSchoolMajor = HTMLschoolMajor.replace(/%data%/g, major);
      $('.education-entry:last').append(formattedSchoolMajor);
    }
  }

  if (education.onlineCourses.length) {
    $('#education').append(HTMLonlineClasses);

    for (course in education.onlineCourses) {
      course = education.onlineCourses[course];

      $('#education').append(HTMLschoolStart);

      var formattedCourseTitle = HTMLonlineTitle.replace(/%data%/g, course.title);
      formattedCourseTitle = formattedCourseTitle.replace(/%url-data%/g, course.url);
      var formattedCourseSchool = HTMLonlineSchool.replace(/%data%/g, course.school);
      var formattedCourseDates = HTMLonlineDates.replace(/%data%/g, course.dates);
      //var formattedCourseUrl = HTMLonlineURL.replace(/%data%/g, course.url);
      var formattedCourseDescription = HTMLonlineDescription.replace(/%data%/g, course.description);

      $('.education-entry:last').append(formattedCourseTitle + formattedCourseSchool);
      $('.education-entry:last').append(formattedCourseDates);
      $('.education-entry:last').append(formattedCourseDescription);
      //$('.education-entry:last').append(formattedCourseUrl);
    }
  }
};

work.display = function () {
  for (job in work.jobs) {
    job = work.jobs[job];

    $('#workExperience').append(HTMLworkStart);

    var formattedWorkTitle = HTMLworkTitle.replace(/%data%/g, job.title);
    var formattedWorkEmployer = HTMLworkEmployer.replace(/%data%/g, job.employer);
    formattedWorkEmployer = formattedWorkEmployer.replace(/%url-data%/g, job.url);
    var formattedWorkDates = HTMLworkDates.replace(/%data%/g, job.dates);
    var formattedWorkLocation = HTMLworkLocation.replace(/%data%/g, job.location);
    var formattedWorkDescription = HTMLworkDescription.replace(/%data%/g, job.description);

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

    var formattedProjectTitle = HTMLprojectTitle.replace(/%data%/g, project.title);
    formattedProjectTitle = formattedProjectTitle.replace(/%url-data%/g, project.url);
    var formattedProjectDates = HTMLprojectDates.replace(/%data%/g, project.dates);
    var formattedProjectDescription = HTMLprojectDescription.replace(/%data%/g, project.description);

    $('.project-entry:last').append(formattedProjectTitle);
    $('.project-entry:last').append(formattedProjectDates);
    $('.project-entry:last').append(formattedProjectDescription);

    if (project.images.length) {
      $('.project-entry:last').append(HTMLprojectImageStart);

      for (image in project.images) {
        image = project.images[image];

        var formattedProjectImage = HTMLprojectImage.replace(/%data%/g, image);
        $('.project-images:last').append(formattedProjectImage);
      }
    }
  }
};

bio.display();
education.display();
work.display();
projects.display();
