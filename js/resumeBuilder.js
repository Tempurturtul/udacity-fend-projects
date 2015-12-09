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

var work = {
  "jobs": [
    {
      "title": "Security Officer",
      "employer": "Government",
      "employed": "2012 - Current",
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
      "completed": "November 2015",
      "description": "A web development portfolio built as the first project " +
      "in Udacity's Front-End Web Development Nanodegree program.",
      "images": [
        "images/fend-portfolio-top.png",
        "images/fend-portfolio-work.png",
        "images/fend-portfolio-contact.png"
      ],
      "github": "https://github.com/Tempurturtul/fend-resume",
      "url": "http://tempurturtul.github.io/fend-portfolio/"
    }
  ]
};

var education = {
  "schools": [
    {
      "name": "Central Penn College",
      "attended": "2008 - 2011",
      "location": "Harrisburg, PA",
      "degree": "BS",
      "majors": ["Security Management"],
      "description": "An accelerated four-year degree program focusing on " +
      "intelligence analysis, management, and police work. Obtained an " +
      "Intelligence Analysis certificate and completed a 400-hour internship " +
      "with a local police department as part of the degree program. " +
      "Graduated Magna Cum Laude with a 3.7 GPA.",
      "url": "http://www.centralpenn.edu/"
    }
  ],
  "onlineCourses": [
    {
      "title": "JavaScript Basics",
      "school": "Udacity",
      "completed": "December 2015",
      "description": "Developed an interactive resume application that reads " +
      "resume content from a JSON object and dynamically displays that " +
      "content within a provided template. Focus on data types and flow " +
      "control.",
      "url": "https://www.udacity.com/course/javascript-basics--ud804"
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

  $('header').prepend(formattedRole);
  $('header').prepend(formattedName);
  $('header').append(formattedBioPic);
  $('header .row:last').append(formattedWelcomeMsg);
  $('.contacts-list').append(formattedMobile);
  $('.contacts-list').append(formattedEmail);
  $('.contacts-list').append(formattedGithub);
  $('.contacts-list').append(formattedTwitter);
  $('.contacts-list').append(formattedLocation);

  if (bio.skills.length) {
    $('header').append(HTMLskillsStart);

    bio.skills.forEach(function(skill) {
      var formattedSkill = HTMLskills.replace(/%data%/g, skill);
      $('#skills').append(formattedSkill);
    })
  }
};

work.display = function () {
  for (job in work.jobs) {
    job = work.jobs[job];

    $('#work-experience').append(HTMLworkStart);

    var formattedWorkTitle = HTMLworkTitle.replace(/%data%/g, job.title);
    var formattedWorkEmployer = HTMLworkEmployer.replace(/%data%/g, job.employer);
    formattedWorkEmployer = formattedWorkEmployer.replace(/%url-data%/g, job.url);
    var formattedWorkEmployed = HTMLworkEmployed.replace(/%data%/g, job.employed);
    var formattedWorkLocation = HTMLworkLocation.replace(/%data%/g, job.location);
    var formattedWorkDescription = HTMLworkDescription.replace(/%data%/g, job.description);

    $('.work-entry:last').append(formattedWorkEmployer + formattedWorkTitle);
    $('.work-entry:last').append(formattedWorkEmployed);
    $('.work-entry:last .row:last').append(formattedWorkLocation);
    $('.work-entry:last').append(formattedWorkDescription);
  }
};

projects.display = function() {
  for (project in projects.projects) {
    project = projects.projects[project];

    $('#projects').append(HTMLprojectStart);

    var formattedProjectTitle = HTMLprojectTitle.replace(/%data%/g, project.title);
    var formattedProjectCompleted = HTMLprojectCompleted.replace(/%data%/g, project.completed);
    var formattedProjectDescription = HTMLprojectDescription.replace(/%data%/g, project.description);

    $('.project-entry:last').append(formattedProjectTitle);
    $('.project-entry:last').append(formattedProjectCompleted);

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

      for (image in project.images) {
        image = project.images[image];

        var formattedProjectImage = HTMLprojectImage.replace(/%data%/g, image);
        $('.project-images:last').append(formattedProjectImage);
      }
    }
  }
};

education.display = function() {
  for (school in education.schools) {
    school = education.schools[school];

    $('#education').append(HTMLschoolStart);

    var formattedSchoolName = HTMLschoolName.replace(/%data%/g, school.name);
    formattedSchoolName = formattedSchoolName.replace(/%url-data%/g, school.url);
    var formattedSchoolDegree = HTMLschoolDegree.replace(/%data%/g, school.degree);
    var formattedSchoolAttended = HTMLschoolAttended.replace(/%data%/g, school.attended);
    var formattedSchoolLocation = HTMLschoolLocation.replace(/%data%/g, school.location);
    var formattedSchoolDescription = HTMLschoolDescription.replace(/%data%/g, school.description);

    $('.education-entry:last').append(formattedSchoolName + formattedSchoolDegree);
    $('.education-entry:last').append(formattedSchoolAttended);
    $('.education-entry:last .row:last').append(formattedSchoolLocation);

    if (school.majors.length) {
      var formattedSchoolMajor = HTMLschoolMajor.replace(/%data%/g, school.majors.join(', '));
      $('.education-entry:last').append(formattedSchoolMajor);
    }

    $('.education-entry:last').append(formattedSchoolDescription);
  }

  if (education.onlineCourses.length) {
    $('#education').append(HTMLonlineClasses);

    for (course in education.onlineCourses) {
      course = education.onlineCourses[course];

      $('#education').append(HTMLschoolStart);

      var formattedCourseTitle = HTMLonlineTitle.replace(/%data%/g, course.title);
      formattedCourseTitle = formattedCourseTitle.replace(/%url-data%/g, course.url);
      var formattedCourseSchool = HTMLonlineSchool.replace(/%data%/g, course.school);
      var formattedCourseCompleted = HTMLonlineCompleted.replace(/%data%/g, course.completed);
      var formattedCourseDescription = HTMLonlineDescription.replace(/%data%/g, course.description);

      $('.education-entry:last').append(formattedCourseTitle + formattedCourseSchool);
      $('.education-entry:last').append(formattedCourseCompleted);
      $('.education-entry:last').append(formattedCourseDescription);
    }
  }
};

bio.display();
work.display();
projects.display();
education.display();
