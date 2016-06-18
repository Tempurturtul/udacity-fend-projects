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
      // Build the project path.
      path = 'projects/' + project + '/dist/index.html';

      // Ensure the project name is HTML safe.
      project = project
                  .replace(/>/g, '&gt;')
                  .replace(/</g, '&lt;');

      // Escape any double-quotes in the project path.
      path = path.replace(/"/g, '\\"');

      // Create a new li element.
      li = document.createElement('li');
      li.classList.add('project-links__entry');
      li.innerHTML = '<a class="project-links__link" href="' + path + '">' + project + '</a>';

      // Add the li element to the existing ul element.
      ul.appendChild(li);
    });
  }

})(this);
