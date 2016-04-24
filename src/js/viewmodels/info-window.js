// The Info-Window View Model.

(function(global) {

  global.viewmodels = global.viewmodels || {};

  global.viewmodels.InfoWindow = InfoWindow;

  function InfoWindow(mainViewModel) {
    var self = this,
        document = global.document,
        map = global.map,
        placeInfo = global.placeInfo,
        ko = global.ko,
        infoCache = {},       // Cached information retrieved from third party APIs.
        infoLifetime = 1200,  // Seconds to wait before updating cached info.
        preChangeMarkerData,  // Used to restore the marker's state if editing is canceled.
        maxImageWidth = 120;  // Used to specify desired image dimensions in API requests.


    // Methods for changing the information source.
    self.changeSourceTo = {
      flickr: function() { changeSource('flickr'); },
      foursquare: function() { changeSource('foursquare'); },
      google: function() { changeSource('google'); },
      wikipedia: function() { changeSource('wikipedia'); }
    };

    // Closes the info window.
    self.close = function() {
      // Triggers an event that invokes the closing method.
      map.closeInfoWindow();
    };

    // Sets self.editing to true.
    self.edit = function() {
      self.editing(true);
    };

    // Whether or not the info-window is being used to edit the marker.
    self.editing = ko.observable(false);

    // The HTML string containing additional information.
    self.info = ko.observable('<p>Loading...</p>');

    // The marker the info-window is currently assigned to.
    self.marker = ko.observable();

    // Opens the info-window on the given marker.
    self.open = function(marker) {
      // Close the info-window if it's open.
      if (self.marker()) {
        self.close();
      }

      var content = createContent();

      self.marker(marker);
      self.refresh();
      map.setInfoWindowContent(content);
      map.openInfoWindow(marker.id());

      // Apply KO bindings to the newly created content.
      ko.applyBindings(self, content);

      /**
       * Creates content to be used in the map's info-window in the DOM.
       */
      function createContent() {
        var content = document.createElement('div');
        content.id = 'info-window';

        // The view visible when not editing.
        var article = document.createElement('article');
        article.dataset.bind = 'visible: !editing()';
        article.innerHTML = '<div class="info-window-edit-buttons">' +
                            '<button data-bind="click: edit">Modify</button>' +
                            '<button data-bind="click: remove">Remove</button>' +
                            '</div>' +
                            '<h1 data-bind="text: marker().title"></h1>' +
                            '<p data-bind="text: marker().description"></p>' +
                            '<h2>Information Sources</h2>' +
                            '<div class="info-window-source-buttons">' +
                            '<button data-bind="click: changeSourceTo.google, css: {\'selected-source\': source() === \'google\'}"><i class="fa fa-google"></i></button>' +
                            '<button data-bind="click: changeSourceTo.flickr, css: {\'selected-source\': source() === \'flickr\'}"><i class="fa fa-flickr"></i></button>' +
                            '<button data-bind="click: changeSourceTo.foursquare, css: {\'selected-source\': source() === \'foursquare\'}"><i class="fa fa-foursquare"></i></button>' +
                            '<button data-bind="click: changeSourceTo.wikipedia, css: {\'selected-source\': source() === \'wikipedia\'}"><i class="fa fa-wikipedia-w"></i></button>' +
                            '</div>' +
                            '<section class="info-window-info" data-bind="html: info"></section>';

        // The view visible when editing.
        var form = document.createElement('form');
        form.dataset.bind = 'visible: editing, submit: update';
        form.innerHTML = '<label>Title<input type="text" data-bind="textInput: marker().title"></label>' +
                         '<label>Description<textarea data-bind="textInput: marker().description" rows="4"></textarea></label>' +
                         '<div class="info-window-form-buttons">' +
                         '<button data-bind="click: restore" type="button">Cancel</button>' +
                         '<button type="submit">Confirm</button>' +
                         '</div>';

        content.appendChild(article);
        content.appendChild(form);

        return content;
      }
    };

    // Refreshes the additional information.
    self.refresh = function() {
      var source = self.source(),
          markerID = self.marker().id(),
          place = self.marker().position(),
          cached = checkCache(source, source === 'google' ? markerID : JSON.stringify(place));

      // Clear the displayed info.
      self.info('<p>Loading...</p>');

      // Handle requests to placeInfo if it failed to initialize.
      if (!placeInfo && source !== 'google') {
        var dummyInfo = {
          place: place,  // The source isn't google, so place isn't the Google Place ID.
          source: source,
          results: []
        };

        infoReady(dummyInfo);
        return;
      }

      // Use cached info if not stale, otherwise get fresh info.
      if (cached) {
        infoReady(cached.info);
      } else {
        switch (source) {
          case 'google':
            map.getPlaceDetails(infoReady, markerID, {maxWidth: maxImageWidth});
            break;
          case 'flickr':
            placeInfo.sources.flickr(infoReady, place);
            break;
          case 'foursquare':
            placeInfo.sources.foursquare(infoReady, place);
            break;
          case 'wikipedia':
            placeInfo.sources.wikipedia(infoReady, place);
            break;
        }
      }

      /**
       * Caches the additional information with a timestamp.
       * @param {object} info
       * @param {object|string} info.place - Either an object with lat and lng properties, or a Google Place ID.
       * @param {string} info.source - The source the additional information was retrieved from.
       * @param {object[]} info.results - The additional information.
       */
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

      /**
       * Checks for cached info and returns it if found and not stale.
       * @param {string} source - The source of the information.
       * @param {string} identifier - The identifier the information would be stored under.
       * @returns - The cached info, or false.
       */
      function checkCache(source, identifier) {
        if (infoCache[source] && infoCache[source][identifier]) {
          var cachedInfo = infoCache[source][identifier],
              age = (Date.now() - cachedInfo.timestamp) / 1000;  // In seconds.

          // Check if the info is fresh.
          if (age < infoLifetime) {
            return cachedInfo;
          }
        }

        // Either no cached info, or stale cached info.
        return false;
      }

      /**
       * Formats the info into an HTML string and returns it.
       * @param {object} info
       * @param {object|string} info.place - Either an object with lat and lng properties, or a Google Place ID.
       * @param {string} info.source - The source the additional information was retrieved from.
       * @param {object[]} info.results - The additional information.
       * @returns - An HTML string intended for use in self.info.
       */
      function formatInfo(info) {
        var str = '<div id="' + info.source + '-results">%results%</div>' +
                  '<footer><small>%credit%</small></footer>',
            resultsHTML = '';

        // Handle the case where no results are returned.
        if (!info.results.length) {
          return str.replace('%results%', 'No information from ' + info.source + ' could be found.')
                    .replace('%credit%', '');
        }

        switch (info.source) {
          case 'google':
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

            return str.replace('%results%', resultsHTML)
                      .replace('%credit%', info.results
                                                  .map(function(result) { return result.attributions; })
                                                  .join(' '));
          case 'flickr':
            // Build the HTML for each result.
            info.results.forEach(function(result) {
              resultsHTML += '<div>' +
                             '<h2>' + result.title.replace(/</g, '&lt;').replace(/#/g, '<wbr>#') + '</h2>' +
                             '<a href="' + result.url + '" target="_blank">' +
                             '<img src="' + result.src + '" width="' + maxImageWidth + '">' +
                             '</a>' +
                             '</div>';
            });

            return str.replace('%results%', resultsHTML)
                      .replace('%credit%', 'Disclaimer: <q cite="https://www.flickr.com/services/api/tos/">This product uses the Flickr API but is not endorsed or certified by Flickr.</q>');
          case 'foursquare':
            // https://developer.foursquare.com/docs/responses/venue

            // Build the HTML for each result.
            info.results.forEach(function(result) {
              var title = foursquareResultTitle(result),
                  details = foursquareResultDetails(result);

              resultsHTML += '<div>' +
                             title +
                             details +
                             '</div>';
            });

            return str.replace('%results%', resultsHTML)
                      .replace('%credit%', '');
          case 'wikipedia':
            // Build the HTML for each result.
            info.results.forEach(function(result) {
              var title = wikipediaResultTitle(result),
                  thumb = wikipediaResultThumb(result),
                  description = wikipediaResultDescription(result);
              resultsHTML += '<div>' +
                             title +
                             thumb +
                             description +
                             '</div>';
            });

            return str.replace('%results%', resultsHTML)
                      .replace('%credit%', '');
          default:
            // The source wasn't identified, return nothing.
            return;
        }

        function googleResultDetails(result) {
          var details = '';

          if (result.address) {
            details += '<li><span>Address</span> ' + result.address + '</li>';
          }
          if (result.internationalPhone) {
            details += '<li><span>Phone</span> ' + result.internationalPhone + '</li>';
          }
          // if (result.types) {
          //   details += '<li><span>Type</span> ' + result.types.join(', ') + '</li>';
          // }
          if (result.price) {
            details += '<li><span>Price</span> ' + result.price + '</li>';
          }
          if (result.rating) {
            details += '<li><span>Rating</span> ' + result.rating + ' / 5</li>';
          }
          if (result.googlePage) {
            details += '<li><a href="' + result.googlePage + '" target="_blank"><span>Google Page</span></a></li>';
          }

          return '<ul class="google-details">' + details + '</ul>';
        }

        function googleResultPhotos(result) {
          var photos = '';

          result.photos.forEach(function(photo) {
            photos += '<li>' +
                      '<a href="' + photo.fullsize + '" target="_blank">' +
                      '<img src="' + photo.src + '">' +
                      '</a>' +
                      '<small>' + photo.attributions.join(' ') + '</small>' +
                      '</li>';
          });

          return '<h3>Photos</h3>' +
                 '<div class="google-photos">' +
                 '<ul>' + photos + '</ul>' +
                 '</div>';
        }

        function googleResultReviews(result) {
          var reviews = '';

          result.reviews.forEach(function(review) {
            reviews += '<li>' +
                       (review.author.profile ?
                        '<a href="' + review.author.profile + '" target="_blank">' + review.author.name.replace(/</g, '&lt;') + '</a>' :
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

          return '<h3>Reviews</h3>' +
                 '<div class="google-reviews">' +
                 '<ul>' + reviews + '</ul>' +
                 '</div>';
        }

        function googleResultTitle(result) {
          var name = result.name.replace(/</g, '&lt;');

          // If there's a site, link the name to it.
          if (result.website) {
            name = '<a href="' + result.website + '" target="_blank">' + name + '</a>';
          }

          return '<h2 class="google-title">' + name + '</h2>';
        }

        function foursquareResultDetails(result) {
          var details = '';

          if (result.categories.length) {
            details += '<li><span>' + result.categories.filter(function(category) {
              if (category.hasOwnProperty('primary')) {
                return true;
              } else {
                return false;
              }
            })[0].name + '</span></li>';
          }
          if (result.location.address) {
            details += '<li><span>Address</span> ' + result.location.address + '</li>';
          }
          // if (result.location.distance) {
          //   details += '<li><span>Distance</span> ' + result.location.distance + ' meters</li>';
          // }

          return '<ul class="foursquare-details">' + details + '</ul>';
        }

        function foursquareResultTitle(result) {
          var name = result.name.replace(/</g, '&lt;');

          // If there's a site, link the name to it.
          if (result.url) {
            name = '<a href="' + result.url + '" target="_blank">' + name + '</a>';
          }

          return '<h2 class="foursquare-title">' + name + '</h2>';
        }

        function wikipediaResultDescription(result) {
          if (result.description) {
            return '<p>' + result.description + '</p>';
          } else {
            return '';
          }
        }

        function wikipediaResultThumb(result) {
          if (result.thumbnail) {
            return '<img src="' + result.thumbnail.source + '" width="' + maxImageWidth + '">';
          } else {
            return '';
          }
        }

        function wikipediaResultTitle(result) {
          return '<h2 class="wikipedia-title">' +
                 '<a href="' + result.url + '" target="_blank">' + result.title + '</a>' +
                 '</h2>';
        }
      }

      /**
       * Handles new additional information becoming available.
       * @callback infoReady
       * @param {object} info
       * @param {object|string} info.place - Either an object with lat and lng properties, or a Google Place ID.
       * @param {string} info.source - The source the additional information was retrieved from.
       * @param {object[]} info.results - The additional information.
       */
      function infoReady(info) {
        // Cache the info if it contains results.
        if (info.results.length) {
          cacheInfo(info);
        }

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

    // Removes the marker.
    self.remove = function() {
      // Cache the marker because it gets set to null when the info-window closes.
      var marker = self.marker();

      self.close();
      mainViewModel.removeMarker(marker);
    };

    // Restores the marker to its cached state.
    self.restore = function() {
      // If there is no cached data, abort.
      if (!preChangeMarkerData) {
        console.warn('Could not restore marker, no cached data found.');
        self.editing(false);
        return;
      }

      self.marker().title(preChangeMarkerData.title);
      self.marker().description(preChangeMarkerData.description);
      self.editing(false);
    };

    // The source of the additional information. Possible valuse are 'google', 'flickr', 'foursquare', and 'wikipedia'.
    self.source = ko.observable('google');

    // Updates the marker with the new data, then reopens the info-window.
    self.update = function() {
      // Finish editing.
      self.editing(false);

      // Cache the marker because it gets set to null when the info-window closes.
      var marker = self.marker();

      // Close the info-window, recreate the marker, reopen the info-window.
      self.close();
      mainViewModel.createOrRecreateMarker(marker);
      self.open(marker);
    };

    init();

    /**
     * Caches marker data if editing is true, otherwise uncaches it.
     * @param {boolean} editing
     */
    function cacheMarkerData(editing) {
      if (editing) {
        preChangeMarkerData = ko.toJS(self.marker());
      } else {
        preChangeMarkerData = null;
      }
    }

    /**
     * Changes the information source.
     * @param {string} newSource - The new information source.
     */
    function changeSource(newSource) {
      if (self.source() !== newSource) {
        self.source(newSource);
        self.refresh();
      }
    }

    /**
     * Invoked when the map closes the info-window.
     */
    function closing() {
      // Undo in-progress edits.
      if (self.editing()) {
        self.restore();
        self.editing(false);
      }

      // Clear the info-window's DOM content. (Otherwise KO data-bindings will throw errors because the marker will be set to null.)
      map.getInfoWindowContent().innerHTML = '';

      // Clear the assigned marker.
      self.marker(null);
    }

    /**
     * Initializes the info-window view model.
     */
    function init() {
      // Add an event listener to the event fired when the map closes the info-window.
      map.onInfoWindowClose(closing);
      // Subscribe cacheMarkerData to the editing state.
      self.editing.subscribe(cacheMarkerData);
    }
  }

})(this);
