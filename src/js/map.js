// Google Maps functionality.

(function(global) {
  var document = global.document,
      localStorage = global.localStorage,
      google = global.google,
      map,
      markers = [],  // Actual Google Markers.
      markersData;   // Data defining Google Markers.

  init();

  /**
   * Initializes the Google Map and Markers.
   */
  function init() {
    // Defaults to use if local storage is empty.
    var defaultMapOptions = {
          center: new google.maps.LatLng(35.689, 139.692), // Tokyo, Japan.
          zoom: 10
        },
        defaultMarkersData = [
          {
            position: new google.maps.LatLng(35.6738167, 139.7623955),
            title: 'Default 1'
          },
          {
            position: new google.maps.LatLng(35.6738167, 139),
            title: 'Default 2'
          },
          {
            position: new google.maps.LatLng(35.6738167, 139.8),
            title: 'Default 3'
          },
        ];

    // Local storage values or defaults.
    var mapOptions = JSON.parse(localStorage.getItem('mapOptions')) || defaultMapOptions;

    markersData = JSON.parse(localStorage.getItem('markersData')) || defaultMarkersData;

    // Initialize the map.
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Add the markers.
    markersData.forEach(function(data) {
      data.map = map;
      var marker = new google.maps.Marker(data);
      markers.push(marker);
    });
  }
  
  global.map = {
    markersData: markersData
  };
})(this);
