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
        viewmodels = global.viewmodels;

    // Method for creating or recreating a marker. Returns the marker.
    self.createOrRecreateMarker = function(marker) {
      if (!(marker instanceof models.Marker)) {
        marker = new models.Marker(marker);
      }

      var data = ko.toJS(marker);

      map.addMarker(data);

      map.onMarkerClick(data.id, function() {
        self.openInfoWindow(marker);
      });

      return marker;
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

          if (obsArr().length && obsArr()[0].marker) {
            // The pending array. The actual marker is stored in the marker
            // property and there are no folders to worry about.
            for (j = 0, len = obsArr().length; j < len; j++) {
              if (obsArr()[j].marker === markerOrFolder) {
                // The observable array we're looking for.
                return obsArr;
              }
            }
          } else {
            // The markers array or a contents array. There may be a mix of
            // markers and folders.
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

    self.markerClicked = function(marker) {
      // Center the map on the marker.
      map.centerOn(marker.id());

      // Open the marker's info window.
      self.openInfoWindow(marker);
    };

    // A collection of map markers and folders.
    self.markers = ko.observableArray([]);

    self.markersForm = null;  // The markers form view model.

    // Opens the info window on a marker.
    self.openInfoWindow = function(marker) {
      // Create new content for the info window related to this marker.
      var content = createInfoWindowContent(marker);

      // Close the info window if it's open.
      map.closeInfoWindow();
      // Change the info window's content.
      map.setInfoWindowContent(content);
      // Open the info window on this marker.
      map.openInfoWindow(marker.id());

      // Apply knockout bindings to the newly created content.
      ko.applyBindings(self, content);

      /**
       * Returns an element intended for use as an info window's content. It
       * utilizes the custom component 'info-window'.
       */
      function createInfoWindowContent(marker) {
        var content = document.createElement('div');

        content.dataset.bind = 'component: { ' +
                                 'name: \'info-window\', ' +
                                 'params: { ' +
                                   'markerID: \'' + marker.id() + '\', ' +
                                   'getMarker: $root.getMarker, ' +
                                   'getContainingArray: $root.getContainingArray, ' +
                                   'recreateMarker: $root.createOrRecreateMarker' +
                                 '} ' +
                               '}';

        return content;
      }
    };

    self.sidebar = null;  // The sidebar view model.

    // Initialize the App View Model.
    init();

    /**
     * Called when the user double clicks on the map. Opens the markers form populated
     * with a marker created using the location clicked.
     */
    function confirmCustomMarker(e) {
      // Create a marker for the location clicked.
      var marker = self.createOrRecreateMarker({
        position: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
      });

      // Push the created marker to the pending markers array.
      self.markersForm.pending.push({
        marker: marker,
        confirmed: ko.observable(true)
      });

      // Open the confirm markers form.
      self.markersForm.open();
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
     * Saves self.markers to local storage as a JSON string.
     */
    function saveMarkers() {
      localStorage.setItem(storageKeys.MARKERS, ko.toJSON(self.markers));
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
        // TODO Icon, etc.

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
