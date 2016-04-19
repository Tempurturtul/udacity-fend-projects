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
          openInfoWindow = params.openInfoWindow,
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
          var str = '<h2>%description%</h2>' +
                    '<div>%results%</div>' +
                    '<footer><small>%credit%</small></footer>',
              resultsHTML = '';

          switch (info.source) {
            case 'google':
              // + address = place.formatted_address;
              // phone = place.formatted_phone_number;
              // + internationalPhone = place.international_phone_number;
              // + attributions = place.html_attributions;  // String array. (Must be dispayed.)
              // icon = place.icon;
              // + name = place.name;  // NOTE Possibly raw text as typed by user.
              // + photos = formatPhotos(place.photos);
              // + price = formatPriceLevel(place.price_level);
              // + rating = place.rating;  // 1.0 to 5.0
              // + reviews = formatReviews(place.reviews);
              // + types = place.types;  // String array. Example: ['restaurant', 'establishment']
              // + googlePage = place.url;  // Official Google-owned page for the place.
              // + utcOffset = place.utc_offset;
              // + website = place.website;  // The place's website. For example: a business' homepage.

              // Build the HTML for each result.
              info.results.forEach(function(result) {
                var title = googleResultTitle(result),
                    details = googleResultDetails(result),
                    photos = googleResultPhotos(result),
                    reviews = googleResultReviews(result);


                resultsHTML += '<div>' +
                                title +
                                details +
                                photos +
                                reviews +
                               '</div>';
              });

              return str.replace('%description%', 'Details From Google')
                        .replace('%results%', resultsHTML)
                        .replace('%credit%', info.results
                                                    .map(function(result) { return result.attributions; })
                                                    .join(' '));
            case 'flickr':
              // Build the HTML for each result.
              info.results.forEach(function(result) {
                resultsHTML += '<div>' +
                               '<h3>' + result.title.replace(/</g, '&lt;') + '</h3>' +
                               '<a href="' + result.url + '" target="_blank">' +
                               '<img src="' + result.src + '"></img>' +
                               '</a>' +
                               '</div>';
              });

              return str.replace('%description%', 'Images From Flickr')
                        .replace('%results%', resultsHTML)
                        .replace('%credit%', '<q cite="https://www.flickr.com/services/api/tos/">This product uses the Flickr API but is not endorsed or certified by Flickr.</q>');
            case 'foursquare':
              // https://developer.foursquare.com/docs/responses/venue

              // Build the HTML for each result.
              info.results.forEach(function(result) {
                resultsHTML += '<div>' +
                               '<h3></h3>' +
                               '</div>';
              });

              return str.replace('%description%', '')
                        .replace('%results%', resultsHTML)
                        .replace('%credit%', '');
            case 'wikipedia':
              // url: page.fullurl,
              // coordinates: page.coordinates,  // Object array with properties: `globe`, `lat`, `lon`, and `primary`.
              // lang: page.pagelanguage,
              // thumbnail: page.thumbnail,  // Object with properties: `height`, `width`, `source`.
              // title: page.title,
              // description: page.terms ? page.terms.description : undefined

              // Build the HTML for each result.
              info.results.forEach(function(result) {
                resultsHTML += '<div>' +
                               '<h3></h3>' +
                               '</div>';
              });

              return str.replace('%description%', '')
                        .replace('%results%', resultsHTML)
                        .replace('%credit%', '');
            default:
              // The source wasn't identified, return nothing.
              return;
          }

          function googleResultDetails(result) {
            var details = '';

            if (result.address) {
              details += '<li>Address: ' + result.address + '</li>';
            }
            if (result.internationalPhone) {
              details += '<li>Phone: ' + result.internationalPhone + '</li>';
            }
            if (result.types) {
              details += '<li>Type: ' + result.types.join(', ') + '</li>';
            }
            if (result.price) {
              details += '<li>Price: ' + result.price + '</li>';
            }
            if (result.rating) {
              details += '<li>Rating: ' + result.rating + ' / 5</li>';
            }
            if (result.googlePage) {
              details += '<li><a href="' + result.googlePage + '" target="_blank">Google Page</a></li>';
            }
            if (result.utcOffset) {
              details += '<li>UTC Offset: ' + result.utcOffset + '</li>';
            }

            return '<ul>' + details + '</ul>';
          }

          function googleResultPhotos(result) {
            var photos = '';

            result.photos.forEach(function(photo) {
              photos += '<li>' +
                        '<img src="' + photo.src + '">' +
                        '<small>' + photo.attributions.join(' ') + '</small>' +
                        '</li>';
            });

            return '<ul>' + photos + '</ul>';
          }

          function googleResultReviews(result) {
            var reviews = '';

            result.reviews.forEach(function(review) {
              reviews += '<li>' +
                         (review.author.profile ?
                          '<a href="' + review.author.profile + '">' + review.author.name.replace(/</g, '&lt;') + '</a>' :
                          review.author.name.replace(/</g, '&lt;')) +
                         '<ul>' +
                         review.aspects
                            .map(function(aspect) {
                              return '<li>' + aspect.type + ': ' + aspect.rating + '/3</li>';
                            })
                            .join('') +
                         '</ul>' +
                         '<p>' + review.text + '</p>' +
                         '</li>';
            });

            return '<ul>' + reviews + '</ul>';
          }

          function googleResultTitle(result) {
            var name = result.name.replace(/</g, '&lt;');

            // If there's a site, link the name to it.
            if (result.website) {
              name = '<a href="' + result.website + '" target="_blank">' + name + '</a>';
            }

            return '<h3>' + name + '</h3>';
          }
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
        map.closeInfoWindow();

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
        var updatedMarker = recreateMarker(self.marker());
        openInfoWindow(updatedMarker);
      };

      init();

      function changeSource(newSource) {
        if (source !== newSource) {
          source = newSource;
          self.refresh();
        }
      }

      function init() {
        map.onInfoWindowCloseClick(function() {
          if (self.editing()) {
            self.restore();
          }
        });

        self.refresh();
      }
    },

    template: '<article data-bind="visible: !editing()">' +
              '<h1 data-bind="text: marker().title"></h1>' +
              '<p data-bind="text: marker().description"></p>' +
              '<h2>Information Sources</h2>' +
              '<div class="info-window-source-buttons">' +
              '<button data-bind="click: changeSourceToGoogle">google</button><button data-bind="click: changeSourceToFlickr">flickr</button><button data-bind="click: changeSourceToFoursquare">foursquare</button><button data-bind="click: changeSourceToWikipedia">wikipedia</button>' +
              '</div>' +
              '<section class="info-window-info" data-bind="html: info"></section>' +
              '<div class="info-window-edit-buttons">' +
              '<button data-bind="click: edit">Modify</button>' +
              '<button data-bind="click: remove">Remove</button>'+
              '</div>' +
              '</article>' +
              // The edit display.
              '<form data-bind="visible: editing, submit: update">' +
              '<label>Title<input data-bind="textInput: marker().title"></input></label>' +
              '<label>Description<input data-bind="textInput: marker().description"></input></label>' +
              '<div class="info-window-form-buttons">' +
              '<button data-bind="click: restore" type="button">Cancel</button>' +
              '<button type="submit">Confirm</button>' +
              '</div>' +
              '</form>'
  };

})(this);
