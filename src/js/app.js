(function(global) {
  var ko = global.ko,
      google = global.google,
      localStorage = global.localStorage;

  // Marker Model
  function Marker(data) {
    this.draggable = ko.observable(data.draggable);
    this.icon = ko.observable(data.icon);
    this.label = ko.observable(data.label);
    this.place = ko.observable(data.place);
    this.position = ko.observable(data.position);
    this.title = ko.observable(data.title);
    this.visible = ko.observable(data.visible);
  }

  // Application View Model
  function AppViewModel() {
    var self = this;
  };

  // TODO Custom binding for map. (http://stackoverflow.com/a/16305965)

  ko.applyBindings(new AppViewModel());
})(this);
