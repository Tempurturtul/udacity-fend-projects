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
          // TODO Additional properties to consider:
          //  backgroundColor - The background color visible when panning.
          //  mapTypeId - The map type. (HYBRID, ROADMAP, SATELLITE, TERRAIN)
          center: {lat: 35.689, lng: 139.692},  // Tokyo, Japan.
          zoom: 10,
          disableDoubleClickZoom: true
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
  function addMarker(markerData) {
    markerData.map = map;
    markerData.animation = google.maps.Animation.DROP;

    var marker = new google.maps.Marker(markerData);

    markers.push(marker);
  }

  /**
   * Modifies a marker on the map.
   */
  function modifyMarker(markerID, newMarkerData) {}

  /**
   * Removes a marker from the map.
   */
  function removeMarker(markerID) {
    var marker = getMarker(markerID);

    if (marker) {
      marker.setMap(null);
      markers.splice(markers.indexOf(marker), 1);
    } else {
      console.warn('Failed to remove marker because marker wasn\'t found.');
    }
  }

  /**
   * Adds a `places_changed` event listener to the search box and calls the given
   * function `fn` when the event fires.
   */
  function onPlacesChanged(fn) {
    searchBox.addListener('places_changed', fn);
  }

  /**
   * Adds a `dblclick` event listener to the map and calls the function `fn` when
   * the event fires.
   */
  function onMapDblClick(fn) {
    map.addListener('dblclick', fn);
  }

  /**
   * Adds a `click` event listener to the marker and calls the function `fn` when
   * the event fires.
   */
  function onMarkerClick(markerID, fn) {
    var marker = getMarker(markerID);

    marker.addListener('click', fn);
  }

  /**
   * Opens the info window on the marker.
   */
  function openInfoWindow(infoWindow, markerID) {
    var marker = getMarker(markerID);

    infoWindow.open(map, marker);
  }

  /**
   * Creates and returns an info window.
   */
  function createInfoWindow(opts) {
    return new google.maps.InfoWindow(opts);
  }

  /**
   * Sets the content of the info window.
   */
  function setInfoWindowContent(infoWindow, content) {
    infoWindow.setContent(content);
  }

  /**
   * Returns the marker matching the given id.
   */
  function getMarker(id) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].id === id) {
        return markers[i];
      }
    }

    // If we made it here, the marker wasn't found.
    return null;
  }

  global.map = {
    addMarker: addMarker,
    modifyMarker: modifyMarker,
    removeMarker: removeMarker,
    onPlacesChanged: onPlacesChanged,
    onMapDblClick: onMapDblClick,
    onMarkerClick: onMarkerClick,
    openInfoWindow: openInfoWindow,
    createInfoWindow: createInfoWindow,
    setInfoWindowContent: setInfoWindowContent
  };
})(this);
