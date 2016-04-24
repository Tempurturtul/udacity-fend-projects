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
        source = 'google',    // Possible values: 'google', 'flickr', 'foursquare', 'wikipedia'
        infoCache = {},       // Cached information retrieved from third party APIs.
        infoLifetime = 1200,  // Seconds to wait before updating cached info.
        preChangeMarkerData,  // Used to restore the marker's state if editing is canceled.
        maxImageWidth = 100;  // Used to specify desired image dimensions in API requests.


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
    self.info = ko.observable();

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
        article.innerHTML = '<h1 data-bind="text: marker().title"></h1>' +
                            '<p data-bind="text: marker().description"></p>' +
                            '<div class="info-window-edit-buttons">' +
                            '<button data-bind="click: edit">Modify</button>' +
                            '<button data-bind="click: remove">Remove</button>' +
                            '</div>' +
                            '<h2>Information Sources</h2>' +
                            '<div class="info-window-source-buttons">' +
                            '<button data-bind="click: changeSourceTo.google">google</button>' +
                            '<button data-bind="click: changeSourceTo.flickr">flickr</button>' +
                            '<button data-bind="click: changeSourceTo.foursquare">foursquare</button>' +
                            '<button data-bind="click: changeSourceTo.wikipedia">wikipedia</button>' +
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
      var markerID = self.marker().id(),
          place = self.marker().position(),
          cached = checkCache(source, source === 'google' ? markerID : JSON.stringify(place));

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

            return str.replace('%results%', resultsHTML)
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

            return str.replace('%results%', resultsHTML)
                      .replace('%credit%', '<q cite="https://www.flickr.com/services/api/tos/">This product uses the Flickr API but is not endorsed or certified by Flickr.</q>');
          case 'foursquare':
            // https://developer.foursquare.com/docs/responses/venue

            // Build the HTML for each result.
            info.results.forEach(function(result) {
              resultsHTML += '<div>' +
                             '<h3></h3>' +
                             '</div>';
            });

            return str.replace('%results%', resultsHTML)
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
                      '<img src="' + photo.src + '">' +
                      '<small>' + photo.attributions.join(' ') + '</small>' +
                      '</li>';
          });

          return '<h3>Photos</h3>' +
                 '<ul class="google-photos">' + photos + '</ul>';
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

          return '<h2 class="google-title">' + name + '</h2>';
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
      if (source !== newSource) {
        source = newSource;
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
