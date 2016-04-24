// Google Maps functionality.

(function(global) {
  var document = global.document,
      localStorage = global.localStorage,
      storageKeys = {
        MAPOPTIONS: 'mapOptions'
      },
      google,         // The Google Maps API.
      map,            // The Google Map.
      markers = [],   // The Google Map Markers.
      places,         // The Google Places Service.
      searchBox,      // The Google Places SearchBox.
      infoWindow,     // The Google Map InfoWindow.
      unsuspendScrollZoomListener;  // The infowindow 'closeclick' listener to unsuspend scroll zooming.


  global.map = {
    addMarker: addMarker,
    centerOn: centerOn,
    closeInfoWindow: closeInfoWindow,
    getInfoWindowContent: getInfoWindowContent,
    getPlaceDetails: getPlaceDetails,
    init: init,
    modifyMarker: modifyMarker,
    onBoundsChange: onBoundsChange,
    onInfoWindowClose: onInfoWindowClose,
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
   * Closes the infowindow after triggering its `closeclick` event.
   */
  function closeInfoWindow() {
    google.maps.event.trigger(infoWindow, 'closeclick');
    infoWindow.close();
  }

  /**
   * Returns the info window's content.
   */
  function getInfoWindowContent() {
    return infoWindow.getContent();
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
   * Invokes the callback with an object including a Google Maps PlaceResult.
   * @param {infoReady} cb
   * @param {string} markerID
   * @param {object} [maxPhotoDimensions={maxWidth: 300, maxHeight: 300}]
   */
  function getPlaceDetails(cb, markerID, maxPhotoDimensions) {
    var info = {
      place: markerID,
      source: 'google',
      results: []
    };

    // Abort if required parameters weren't passed.
    if (typeof cb !== 'function') {
      console.warn('No callback passed to `map.getPlaceDetails`.');
      return;
    }
    /*jshint eqnull:true */
    if (markerID == null) {
      console.warn('No marker ID passed to `map.getPlaceDetails`.');
      cb(info);
      return;
    }

    maxPhotoDimensions = maxPhotoDimensions || {maxWidth: 300, maxHeight: 300};

    // The marker ID is the place ID as long as the marker isn't custom.
    places.getDetails({placeId: markerID}, detailsCb);

    function detailsCb(place, status) {

      if (status === google.maps.places.PlacesServiceStatus.OK) {
        info.results.push(formatDetails(place));
      }

      cb(info);
    }

    function formatDetails(place) {
      var details = {};

      details.address = place.formatted_address;
      details.phone = place.formatted_phone_number;
      details.internationalPhone = place.international_phone_number;
      details.attributions = place.html_attributions;  // String array.
      details.icon = place.icon;
      details.name = place.name;  // NOTE Possibly raw text as typed by user.
      details.photos = formatPhotos(place.photos);
      details.price = formatPriceLevel(place.price_level);
      details.rating = place.rating;  // 1.0 to 5.0
      details.reviews = formatReviews(place.reviews);
      details.types = place.types;  // String array. Example: ['restaurant', 'establishment']
      details.googlePage = place.url;  // Official Google-owned page for the place.
      details.utcOffset = place.utc_offset;
      details.website = place.website;  // The place's website. For example: a business' homepage.

      return details;
    }

    function formatAspects(aspects) {
      if (!Array.isArray(aspects)) {
        return;
      }

      return aspects.map(function(aspect) {
        return {
          type: aspect.type,
          rating: aspect.rating
        };
      });
    }

    function formatPhotos(photos) {
      if (!Array.isArray(photos)) {
        return;
      }

      return photos.map(function(photo) {
        return {
          src: photo.getUrl({  // Either maxHeight or maxWidth must be provided.
            maxHeight: maxPhotoDimensions.maxHeight,
            maxWidth: maxPhotoDimensions.maxWidth
          }),
          attributions: photo.html_attributions,
          fullsize: photo.getUrl({
            maxWidth: 1600  // Largest size allowed.
          })
        };
      });
    }

    function formatPriceLevel(priceLevel) {
      switch (priceLevel) {
        case 0:
          return 'Free';
        case 1:
          return 'Inexpensive';
        case 2:
          return 'Moderate';
        case 3:
          return 'Expensive';
        case 4:
          return 'Very Expensive';
        default:
          return;
      }
    }

    function formatReviews(reviews) {
      if (!Array.isArray(reviews)) {
        return;
      }

      return reviews.map(function(review) {
        return {
          aspects: formatAspects(review.aspects),
          author: {
            name: review.author_name,
            profile: review.author_url
          },
          language: review.language,
          text: review.text
        };
      });
    }
  }

  /**
   * Initializes the map and related services.
   */
  function init() {
    google = global.google;

    // Throw an error if google isn't found.
    if (!google) {
      throw new Error('Google Maps API not found.');
    }

    // Throw an error if the google map wasn't initialized.
    if (!global._map) {
      throw new Error('Google Map not initialized.');
    }

    map = _map.map;
    places = _map.places;
    searchBox = _map.searchBox;
    infoWindow = _map.infoWindow;
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
    return map.addListener('bounds_changed', fn);
  }

  /**
   * Adds a `closeclick` event listener to the info window and calls the function `fn`
   * when the event fires. The `closeclick` event is also triggered when the
   * `closeInfoWindow` function is invoked.
   */
  function onInfoWindowClose(fn) {
    return infoWindow.addListener('closeclick', fn);
  }

  /**
   * Adds a `dblclick` event listener to the map and calls the function `fn` when
   * the event fires.
   */
  function onMapDblClick(fn) {
    return map.addListener('dblclick', fn);
  }

  /**
   * Adds a `click` event listener to the marker and calls the function `fn` when
   * the event fires.
   */
  function onMarkerClick(markerID, fn) {
    var marker = getMarker(markerID);

    return marker.addListener('click', fn);
  }

  /**
   * Adds a `places_changed` event listener to the search box and calls the given
   * function `fn` when the event fires.
   */
  function onPlacesChanged(fn) {
    return searchBox.addListener('places_changed', fn);
  }

  /**
   * Opens the info window on the identified marker and suspends scroll zooming.
   */
  function openInfoWindow(markerID) {
    var marker = getMarker(markerID),
        mapOpts = JSON.parse(localStorage.getItem(storageKeys.MAPOPTIONS)),
        canScroll = mapOpts.hasOwnProperty('scrollwheel') ? mapOpts.scrollwheel : true;

    // If scroll zooming isn't disabled in the saved map options...
    if (canScroll) {
      suspendScrollZoom();
    }

    infoWindow.open(map, marker);

    /**
     * Suspends scroll zooming while the info window is open.
     */
    function suspendScrollZoom() {
      // If scrolling isn't already suspended...
      if (!unsuspendScrollZoomListener) {
        unsuspendScrollZoomListener = infoWindow.addListener('closeclick', unsuspend);
        map.setOptions({scrollwheel: false});
      }

      function unsuspend() {
        map.setOptions({scrollwheel: true});
        unsuspendScrollZoomListener.remove();
        unsuspendScrollZoomListener = null;
      }
    }
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
