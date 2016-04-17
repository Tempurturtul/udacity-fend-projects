// The Markers Form View Model.

(function(global) {

  global.viewmodels = global.viewmodels || {};

  global.viewmodels.MarkersForm = MarkersForm;

  function MarkersForm(mainViewModel) {
    var self = this,
        map = global.map,
        ko = global.ko,
        tracked = [];  // Array of objects containing marker ID and KO subscription.

    self.cancel = function() {
      // Close the markers form.
      close();

      // Clear the pending and tracked arrays.
      clearPending();
      clearTracked();
    };

    self.open = function() {
      if (!self.visible()) {
        self.visible(true);
      }
    };

    self.pending = ko.observableArray([]);

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

    self.visible = ko.observable(false);

    init();

    function clearPending() {
      self.pending().forEach(function(pending) {
        map.removeMarker(pending.id());
      });

      self.pending([]);
    }

    function clearTracked() {
      tracked.forEach(function(obj) {
        obj.subscription.dispose();
      });

      tracked = [];
    }

    function close() {
      if (self.visible()) {
        self.visible(false);
      }
    }

    function init() {
      self.pending.subscribe(trackPending);
    }

    function trackPending(markers) {
      var trackedIDs = tracked.map(function(obj) {
        return obj.id;
      });

      markers.forEach(function(marker) {
        // If the marker isn't being tracked...
        if (trackedIDs.indexOf(marker.id()) === -1) {
          tracked.push({
            id: marker.id(),
            subscription: marker.visible.subscribe(function(newValue) { updateVisibility(marker.id(), newValue); })
          });
        }
      });
    }

    function updateVisibility(id, newValue) {
      map.modifyMarker(id, {visible: newValue});
    }
  }

})(this);
