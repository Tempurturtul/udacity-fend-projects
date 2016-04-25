// The Marker model.

(function(global) {

  var ko,
      uuid,
      initialized = false;

  global.models = global.models || {};

  global.models.Marker = Marker;

  function init() {
    // It's possible for ko and UUID to be undefined on the global scope when
    // this IIFE is initially invoked due to async script loading.
    ko = global.ko;
    uuid = global.UUID;
    initialized = true;
  }

  function Marker(data) {
    if (!initialized) {
      init();
    }

    data = data || {};

    // NOTE Add new properties for use with map to the map.modifyMarker method.

    // TODO Additional (google.maps) properties to consider:
    //  data.icon - Icon for the marker.
    //  data.label - First letter of this string is displayed on marker.

    this.id = ko.observable(data.id || uuid.generate());
    this.description = ko.observable(data.description || '');
    this.position = ko.observable(data.position || {lat: 0, lng: 0});
    this.title = ko.observable(data.title || 'New Marker');
    this.selected = ko.observable(data.selected || false);
    this.visible = ko.observable(data.visible || true);
  }

})(this);
