(function(global) {
  var document = global.document,
      localStorage = global.localStorage,
      google = global.google,
      map,
      defaultMapOptions = {
        center: new google.maps.LatLng(35.689, 139.692), // Tokyo, Japan.
        zoom: 10
      },
      mapOptions = JSON.parse(localStorage.getItem('mapOptions')) || defaultMapOptions;

  init(mapOptions);

  /**
   * Initializes the Google Map on the #map element with the given Google MapOptions.
   */
  function init(mapOptions) {
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  }

  global.map = {};
})(this);
