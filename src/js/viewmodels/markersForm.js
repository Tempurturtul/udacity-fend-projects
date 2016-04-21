// The Markers Form View Model.

(function(global) {

  global.viewmodels = global.viewmodels || {};

  global.viewmodels.MarkersForm = MarkersForm;

  function MarkersForm(mainViewModel) {
    var self = this,
        map = global.map,
        ko = global.ko,
        tracked = [];  // Array of objects containing marker ID and KO subscription.

    // Cancels the form.
    self.cancel = function() {
      // Close the markers form.
      close();

      // Clear the pending and tracked arrays.
      clearPending();
      clearTracked();
    };

    // Opens the form.
    self.open = function() {
      if (!self.visible()) {
        self.visible(true);
      }
    };

    // The pending markers.
    self.pending = ko.observableArray([]);

    // Submits the form.
    self.submit = function() {
      // Close the markers form.
      close();

      // Filter the confirmed (visible) markers out of the pending array and into the markers
      // array.
      self.pending(self.pending().filter(function(pending) {
        if (pending.visible()) {
          // Move to the main view model's markers array.
          mainViewModel.markers.push(pending);
          // TODO Save. Subscribe a save method to the markers array?
          return false;
        } else {
          return true;
        }
      }));

      // Clear the pending and tracked arrays.
      clearPending();
      clearTracked();
    };

    // Whether or not the form is visible (open).
    self.visible = ko.observable(false);

    init();

    /**
     * Clears the pending markers.
     */
    function clearPending() {
      self.pending().forEach(function(pending) {
        map.removeMarker(pending.id());
      });

      self.pending([]);
    }

    /**
     * Clears the tracked markers.
     */
    function clearTracked() {
      tracked.forEach(function(obj) {
        obj.subscription.dispose();
      });

      tracked = [];
    }

    /**
     * Closes the form.
     */
    function close() {
      if (self.visible()) {
        self.visible(false);
      }
    }

    /**
     * Initializes the markers form.
     */
    function init() {
      self.pending.subscribe(trackPending);
    }

    /**
     * Tracks the pending markers.
     * @param {object[]} pendingMarkers
     */
    function trackPending(pendingMarkers) {
      console.log(pendingMarkers);
      // If there are no pending markers, close the form.
      if (!pendingMarkers.length) {
        clearTracked();
        close();
        return;
      }

      var trackedIDs = tracked.map(function(obj) {
        return obj.id;
      });

      pendingMarkers.forEach(function(pending) {
        // If the marker isn't being tracked...
        if (trackedIDs.indexOf(pending.id()) === -1) {
          tracked.push({
            id: pending.id(),
            subscription: pending.visible.subscribe(function(newValue) { updateVisibility(pending.id(), newValue); })
          });
        }
      });
    }

    /**
     * Updates the visibility of the marker.
     * @param {string} id - The marker's ID.
     * @param {boolean} newValue - The new visibility value.
     */
    function updateVisibility(id, newValue) {
      map.modifyMarker(id, {visible: newValue});
    }
  }

})(this);
