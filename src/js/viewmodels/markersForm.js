// The Markers Form View Model.

(function(global) {

  global.viewmodels = global.viewmodels || {};

  global.viewmodels.MarkersForm = MarkersForm;

  function MarkersForm(mainViewModel) {
    var self = this,
        map = global.map,
        ko = global.ko;

    self.cancel = function() {
      // Close the markers form.
      close();

      // Clear the pending markers array.
      clearPending();
    };

    self.pending = ko.observableArray([]);

    self.submit = function() {
      // Close the markers form.
      close();

      // Filter the confirmed markers out of the pending array and into the markers
      // array.
      self.pending(self.pending().filter(function(pending) {
        if (pending.confirmed()) {
          // Move to the main view model's markers array.
          mainViewModel.markers.push(pending.marker);
          // TODO Save. Subscribe a save method to the markers array?
          return false;
        } else {
          return true;
        }
      }));

      // Clear the pending markers array.
      clearPending();
    };

    self.visible = ko.observable(false);

    init();

    function clearPending() {
      self.pending().forEach(function(pending) {
        map.removeMarker(pending.marker.id());
      });

      self.markersForm.pending([]);
    }

    function close() {
      if (self.visible()) {
        self.visible(false);
      }
    }

    function init() {}

    function open() {
      if (!self.visible()) {
        self.visible(true);
      }
    }
  }

})(this);
