// The info-window custom component.
//   Dependencies: ko, map, placeInfo.

(function(global) {

  global.components = global.components || {};

  global.components.infoWindow = {
    viewModel: function(params) {
      var self = this,
          getContainingArray = params.getContainingArray,
          getMarker = params.getMarker,
          markerID = params.markerID,
          recreateMarker = params.recreateMarker,
          source = 'google',  // Possible values: 'google', 'flickr', 'foursquare', 'wikipedia'
          infoCache = {},  // Cached information retrieved from third party APIs.
          infoLifetime = 1200;  // Seconds to wait before updating cached info.

      self.marker = ko.observable(getMarker(markerID));

      // Used to restore the marker's state if editing is canceled.
      var preChangeMarkerData = ko.toJS(self.marker());

      self.changeSourceToFlickr = function() {
        changeSource('flickr');
      };

      self.changeSourceToFoursquare = function() {
        changeSource('foursquare');
      };

      self.changeSourceToGoogle = function() {
        changeSource('google');
      };

      self.changeSourceToWikipedia = function() {
        changeSource('wikipedia');
      };

      self.edit = function() {
        self.editing(true);
      };

      self.editing = ko.observable(false);

      // The HTML string representing additional information.
      self.info = ko.observable();

      self.refresh = function() {
        var place = self.marker().position(),
            cached;

        switch (source) {
          case 'google':
            // Check for fresh cached info.
            cached = checkCache('google', markerID);

            // If fresh cached info is found, use it.
            if (cached) {
              infoReady(cached.info);
              break;
            }

            // Either no cached info or stale cached info.

            // Retrieve fresh info.
            map.getPlaceDetails(infoReady, markerID);
            break;
          case 'flickr':
            // Check for fresh cached info.
            cached = checkCache('flickr', JSON.stringify(place));

            // If fresh cached info is found, use it.
            if (cached) {
              infoReady(cached.info);
              break;
            }

            // Either no cached info or stale cached info.

            // Retrieve fresh info.
            placeInfo.sources.flickr(infoReady, place);
            break;
          case 'foursquare':
            // Check for fresh cached info.
            cached = checkCache('foursquare', JSON.stringify(place));

            // If fresh cached info is found, use it.
            if (cached) {
              infoReady(cached.info);
              break;
            }

            // Either no cached info or stale cached info.

            // Retrieve fresh info.
            placeInfo.sources.foursquare(infoReady, place);
            break;
          case 'wikipedia':
            // Check for fresh cached info.
            cached = checkCache('wikipedia', JSON.stringify(place));

            // If fresh cached info is found, use it.
            if (cached) {
              infoReady(cached.info);
              break;
            }

            // Either no cached info or stale cached info.

            // Retrieve fresh info.
            placeInfo.sources.wikipedia(infoReady, place);
            break;
        }

        function cacheInfo(info) {
          // Use an identifier created from the place property. (Small object or marker id.)
          var cacheIdentifier = typeof info.place === 'object' ? JSON.stringify(info.place) : info.place;

          // Ensure a cache exists for the source.
          infoCache[info.source] = infoCache[info.source] || {};

          // Add or replace the info in the cache.
          infoCache[info.source][cacheIdentifier] = {
            info: info,
            timestamp: Date.now()
          };
        }

        function checkCache(source, identifier) {
          if (infoCache[source] && infoCache[source][identifier]) {
            var cachedInfo = infoCache[source][identifier],
                age = (Date.now() - cachedInfo.timestamp) / 1000;  // In seconds.

            // Check if the info is fresh.
            if (age < infoLifetime) {
              return cachedInfo;
            }
          }

          // Either no cached info or stale cached info.
          return false;
        }

        function formatInfo(info) {
          var str = '';

          switch (info.source) {
            case 'google':
              // address = place.formatted_address;
              // phone = place.formatted_phone_number;
              // internationalPhone = place.international_phone_number;
              // attributions = place.html_attributions;  // String array.
              // icon = place.icon;
              // name = place.name;  // NOTE Possibly raw text as typed by user.
              // photos = formatPhotos(place.photos);
              // price = formatPriceLevel(place.price_level);
              // rating = place.rating;  // 1.0 to 5.0
              // reviews = formatReviews(place.reviews);
              // types = place.types;  // String array. Example: ['restaurant', 'establishment']
              // googlePage = place.url;  // Official Google-owned page for the place.
              // utcOffset = place.utc_offset;
              // website = place.website;  // The place's website. For example: a business' homepage.
              break;
            case 'flickr':
              // src
              // url
              // title
              break;
            case 'foursquare':
              // https://developer.foursquare.com/docs/responses/venue
              break;
            case 'wikipedia':
              // url: page.fullurl,
              // coordinates: page.coordinates,  // Object array with properties: `globe`, `lat`, `lon`, and `primary`.
              // lang: page.pagelanguage,
              // thumbnail: page.thumbnail,  // Object with properties: `height`, `width`, `source`.
              // title: page.title,
              // description: page.terms ? page.terms.description : undefined
              break;
          }

          return str;
        }

        function infoReady(info) {
          // Cache the info.
          cacheInfo(info);

          // Abort if the user has changed the source or place since the info was requested.
          if ((info.source !== source) ||
              (info.place !== self.marker().id() && info.place !== self.marker().position())) {
            return;
          }

          // Create an HTML string from the info.
          var htmlStr = formatInfo(info);

          // Set info to the HTML string.
          self.info(htmlStr);
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

      self.update = function() {
        map.removeMarker(self.marker().id());
        recreateMarker(self.marker());
      };

      init();

      function changeSource(newSource) {
        if (source !== newSource) {
          source = newSource;
          self.refresh();
        }
      }

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
              '<button data-bind="click: changeSourceToGoogle">google</button><button data-bind="click: changeSourceToFlickr">flickr</button><button data-bind="click: changeSourceToFoursquare">foursquare</button><button data-bind="click: changeSourceToWikipedia">wikipedia</button>' +
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
