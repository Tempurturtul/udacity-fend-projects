// Google Maps functionality.

// NOTE Search box example: https://developers.google.com/maps/documentation/javascript/examples/places-searchbox

(function(global) {
  var document = global.document,
      localStorage = global.localStorage,
      google = global.google,
      storageKeys = {
        MAPOPTIONS: 'mapOptions'
      },
      defaults = {
        mapOptions: {
          // TODO Additional properties to consider:
          //  backgroundColor - The background color visible when panning.
          //  mapTypeId - The map type. (HYBRID, ROADMAP, SATELLITE, TERRAIN)
          center: {lat: 35.689, lng: 139.692},  // Tokyo, Japan.
          zoom: 10
        }
      },
      map,            // The Google Map.
      markers = [],   // The Google Map Markers.
      places,         // The Google Places Service.
      searchBox,      // The Google Places SearchBox.
      searchBoxID = 'places-search';

  init();

  /**
   * Initializes the map, places service, and places search box.
   */
  function init() {
    var mapOptions = JSON.parse(localStorage.getItem(storageKeys.MAPOPTIONS)) || defaults.mapOptions,
        inputElem = document.getElementById(searchBoxID);

    // Initialize the map.
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Initialize the places service.
    places = new google.maps.places.PlacesService(map);

    // Initialize the places search box.
    searchBox = new google.maps.places.SearchBox(inputElem);

    // Add the search box to the map controls.
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputElem);

    // Bias the search box results towards the map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });
  }

  /**
   * Creates a marker and adds it to the map.
   */
  function addMarker(data) {
    // TODO Additional properties to consider:
    //  data.draggable - Makes the marker draggable.
    //  data.icon - Icon for the marker.
    //  data.label - First letter of this string is displayed on marker.
    //  data.visible - Useful for hiding markers.
    //  data.zIndex - Useful for sorting markers by folder depth.

    data.map = map;
    data.animation = google.maps.Animation.DROP;
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

  /**
   * Adds a places_changed event listener to the search box and calls the given
   * function `fn` when the event fires.
   */
  function onPlacesChanged(fn) {
    searchBox.addListener('places_changed', fn);
  }

  global.map = {
    addMarker: addMarker,
    modifyMarker: modifyMarker,
    removeMarker: removeMarker,
    onPlacesChanged: onPlacesChanged
  };
})(this);
