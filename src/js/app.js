// Knockout-controlled functionality.

(function(global) {
  var ko = global.ko,
      localStorage = global.localStorage,
      map = global.map;

  // Marker Model
  function Marker(data) {
    this.position = ko.observable(data.position);
    this.title = ko.observable(data.title);
  }

  // App View Model
  function AppViewModel() {
    var self = this;

    self.markerList = ko.observableArray([]);

    map.markersData.forEach(function(data) {
      self.markerList.push(new Marker(data));
    });
  }

  ko.applyBindings(new AppViewModel());
})(this);
