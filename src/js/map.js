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
      infoWindow,     // The Google Map InfoWindow.
      searchBoxID = 'places-search';

  // Abort if google isn't found.
  if (!google) {
    console.warn('Google Maps API not found.');
    global.map = null;  // Needs to be set explicitly since an element with id of "map" might be returned instead.
    return;
  }

  init();

  global.map = {
    addMarker: addMarker,
    centerOn: centerOn,
    closeInfoWindow: closeInfoWindow,
    getPlaceDetails: getPlaceDetails,
    modifyMarker: modifyMarker,
    onBoundsChange: onBoundsChange,
    onMapDblClick: onMapDblClick,
    onMarkerClick: onMarkerClick,
    onPlacesChanged: onPlacesChanged,
    openInfoWindow: openInfoWindow,
    removeMarker: removeMarker,
    setInfoWindowContent: setInfoWindowContent,
    visibleOnMap: visibleOnMap
  };

  /**
   * Creates a marker and adds it to the map.
   */
  function addMarker(markerData) {
    markerData.map = map;
    markerData.animation = google.maps.Animation.DROP;

    // Normalize id to string.
    markerData.id = markerData.id.toString();

    var marker = new google.maps.Marker(markerData);
    markers.push(marker);
  }

  /**
   * Centers the map on the marker or set of markers.
   */
  function centerOn(markerIDs) {
    if (!Array.isArray(markerIDs)) {
      // Simple case: A single marker was passed.

      var marker = getMarker(markerIDs);
      map.panTo(marker.getPosition());
    } else {
      // An array of multiple markers.

      var bounds = new google.maps.LatLngBounds();

      markerIDs.forEach(function(id) {
        bounds.extend(getMarker(id).getPosition());
      });

      map.fitBounds(bounds);
    }
  }

  /**
   * Closes the infowindow.
   */
  function closeInfoWindow() {
    infoWindow.close();
  }

  /**
   * Returns the marker matching the given id.
   */
  function getMarker(id) {
    // Normalize id to string.
    id = id.toString();

    for (var i = 0; i < markers.length; i++) {
      if (markers[i].id === id) {
        return markers[i];
      }
    }

    // If we made it here, the marker wasn't found.
    return null;
  }

  /**
   * Invokes the callback with a Google Maps PlaceResult.
   * @callback {googlePlaceDetailsResults} cb
   * @param {string} markerID
   * @returns {object} - A Google Maps PlaceResult object, with properties specified here: https://developers.google.com/maps/documentation/javascript/reference#PlaceResult
   */
  function getPlaceDetails(cb, markerID) {
    var result;

    // The marker ID is the place ID as long as the marker isn't custom.
    places.getDetails({placeId: markerID}, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        result = place;
      }
    });

    cb(result);
  }

  /**
   * Initializes the map and related services.
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

    // Initialize the info window.
    infoWindow = new google.maps.InfoWindow();
  }

  /**
   * Modifies a marker on the map.
   */
  function modifyMarker(markerID, newData) {
    var marker = getMarker(markerID);

    if (marker) {
      // TODO Other data modifications.

      if (newData.hasOwnProperty('visible')) {
        marker.setVisible(newData.visible);
      }
    } else {
      console.warn('Failed to modify marker because it wasn\'t found.');
    }
  }

  /**
   * Adds a `bounds_changed` event listener to the map and calls the function `fn`
   * when the event fires.
   */
  function onBoundsChange(fn) {
    map.addListener('bounds_changed', fn);
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
   * Adds a `places_changed` event listener to the search box and calls the given
   * function `fn` when the event fires.
   */
  function onPlacesChanged(fn) {
    searchBox.addListener('places_changed', fn);
  }

  /**
   * Opens the info window on the identified marker.
   */
  function openInfoWindow(markerID) {
    var marker = getMarker(markerID);

    infoWindow.open(map, marker);
  }

  /**
   * Removes a marker from the map.
   */
  function removeMarker(markerID) {
    var marker = getMarker(markerID);

    if (marker) {
      marker.setMap(null);
      markers.splice(markers.indexOf(marker), 1);
    } else {
      console.warn('Failed to remove marker because it wasn\'t found.');
    }
  }

  /**
   * Sets the content of the info window.
   */
  function setInfoWindowContent(content) {
    infoWindow.setContent(content);
  }

  /**
   * Returns true if the marker is currently within the map's visible bounds,
   * otherwise returns false.
   */
  function visibleOnMap(markerID) {
    var marker = getMarker(markerID);

    return map.getBounds().contains(marker.getPosition());
  }
})(this);
