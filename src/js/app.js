// Core functionality.

// WORK ON THIS NEXT:
// - Styling.
// - Drag-drop issues. (Why is the drag preview disappearing?)

// WORK ON THIS LATER:
// - Information for the info window (including error handling).
// - Allow the user to edit/set more things when creating/modifying markers.
// - Saving markers, folders, and map options.
// - Double check that project requirements are met.
// - More styling.

(function(global) {

  // Initialize the app once all resources are finished loading.
  global.window.addEventListener('load', init);

  function init() {
    var map = global.map,
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
      global.document.body.innerHTML = '<div class="fullpage-error">' +
                                       '<h1>Error</h1>' +
                                       '<p>Google Maps API not found.</p>' +
                                       '</div>';

      // Abort initialization.
      return;
    }

    // The map was successfully initialized.

    // Register the info-window custom component.
    ko.components.register('info-window', components.infoWindow);

    // Apply the Knockout bindings.
    ko.applyBindings(new viewmodels.Main());
  }

})(this);
