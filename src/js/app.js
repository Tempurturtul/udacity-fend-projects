// Knockout-controlled functionality.

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

    // A collection of pending map markers.
    self.pendingMarkers = ko.observableArray([]);

    // Is the confirm markers form visible?
    self.markersForm = ko.observable(false);

    // Provide methods for adding, modifying, and removing map markers.
    self.addMarker = function(marker) {
      // Add a marker.

      map.addMarker(ko.toJS(marker));
      self.markers.push(marker);
      storeMarkers();
    };

    self.modifyMarker = function(marker) {
      // Modify a marker.

    };

    self.removeMarker = function(marker) {
      // Remove a marker.

    };

    // Provide methods for adding, modifying, and removing map marker folders.
    self.addFolder = function(folder) {
      // Add a folder.

      self.markers.push(folder);
      storeMarkers();
    };

    self.modifyFolder = function(folder) {
      // Modify a folder.

    };

    self.removeFolder = function(folder) {
      // Remove a folder.

    };

    // Provide a method for toggling the sidebar between collapsed and expanded.

    // Provide a method for toggling the confirm markers form between visible and hidden.
    self.toggleMarkersForm = function() {
      self.markersForm(!self.markersForm());
    };

    // Provide a method for toggling a marker folder between collapsed and expanded.

    // Provide a method for centering on a marker or set of markers.

    // Provide methods for filtering markers by title and visibility.

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
          map.addMarker(data);
          self.markers.push(new Marker(data));
        }
      });

      // Listen for the event fired when the user selects a search result.
      map.searchBox.addListener('places_changed', selectPlaces);
    }

    /**
     * Stores self.markers to local storage as a JSON string.
     */
    function storeMarkers() {
      localStorage.setItem(storageKeys.MARKERS, ko.toJSON(self.markers));
    }

    /**
     * Called when the user selects a place or set of places in the map search box.
     * Opens a form that the user can use to modify and confirm or cancel map marker
     * creation.
     */
    function selectPlaces() {
      var places = this.getPlaces();

      // Clear the pending markers array.
      self.pendingMarkers([]);

      // Create a marker for each place and push it to the pending markers array
      // along with the default confirmed value.
      places.forEach(function(place) {
        // TODO Icon.
        var marker = new Marker({
          title: place.name,
          position: place.geometry.location
        });

        self.pendingMarkers.push({
          marker: marker,
          confirmed: ko.observable(true)
        });
      });

      // Open the confirm markers form.
      self.toggleMarkersForm();
    }

  }

  ko.applyBindings(new AppViewModel());
})(this);
