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
          markers: [
            {
              id: 0,
              position: {lat: 35.67, lng: 139.6},
              title: 'Default Marker 1'
            },
            {
              id: 1,
              position: {lat: 35.67, lng: 139.7},
              title: 'Default Marker 2'
            },
            {
              name: 'Default Folder 1',
              contents: [
                {
                  id: 2,
                  position: {lat: 35.66, lng: 139.7},
                  title: 'Default Marker 1.1'
                },
                {
                  name: 'Default Folder 1.1',
                  contents: [
                    {
                      id: 3,
                      position: {lat: 35.65, lng: 139.7},
                      title: 'Default Marker 1.1.1'
                    },
                    {
                      id: 4,
                      position: {lat: 35.64, lng: 139.7},
                      title: 'Default Marker 1.1.2'
                    }
                  ]
                }
              ]
            },
            {
              id: 5,
              position: {lat: 35.67, lng: 139.8},
              title: 'Default Marker 3'
            }
          ]
        },
        map = global.map,
        ko = global.ko,
        models = global.models,
        viewmodels = global.viewmodels,
        markersForm,  // The markers form view model.
        sidebar;      // The sidebar view model.

    // Method for creating or recreating a marker. Returns the marker.
    self.createOrRecreateMarker = function(marker) {
      var data;

      if (marker instanceof models.Marker) {
        data = ko.toJS(marker);
      } else {
        data = marker;
        marker = new models.Marker(marker);
      }

      map.addMarker(data);

      map.onMarkerClick(data.id, function() {
        self.openInfoWindow(marker);
      });

      return marker;
    };

    // Method for retrieving a marker's or folder's most immediate containing array.
    self.getContainingArray = function(markerOrFolder) {
      return search([self.markers, markersForm.pending]);

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

      return search(self.markers()) || search(markersForm.pending());

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

    // A collection of map markers and folders.
    self.markers = ko.observableArray([]);

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
    }

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
      markersForm.pending.push({
        marker: marker,
        confirmed: ko.observable(true)
      });

      // Open the confirm markers form.
      markersForm.open();
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

      markersForm = new viewmodels.MarkersForm(self);
      sidebar = new viewmodels.Sidebar(self);

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

        markersForm.pending.push({
          marker: marker,
          confirmed: ko.observable(true)
        });
      });

      // Open the confirm markers form.
      markersForm.open();
    }
  }

})(this);
