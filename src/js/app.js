// Core functionality.

(function(global) {

  // Initialize the app once all resources are finished loading.
  global.window.addEventListener('load', init);

  function init() {
    var window = global.window,
        document = global.document,
        map = global.map,
        placeInfo = global.placeInfo,
        ko = global.ko,
        viewmodels = global.viewmodels,
        components = global.components;

    // Try to initialize place info.
    try {
      placeInfo.init();
    }
    catch (e) {
      console.warn(e.name, ':', e.message);

      // Set the `placeInfo` variable to null if an error was thrown.
      placeInfo = null;
    }

    // Try to initialize the map.
    try {
      map.init();
    }
    catch (e) {
      console.error(e.name, ':', e.message);

      // The app isn't functional without the map; replace the document body with an error message.
      document.body.classList.remove('loading');
      document.body.innerHTML = '<div class="fullpage-error">' +
                                '<h1>Error</h1>' +
                                '<p>Google Maps API not found.</p>' +
                                '<ol>' +
                                '<li>Are you connected to the internet?</li>' +
                                '<li>Are you able to reach <a href="https://www.google.com">www.google.com</a>?</li>' +
                                '<li>Is it possible that something on your end is blocking requests to maps.googleapis.com?</li>' +
                                '</ol>' +
                                '</div>';

      // Abort initialization.
      return;
    }

    // The map was successfully initialized.

    // Apply the Knockout bindings.
    ko.applyBindings(new viewmodels.Main());

    // Remove the loading class after a brief delay.
    window.setTimeout(function() {
      document.body.classList.remove('loading');
    }, 500);
  }

})(this);
