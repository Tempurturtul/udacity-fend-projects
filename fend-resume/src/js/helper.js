var helper = {};

helper.HTMLheaderName = '<h1>%data%</h1>';
helper.HTMLheaderNameWithUrl = '<h1><a href="%url-data%" target="_blank">%data%</a></h1>';
helper.HTMLheaderRole = '<p class="subtitle">%data%</p><hr>';

helper.HTMLmobile = '<li class="hide-content-container"><i class="fa fa-mobile"></i><span class="hide-content">%data%</span></li>';
helper.HTMLemail = '<li class="hide-content-container"><i class="fa fa-envelope-o"></i><span class="hide-content"><a href="mailto:%data%">%data%</a></span></li>';
helper.HTMLlinkedin = '<li class="hide-content-container"><i class="fa fa-linkedin"></i><span class="hide-content"><a href="%url-data%" target="_blank">%data%</a></span></li>';
helper.HTMLgithub = '<li class="hide-content-container"><i class="fa fa-github"></i><span class="hide-content"><a href="%url-data%" target="_blank">%data%</a></span></li>';
helper.HTMLlocation = '<li class="hide-content-container"><i class="fa fa-map-marker"></i><span class="hide-content"><a href="https://www.google.com/maps/search/%data%" target="_blank">%data%</a></span></li>';

helper.HTMLbioPic = '<div class="row"><img class="biopic" src="%data%"></div>';
helper.HTMLbioPicWithUrl = '<div class="row"><a href="%url-data%" target="_blank"><img class="biopic" src="%data%"></a></div>';
helper.HTMLwelcomeMsg = '<p class="welcome-message">%data%</p>';

helper.HTMLskillsStart = '<ul id="skills"></ul>';
helper.HTMLskills = '<li>%data%</li>';

helper.HTMLworkStart = '<article class="work-entry"></article>';
helper.HTMLworkEmployer = '<h3>%data%';
helper.HTMLworkTitle = ' - %data%</h3>';
helper.HTMLworkDates = '<div class="row"><p class="time-period">%data%</p></div>';
helper.HTMLworkLocation = '<p class="location">%data%</p>';
helper.HTMLworkDescription = '<p class="description">%data%</p>';

helper.HTMLprojectStart = '<article class="project-entry"></article>';
helper.HTMLprojectTitle = '<h3>%data%</h3>';
helper.HTMLprojectTitleWithUrl = '<h3><a href="%url-data%" target="_blank">%data% <i class="fa fa-external-link"></i></a></h3>';
helper.HTMLprojectDates = '<div class="row"><p class="time-period">%data%</p></div>';
helper.HTMLprojectGithub = '<a class="github-link" href="%data%" target="_blank"><i class="fa fa-github"></i></a>';
helper.HTMLprojectDescription = '<p class="description">%data%</p>';
helper.HTMLprojectImageStart = '<div class="collapse-container"><iron-collapse><div class="project-images"></div></iron-collapse><button class="collapse-button collapse-prev"><i class="fa fa-angle-down"></i></button></div>';
helper.HTMLprojectImage = '<img src="%data%">';

helper.HTMLschoolStart = '<article class="education-entry"></article>';
helper.HTMLschoolName = '<h3><a href="%url-data%" target="_blank">%data%';
helper.HTMLschoolDegree = ' -- %data% <i class="fa fa-external-link"></i></a></h3>';
helper.HTMLschoolDates = '<div class="row"><p class="time-period">%data%</p></div>';
helper.HTMLschoolLocation = '<p class="location">%data%</p>';
helper.HTMLschoolMajor = '<p>Major: %data%</p>';
helper.HTMLschoolDescription = '<p class="description">%data%</p>';

helper.HTMLonlineClasses = '<h3 id="classes-heading">Online Classes</h3>';
helper.HTMLonlineTitle = '<h4><a href="%url-data%" target="_blank">%data%';
helper.HTMLonlineSchool = ' - %data% <i class="fa fa-external-link"></i></a></h4>';
helper.HTMLonlineDate = '<p class="time-period">%data%</p>';
helper.HTMLonlineDescription = '<p class="description">%data%</p>';

helper.HTMLmap = '<div id="map-container"><div id="map"></div></div>';
helper.HTMLprotectiveOverlay = '<div class="protective-overlay">Click to interact.</div>';
