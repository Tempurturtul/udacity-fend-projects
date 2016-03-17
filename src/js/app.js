// Core knockout-controlled functionality.

// WORK ON THIS NEXT:
// - Creating and renaming folders.
// - Sidebar toggling.
// - Marker filtering.

// WORK ON THIS LATER:
// - Hide markers on the map when they're hidden on the list.
// - Collapse buttons for folders.
// - Reordering of list items (including moving markers in to and out of folders).
// - Drag handles for list items.
// - Map centering for markers.
// - Map centering for folders (including center buttons).
// - Information for the info window (including error handling).
// - Allow the user to edit/set more things when creating/modifying markers.
// - Useful defaults.
// - Saving markers, folders, and map options.
// - ...?
// - Styling.

(function(global) {
  var ko = global.ko,
      uuid = global.UUID,
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
      appViewModel = new AppViewModel();

  // Marker Model
  function Marker(data) {
    // TODO Additional (google.maps) properties to consider:
    //  data.draggable - Makes the marker draggable.
    //  data.icon - Icon for the marker.
    //  data.label - First letter of this string is displayed on marker.
    //  data.visible - Useful for hiding markers.
    //  data.zIndex - Useful for sorting markers by folder depth.

    this.id = ko.observable(data.id.toString() || uuid.generate().toString());
    this.position = ko.observable(data.position || {lat: 0, lng: 0});
    this.title = ko.observable(data.title || 'New Marker');
  }

  // Folder Model
  function Folder(data) {
    // The name of the folder.
    this.name = ko.observable(data.name || 'New Folder');
    // The folder contents (marker and/or marker folder array).
    this.contents = ko.observableArray(data.contents || []);
    // Whether or not the folder is collapsed.
    this.collapsed = ko.observable(data.collapsed || false);
  }

  // App View Model
  function AppViewModel() {
    var self = this;

    // A collection of map markers and folders.
    self.markers = ko.observableArray([]);

    // Sidebar functionality.
    // TODO:
    //  - Provide a method for toggling a marker folder between collapsed and expanded.
    //  - Provide a method for centering on a marker or set of markers.
    //  - Provide methods for filtering markers by title and visibility.
    self.sidebar = {
      expanded: ko.observable(false),

      toggle: function() {
        console.log('sidebar toggle');
        self.sidebar.expanded(!self.sidebar.expanded());
      },

      addFolder: function(folder) {
        // Add a folder.
      },

      modifyFolder: function(folder) {
        // Modify a folder.

      },

      removeFolder: function(folder) {
        // Remove a folder.

      }
    };

    // Markers form functionality.
    self.markersForm = {
      pending: ko.observableArray([]),

      visible: ko.observable(false),

      open: function() {
        if (!self.markersForm.visible()) {
          self.markersForm.visible(true);
        }
      },

      close: function() {
        if (self.markersForm.visible()) {
          self.markersForm.visible(false);
        }
      },

      submit: function() {
        // Close the markers form.
        self.markersForm.close();

        // Filter the confirmed markers out of the pending array and into the markers
        // array.
        self.markersForm.pending(self.markersForm.pending().filter(function(pending) {
          if (pending.confirmed()) {
            // Move to the markers array.
            self.markers.push(pending.marker);
            // TODO Save. Subscribe a save method to self.markers?
            return false;
          } else {
            return true;
          }
        }));

        // Clear the pending markers array.
        self.markersForm.clearPending();
      },

      cancel: function() {
        // Close the markers form.
        self.markersForm.close();

        // Clear the pending markers array.
        self.markersForm.clearPending();
      },

      clearPending: function() {
        self.markersForm.pending().forEach(function(pending) {
          map.removeMarker(pending.marker.id());
        });

        self.markersForm.pending([]);
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

    // Method for retrieving a marker's most immediate containing array.
    self.getContainingArray = function(id) {
      // Normalize id as a string.
      id = id.toString();

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
              if (obsArr()[j].marker.id() === id) {
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
                deeper.push(obsArr()[j].contents);
              } else if (obsArr()[j].id() === id) {
                // The observable array we're looking for.
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

    // Method for creating or recreating a marker. Returns the marker.
    self.createOrRecreateMarker = function(marker) {
      var data;

      if (marker instanceof Marker) {
        data = ko.toJS(marker);
      } else {
        data = marker;
        marker = new Marker(marker);
      }

      map.addMarker(data);

      map.onMarkerClick(data.id, function() {
        self.openInfoWindow(marker);
      });

      return marker;
    };

    // Method for opening the info window on a marker.
    self.openInfoWindow = function(marker) {
      // Create new content for the info window related to this marker.
      var content = createInfoWindowContent(marker);

      // Close the info window if it's open.
      map.closeInfoWindow();
      // Change the info window's content.
      map.setInfoWindowContent(content);
      // Open the info window on this marker.
      map.openInfoWindow(marker.id());

      // Apply knockout bindings to the info window's newly created content.
      ko.applyBindings(appViewModel, content);

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

    // Method for opening or closing a folder.
    self.toggleFolder = function(folder) {
      folder.collapsed(!folder.collapsed());
    };

    // Initialize the App View Model.
    init();

    // Private methods.

    /**
     * Initializes self.markers with markers and marker folders from local storage,
     * or from defaults if local storage is empty; adds initial markers to the map;
     * Adds an event listener to the map search box.
     */
    function init() {
      var arr = JSON.parse(localStorage.getItem(storageKeys.MARKERS)) || defaults.markers;

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
     * Creates and returns a folder.
     */
    function createFolder(data) {
      data.contents = createFolderContents(data.contents);
      var folder = new Folder(data);

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
          id: uuid.generate(),
          title: place.name,
          position: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
        });

        self.markersForm.pending.push({
          marker: marker,
          confirmed: ko.observable(true)
        });
      });

      // Open the confirm markers form.
      self.markersForm.open();
    }

    /**
     * Called when the user double clicks on the map. Opens the markers form populated
     * with a marker created using the location clicked.
     */
    function confirmCustomMarker(e) {
      // Create a marker for the location clicked.
      var marker = self.createOrRecreateMarker({
        id: uuid.generate(),
        title: 'Custom Marker',
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
  }

  // Custom Component
  ko.components.register('info-window', {
    viewModel: function(params) {
      var self = this,
          markerID = params.markerID,
          getMarker = params.getMarker,
          getContainingArray = params.getContainingArray,
          recreateMarker = params.recreateMarker;

      self.marker = ko.observable(getMarker(markerID));

      var preChangeMarkerData = ko.toJS(self.marker());

      self.displayInfo = ko.observable(true);
      self.displayEdit = ko.observable(false);

      self.modify = function() {
        self.displayInfo(false);
        self.displayEdit(true);
      };

      self.remove = function() {
        // Remove the marker from the array it's a part of.
        var obsArr = getContainingArray(self.marker().id()),
            arr = obsArr(),
            index;

        if (arr.length && arr[0].marker) {
          // The pending array. Markers are contained within the marker property.
          index = arr
            .map(function(data) {
              return data.marker;
            })
            .indexOf(self.marker());
        } else {
          index = arr.indexOf(self.marker());
        }

        arr.splice(index, 1);
        obsArr(arr);

        // Remove the marker from the map.
        map.removeMarker(self.marker().id());
      };

      self.update = function() {
        map.removeMarker(self.marker().id());
        recreateMarker(self.marker());
      };

      self.restore = function() {
        self.marker().title(preChangeMarkerData.title);
        map.closeInfoWindow();
      };
    },

    template: '<div data-bind="visible: displayInfo">' +
              '<p data-bind="text: marker().title"></p>' +
              '<button data-bind="click: modify">Modify</button>' +
              '<button data-bind="click: remove">Remove</button>'+
              '</div>' +
              '<div data-bind="visible: displayEdit">' +
              '<input data-bind="value: marker().title"></input>' +
              '<button data-bind="click: restore">Cancel</button>' +
              '<button data-bind="click: update">Confirm</button>' +
              '</div>'
  });

  // Custom Binding (Source: http://stackoverflow.com/a/10573792)
  ko.bindingHandlers.hidden = {
    update: function(element, valueAccessor) {
      ko.bindingHandlers.visible.update(element, function() {
        return !ko.utils.unwrapObservable(valueAccessor());
      });
    }
  };

  ko.applyBindings(appViewModel);
})(this);
