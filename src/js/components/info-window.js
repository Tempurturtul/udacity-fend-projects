// The info-window custom component.
//   Dependencies: ko, map, placeInfo.

(function(global) {

  global.components = global.components || {};

  global.components.infoWindow = infoWindow;

  var infoWindow = {
    viewModel: function(params) {
      var self = this,
          getContainingArray = params.getContainingArray,
          getMarker = params.getMarker,
          markerID = params.markerID,
          recreateMarker = params.recreateMarker;

      self.marker = ko.observable(getMarker(markerID));

      // Used to restore the marker's state if editing is canceled.
      var preChangeMarkerData = ko.toJS(self.marker());

      self.editing = ko.observable(false);

      self.edit = function() {
        self.editing(true);
      };

      // The HTML string representing additional information.
      self.info = ko.observable();

      self.refresh = function() {
        var lat = self.marker().position().lat,
            lng = self.marker().position().lng;

        switch (self.source()) {
          case 'google':
            map.getPlaceDetails(infoReady, markerID);
            break;
          case 'flickr':
            placeInfo.sources.flickr(infoReady, {lat: lat, lng: lng});
            break;
          case 'foursquare':
            placeInfo.sources.foursquare(infoReady, {lat: lat, lng: lng});
            break;
          case 'wikipedia':
            placeInfo.sources.wikipedia(infoReady, {lat: lat, lng: lng});
            break;
        }

        function infoReady(info) {
          // TODO
          // Create an HTML string from info.
          // Set self.info to the HTML string.
          console.log(info);
        }
      };

      self.remove = function() {
        // Remove the marker from the array it's a part of.
        var obsArr = getContainingArray(self.marker()),
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

      self.restore = function() {
        self.marker().title(preChangeMarkerData.title);
        self.marker().description(preChangeMarkerData.description);
        self.editing(false);
      };

      // Possible values: 'google', 'flickr', 'foursquare', 'wikipedia'
      self.source: ko.observable('google');

      self.update = function() {
        map.removeMarker(self.marker().id());
        recreateMarker(self.marker());
      };

      init();

      function init() {
        // The second argument tells the method to remove existing event listeners.
        map.onInfoWindowCloseClick(function() {
          if (self.editing()) {
            self.restore();
          }
        }, true);

        self.refresh();
      }
    },

    template: '<div data-bind="visible: !editing()">' +
              '<p data-bind="text: marker().title"></p>' +
              '<p data-bind="text: marker().description"></p>' +
              '<div data-bind="html: info"></div>' +
              '<button data-bind="click: edit">Modify</button>' +
              '<button data-bind="click: remove">Remove</button>'+
              '</div>' +
              // The edit display.
              '<div data-bind="visible: editing">' +
              '<input data-bind="textInput: marker().title" placeholder="Title"></input>' +
              '<input data-bind="textInput: marker().description" placeholder="Description"></input>' +
              '<button data-bind="click: restore">Cancel</button>' +
              '<button data-bind="click: update">Confirm</button>' +
              '</div>'
  };

})(this);
