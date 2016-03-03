// Google Maps functionality.

(function(global) {
  var document = global.document,
      localStorage = global.localStorage,
      google = global.google,
      storageKeys = {
        MAPOPTIONS: 'mapOptions'
      },
      defaults = {
        mapOptions: {
          center: {lat: 35.689, lng: 139.692},  // Tokyo, Japan.
          zoom: 10
        }
      },
      map,            // The Google Map.
      markers = [];   // The Google Map Markers.

  init();

  /**
   * Initializes the Google Map.
   */
  function init() {
    var mapOptions = JSON.parse(localStorage.getItem(storageKeys.MAPOPTIONS)) || defaults.mapOptions;

    // Initialize the map.
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  /**
   * Creates a marker and adds it to the map.
   */
  function addMarker(data) {
    data.map = map;
    markers.push(new google.maps.Marker(data));
  }

  /**
   * Modifies a marker on the map.
   */
  function modifyMarker(origData, newData) {}

  /**
   * Removes a marker from the map.
   */
  function removeMarker(data) {}

  global.map = {
    addMarker: addMarker,
    modifyMarker: modifyMarker,
    removeMarker: removeMarker
  };
})(this);
