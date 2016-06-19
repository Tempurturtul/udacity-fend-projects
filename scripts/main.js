(function(global) {
  var window = global.window;
  var document = global.document;

  // On load, call init.
  window.addEventListener('load', init);

  /**
   * Initializes the site by adding links to projects.
   */
  function init() {
    var projects = global.projects;
    var ul = document.getElementsByClassName('project-links')[0];

    var path, li;

    // For each project in the projects array...
    projects.forEach(function(project) {
      // Create a new li element.
      li = document.createElement('li');
      li.classList.add('project-links__entry');

      // Build the source path.
      path = 'https://github.com/Tempurturtul/udacity-fend-projects/tree/master/' + project.name;

      // Escape any double-quotes in the source path (just in case).
      path = path.replace(/"/g, '\\"');

      // Add a source link to the li.
      li.innerHTML = '<a class="project-links__link" href="' + path + '">' +
                     'Source</a>';

      // Add the project name to the li (and make it HTML safe just in case).
      li.innerHTML += '<span class="project-name">' +
                      project.name
                        .replace(/>/g, '&gt;')
                        .replace(/</g, '&lt;') +
                      '</span>';

      // If the project has a live version...
      if (project.live) {
        // Build the project path.
        path = 'projects/' + project.name + '/dist/index.html';

        // Escape any double-quotes in the project path (just in case).
        path = path.replace(/"/g, '\\"');

        // Add a live version link to the li.
        li.innerHTML += '<a class="project-links__link" href="' + path + '">' +
                        'Live Site</a>';
      }

      // Add the li element to the existing ul element.
      ul.appendChild(li);
    });
  }

})(this);
