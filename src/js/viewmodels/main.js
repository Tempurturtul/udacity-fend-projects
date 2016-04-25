// The Main View Model.

(function(global) {

  global.viewmodels = global.viewmodels || {};

  global.viewmodels.Main = Main;

  function Main() {
    var self = this,
        document = global.document,
        localStorage = global.localStorage,
        storageKeys = {
          MARKERS: 'markers'
        },
        defaults = {
          // Five locations in New York, US. Credit to my beautiful native New Yorker wife: Ezzie.
          markers: [
            // Times Square.
            {
              title: 'Times Square',
              id: 'ChIJmQJIxlVYwokRLgeuocVOGVU',  // A Google Places ID.
              position: {
                lat: 40.758895,
                lng: -73.98513100000002
              }
            },
            // NY Public Library.
            {
              title: 'New York Public Library - Stephen A. Schwarzman Building',
              id: 'ChIJqaiomQBZwokRTHOaUG7fUTs',  // A Google Places ID.
              position: {
                lat: 40.75318230000001,
                lng: -73.98225339999999
              }
            },
            // Museums folder.
            {
              name: 'Museums',
              contents: [
                // The Met.
                {
                  title: 'The Metropolitan Museum of Art',
                  id: 'ChIJb8Jg9pZYwokR-qHGtvSkLzs',  // A Google Places ID.
                  position: {
                    lat: 40.7794366,
                    lng: -73.96324400000003
                  }
                },
                // MoMA
                {
                  title: 'The Museum of Modern Art',
                  id: 'ChIJKxDbe_lYwokRVf__s8CPn-o',  // A Google Places ID.
                  position: {
                    lat: 40.7614327,
                    lng: -73.97762160000002
                  }
                },
                // Museum of Natural History
                {
                  title: 'American Museum of Natural History',
                  id: 'ChIJCXoPsPRYwokRsV1MYnKBfaI',  // A Google Places ID.
                  position: {
                    lat: 40.78132409999999,
                    lng: -73.97398820000001
                  }
                }
              ]
            }
          ]
        },
        map = global.map,
        ko = global.ko,
        models = global.models,
        viewmodels = global.viewmodels,
        selectedMarkerID;

    // Method for creating or recreating a marker. Returns the marker.
    self.createOrRecreateMarker = function(marker) {
      if (marker instanceof models.Marker) {
        // The marker is being recreated, remove it from the map first (by ID because it's probably been edited).
        self.removeMarker(marker.id(), true);
      } else {
        marker = new models.Marker(marker);
      }

      var data = ko.toJS(marker);

      map.addMarker(data);

      map.onMarkerClick(data.id, function() {
        self.markerClicked(marker);
      });

      return marker;
    };

    // Searches an array and returns all markers within it and within any sub-arrays.
    self.getAllMarkers = function(arr) {
      var result = [];

      arr.forEach(function(elem) {
        elem = ko.unwrap(elem);

        // For every element in the given array...
        if (elem instanceof models.Marker) {
          // If the element is a marker, push it to the accumulation array.
          result.push(elem);
        } else if (Array.isArray(elem)) {
          // Else if it's an array, search it and concat the results to the accumulation array.
          result = result.concat(self.getAllMarkers(elem));
        } else if (typeof elem === 'object') {
          // Else if it's an object...
          for (var prop in elem) {
            prop = ko.unwrap(elem[prop]);

            // For each of its properties...
            if (Array.isArray(prop)) {
              // If it's an array, search it and concat the results to the accumulation array.
              result = result.concat(self.getAllMarkers(prop));
            } else if (prop instanceof models.Marker) {
              // Else if it's a marker, push it to the accumulation array.
              result.push(prop);
            }
          }
        }
      });

      return result;
    };

    // Method for retrieving a marker's or folder's most immediate containing array.
    self.getContainingArray = function(markerOrFolder) {
      return search([self.markers, self.markersForm.pending]);

      function search(obsArrs) {
        var deeper = [],
            obsArr,
            i, j, len;

        // For each observable array...
        for (i = 0; i < obsArrs.length; i++) {
          obsArr = obsArrs[i];

          // For each item in the observable array...
          for (j = 0, len = obsArr().length; j < len; j++) {
            if (obsArr()[j].contents) {
              // Folder
              if (obsArr()[j] === markerOrFolder) {
                // The folder we're searching for.
                return obsArr;
              } else {
                // Push the contents to the deeper search array.
                deeper.push(obsArr()[j].contents);
              }
            } else if (obsArr()[j] === markerOrFolder) {
              // The marker we're looking for.
              return obsArr;
            }
          }
        }

        // Not found yet, keep looking if possible.
        if (deeper.length) {
          return search(deeper);
        } else {
          return null;
        }
      }
    };

    // Method for retrieving a marker by id.
    self.getMarker = function(id) {
      // Normalize id as a string.
      id = id.toString();

      return search(self.markers()) || search(self.markersForm.pending());

      function search(arr) {
        var deeper = [];

        // Handle the pending array where the actual marker is stored in the marker property.
        if (arr.length && arr[0].marker) {
          arr = arr.map(function(obj) {
            return obj.marker;
          });
        }

        for (var i = 0; i < arr.length; i++) {

          if (arr[i].contents) {
            // Folder
            var contents = arr[i].contents();

            for (var j = 0; j < contents.length; j++) {
              deeper.push(contents[j]);
            }
          } else if (arr[i].id().toString() === id) {
            return arr[i];
          }
        }

        // Need to search deeper.
        if (deeper.length) {
          return search(deeper);
        } else {
          return null;
        }
      }
    };

    self.infoWindow = null;  // The info-window view model.

    self.markerClicked = function(marker) {
      // Close the sidebar if it isn't set to stay open.
      if (!self.sidebar.stayOpen()) {
        self.sidebar.expanded(false);
      }

      // Clear selected state of all markers.
      clearSelected();

      // Set the new selected marker.
      marker.selected(true);

      // Bounce the marker.
      map.bounceMarker(marker.id());

      // Center the map on the marker.
      map.centerOn(marker.id());

      // Open the info-window on the marker.
      self.infoWindow.open(marker);
    };

    // A collection of map markers and folders.
    self.markers = ko.observableArray([]);

    self.markersForm = null;  // The markers form view model.

    // Removes the marker, optionally from the map only.
    self.removeMarker = function(marker, fromMapOnly) {
      // If a marker ID was passed, get the corresponding marker.
      if (!(marker instanceof models.Marker)) {
        marker = self.getMarker(marker);
      }

      // If the info window is set to this marker, close it.
      if (self.infoWindow.marker() && self.infoWindow.marker().id() === marker.id()) {
        self.infoWindow.close();
      }

      if (!fromMapOnly) {
        // Remove the marker from the array it's a part of.
        var obsArr = self.getContainingArray(marker),
            arr = obsArr(),
            index;

        index = arr.indexOf(marker);

        arr.splice(index, 1);
        obsArr(arr);

        // Save the change.
        self.saveMarkers();
      }

      // Remove the marker from the map.
      map.removeMarker(marker.id());
    };

    // Saves self.markers to local storage as a JSON string.
    self.saveMarkers = function() {
      localStorage.setItem(storageKeys.MARKERS, ko.toJSON(self.markers));
    };

    self.sidebar = null;  // The sidebar view model.

    // Initialize the App View Model.
    init();

    /**
     * Sets all markers' selected state to false.
     */
    function clearSelected() {
      self.getAllMarkers(self.markers()).forEach(function(marker) {
        if (marker.selected()) {
          marker.selected(false);
        }
      });
    }

    /**
     * Called when the user double clicks on the map. Creates a marker at the
     * clicked location and opens the info-window on it in edit mode.
     */
    function confirmCustomMarker(e) {
      // Create a marker for the location clicked.
      var marker = self.createOrRecreateMarker({
        position: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
      });

      // Push the created marker to the markers array.
      self.markers.push(marker);

      // Save the markers.
      self.saveMarkers();

      // Open the info-window in edit mode on the marker.
      self.infoWindow.open(marker);
      self.infoWindow.edit();
    }

    /**
     * Creates and returns a folder.
     */
    function createFolder(data) {
      data.contents = createFolderContents(data.contents);
      var folder = new models.Folder(data);

      return folder;
    }

    /**
     * Creates and returns an array of markers and/or folders.
     */
    function createFolderContents(contents) {
      var results = [];

      contents.forEach(function(data) {
        if (data.contents) {
          results.push(createFolder(data));
        } else {
          results.push(self.createOrRecreateMarker(data));
        }
      });

      return results;
    }

    /**
     * Initializes the AppViewModel.
     */
    function init() {
      var arr = JSON.parse(localStorage.getItem(storageKeys.MARKERS)) || defaults.markers;

      self.markersForm = new viewmodels.MarkersForm(self);
      self.sidebar = new viewmodels.Sidebar(self);
      self.infoWindow = new viewmodels.InfoWindow(self);

      // Populate the markers observable array.
      arr.forEach(function(data) {
        if (data.contents) {
          var folder = createFolder(data);
          self.markers.push(folder);
        } else {
          var marker = self.createOrRecreateMarker(data);
          self.markers.push(marker);
        }
      });

      // Call selectPlaces when the user selects a search result.
      map.onPlacesChanged(selectPlaces);

      // Call confirmCustomMarker when the user double clicks on the map.
      map.onMapDblClick(confirmCustomMarker);
    }

    /**
     * Called when the user selects a place or set of places in the map search box.
     * Opens the markers form populated with the place(s) selected.
     */
    function selectPlaces() {
      var places = this.getPlaces();

      // Create a marker for each place and push it to the pending markers array
      // along with the default confirmed value.
      places.forEach(function(place) {
        var marker = self.createOrRecreateMarker({
          id: place.place_id,
          title: place.name,
          position: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
        });

        self.markersForm.pending.push(marker);
      });

      // Open the confirm markers form.
      self.markersForm.open();
    }
  }

})(this);
