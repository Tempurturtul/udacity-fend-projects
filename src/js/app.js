// Core knockout-controlled functionality.

(function(global) {
  var ko = global.ko,
      localStorage = global.localStorage,
      storageKeys = {
        MARKERS: 'markers'
      },
      defaults = {
        markers: [
          {
            position: {lat: 35.67, lng: 139.6},
            title: 'Default Marker 1'
          },
          {
            position: {lat: 35.67, lng: 139.7},
            title: 'Default Marker 2'
          },
          {
            name: 'Default Folder 1',
            contents: [
              {
                position: {lat: 35.66, lng: 139.7},
                title: 'Default Marker 1.1'
              },
              {
                name: 'Default Folder 1.1',
                contents: [
                  {
                    position: {lat: 35.65, lng: 139.7},
                    title: 'Default Marker 1.1.1'
                  },
                  {
                    position: {lat: 35.64, lng: 139.7},
                    title: 'Default Marker 1.1.2'
                  }
                ]
              }
            ]
          },
          {
            position: {lat: 35.67, lng: 139.8},
            title: 'Default Marker 3'
          }
        ]
      },
      map = global.map;

  // Marker Model
  function Marker(data) {
    // TODO Additional (google.maps) properties to consider:
    //  data.draggable - Makes the marker draggable.
    //  data.icon - Icon for the marker.
    //  data.label - First letter of this string is displayed on marker.
    //  data.visible - Useful for hiding markers.
    //  data.zIndex - Useful for sorting markers by folder depth.

    this.position = ko.observable(data.position);
    this.title = ko.observable(data.title);
  }

  // Marker Folder Model
  function MarkerFolder(data) {
    // The name of the folder.
    this.name = ko.observable(data.name);
    // The folder contents (marker and/or marker folder array).
    this.contents = ko.observableArray(createContents());

    /**
     * Creates an array of markers and marker folders from data.contents. If any
     * markers are created, adds them to the map.
     */
    function createContents() {
      var results = [];

      data.contents.forEach(function(item) {
        if (item.contents) {
          // Folder.
          results.push(new MarkerFolder(item));
        } else {
          // Marker.
          map.addMarker(item);
          results.push(new Marker(item));
        }
      });

      return results;
    }
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

        self.markers.push(folder);
        storeMarkers();
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
      pendingMarkers: ko.observableArray([]),

      visible: ko.observable(false),

      toggle: function() {
        self.markersForm.visible(!self.markersForm.visible());
      },

      submit: function() {
        // Add the confirmed markers.
        self.markersForm.pendingMarkers().forEach(function(pending) {
          if (pending.confirmed()) {
            self.markersForm.addMarker(pending.marker);
          }
        });

        // Toggle the markers form.
        self.markersForm.toggle();

        // Clear the pending markers array.
        self.markersForm.pendingMarkers([]);
      },

      cancel: function() {
        // Toggle the markers form.
        self.markersForm.toggle();

        // Clear the pending markers array.
        self.markersForm.pendingMarkers([]);
      },

      addMarker: function(marker) {
        // Add a marker.

        map.addMarker(ko.toJS(marker));
        self.markers.push(marker);
        storeMarkers();
      }
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
          // Folder.
          self.markers.push(new MarkerFolder(data));
        } else {
          // Marker.
          var marker = new Marker(data);

          map.addMarker(ko.toJS(marker));
          self.markers.push(marker);
        }
      });

      // Call selectPlaces when the user selects a search result.
      map.onPlacesChanged(selectPlaces);

      // Call createCustomMarker when the user double clicks on the map.
      map.onMapDblClick(createCustomMarker);
    }

    /**
     * Stores self.markers to local storage as a JSON string.
     */
    function storeMarkers() {
      localStorage.setItem(storageKeys.MARKERS, ko.toJSON(self.markers));
    }

    /**
     * Called when the user selects a place or set of places in the map search box.
     * Opens the markers form populated with the place(s) selected.
     */
    function selectPlaces() {
      var places = this.getPlaces();

      // Clear the pending markers array.
      self.markersForm.pendingMarkers([]);

      // Create a marker for each place and push it to the pending markers array
      // along with the default confirmed value.
      places.forEach(function(place) {
        // TODO Icon, etc.
        var marker = new Marker({
          title: place.name,
          position: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
        });

        self.markersForm.pendingMarkers.push({
          marker: marker,
          confirmed: ko.observable(true)
        });
      });

      // Open the confirm markers form.
      self.markersForm.toggle();
    }

    /**
     * Called when the user double clicks on the map. Opens the markers form populated
     * with a marker created using the location clicked.
     */
    function createCustomMarker(e) {
      // Clear the pending markers array.
      self.markersForm.pendingMarkers([]);

      // Create a marker for the location clicked.
      var marker = new Marker({
        title: 'Custom Marker',
        position: {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
      });

      // Push the created marker to the pending markers array.
      self.markersForm.pendingMarkers.push({
        marker: marker,
        confirmed: ko.observable(true)
      });

      // Open the confirm markers form.
      self.markersForm.toggle();
    }
  }

  ko.applyBindings(new AppViewModel());
})(this);
