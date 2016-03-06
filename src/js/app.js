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

    // Create a collection of map markers and folders.
    self.markers = ko.observableArray([]);

    // Initialize the App View Model.
    init();

    // Provide methods for adding, modifying, and removing map markers.
    self.addMarker = function() {};

    self.modifyMarker = function() {};

    self.removeMarker = function() {};

    // Provide methods for adding, modifying, and removing map marker folders.
    self.addFolder = function() {};

    self.modifyFolder = function() {};

    self.removeFolder = function() {};

    // Provide a method for toggling the sidebar between collapsed and expanded.

    // Provide a method for toggling a marker folder between collapsed and expanded.

    // Provide a method for centering on a marker or set of markers.

    // Provide methods for filtering markers by title and visibility.


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
      map.searchBox.addListener('places_changed', function() {
        var places = this.getPlaces(),
            data;

        places.forEach(function(place) {
          // var icon = {
          //   url: place.icon,
          //   size: new google.maps.Size(71, 71),
          //   origin: new google.maps.Point(0, 0),
          //   anchor: new google.maps.Point(17, 34),
          //   scaledSize: new google.maps.Size(25, 25)
          // };

          // Create marker data for each place.
          data = {
            title: place.name,
            position: place.geometry.location
          };

          map.addMarker(data);
          self.markers.push(new Marker(data));
        });
      });
    }

    /**
     * Stores self.markers to local storage as a JSON string.
     */
    function storeMarkers() {
      localStorage.setItem(storageKeys.MARKERS, ko.toJSON(self.markers));
    }

  }

  ko.applyBindings(new AppViewModel());
})(this);
