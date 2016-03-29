// Functionality for retrieving place information.

/*
* Noteworthy Flickr API restrictions:
* - DO prominently place the following notice: "This product uses the Flickr API but is not endorsed or certified by Flickr."
* - DO comply with photo owners' requirements/restrictions.
* - DO link content back to its page on Flickr.
* - DO NOT use the Flickr logo.
* - DO NOT display more than 30 Flickr photos per page.
* - DO NOT cache or store Flickr photos for more than reasonable periods.
*
* Noteworthy Foursquare API restrictions:
* - DO attribute Foursquare either generally or contextually.
* - DO link back to venue pages whenever displaying venue data.
* - DO give visual attribution if displaying more than basic venue data.
* - DO give visual attribution if displaying a list of venues.
* - DO give visual attribution if displaying any non-venue data.
* - DO NOT cache any data for more than 30 days.
*
* Noteworthy Wikipedia API restrictions:
* - None other than DO eliminate unnecessary API calls...?
*/

(function(global) {

  var $ = global.jQuery,
      sources = {};

  // Abort if jquery isn't found.
  if (!$) {
    console.warn('jQuery not found.');
    global.placeInfo = null;
    return;
  }

  /**
   * Invokes the callback with an array of photos taken near the given place.
   * @param {infoReady} cb
   * @param {object} place - Data defining the place.
   * @param {number} [limit=10] - The maximum number of results to return.
   * @param {number|string} place.lat
   * @param {number|string} place.lng
   * @returns {object[]} - Array of objects representing photos.
   */
  sources.flickr = function(cb, place, limit) {
    var results = [];

    // Abort if required parameters weren't passed.
    if (typeof cb !== 'function') {
      console.warn('No callback passed to `sources.flickr`.');
      return;
    }
    /*jshint eqnull:true */
    if (!place || (place.lat == null || place.lng == null)) {
      console.warn('Insufficient place details passed to `sources.flickr`.');
      cb(results);
      return;
    }

    limit = limit || 10;

    $.ajax({
      url: 'https://api.flickr.com/services/rest/',
      data: {
        method: 'flickr.photos.search',
        api_key: '361633fa9bcc997bf3519b5cca2e6ceb',  // You've found a key! Unfortunately, the key you're looking for is in another castle.
        content_type: 1,  // Photos only.
        lat: place.lat,
        lon: place.lng,
        radius: 10,  // 10km.
        per_page: limit,  // We're only checking the first page, so this serves to limit total photos returned.
        format: 'json',
        nojsoncallback: 1  // The flickr API returns JSON with a function wrapper by default.
      },
      dataType: 'json'
    })
    .done(function(data) {
      if (data.photos) {
        var photos = data.photos.photo;

        photos.forEach(function(photo) {
          var result = {
            // The image source.
            src: 'https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg',
            // The photo's page on Flickr.
            url: 'https://www.flickr.com/photos/{user-id}/{photo-id}',
            // The title of the photo.
            title: photo.title
          };

          // Format the result.
          result.src = result.src.replace('{farm-id}', photo.farm)
                                 .replace('{server-id}', photo.server)
                                 .replace('{id}', photo.id)
                                 .replace('{secret}', photo.secret);

          result.url = result.url.replace('{user-id}', photo.owner)
                                 .replace('{photo-id}', photo.id);

          // Add the result to the returned results array.
          results.push(result);
        });
      }
    })
    .always(function() {
      cb(results);
    });
  };

  /**
   * Invokes the callback with an array of popular nearby venues.
   * @param {infoReady} cb
   * @param {object} place - Data defining the place.
   * @param {number} [limit=5] - The maximum number of results to return.
   * @param {number|string} place.lat
   * @param {number|string} place.lng
   * @returns {object[]} - Array of objects representing venues sorted by proximity. (Defined here: https://developer.foursquare.com/docs/responses/venue)
   */
  sources.foursquare = function(cb, place, limit) {
    var results = [];

    // Abort if required parameters weren't passed.
    if (typeof cb !== 'function') {
      console.warn('No callback passed to `sources.foursquare`.');
      return;
    }
    /*jshint eqnull:true */
    if (!place || (place.lat == null || place.lng == null)) {
      console.warn('Insufficient place details passed to `sources.foursquare`.');
      cb(results);
      return;
    }

    limit = limit || 5;

    $.ajax({
      url: 'https://api.foursquare.com/v2/venues/explore',
      data: {
        client_id: '0V0DM3MNMWFDECB2ZTPOAB1XIZD1F14VFCIBLGJ1RJQD2C3V',  // You've found a key! Unfortunately, the key you're looking for is in another castle.
        client_secret: 'JHNX33ATTXI0QAEV0JG00GS1W14NGFWG0TT1XV4TTIBY1WDM',  // Oh man! You've found a secret! Unfortunately, it's not a very good secret.
        v: 20160324,
        m: 'foursquare',
        limit: limit,
        ll: place.lat + ',' + place.lng,  // Search for venue by coordinates.
        venuePhotos: 1,  // Include photos.
        sortByDistance: 1  // Sort results by distance.
      },
      dataType: 'json'
    })
    .done(function(data) {
      if (data.response.groups) {
        for (var group in data.response.groups) {
          group = data.response.groups[group];

          for (var i = 0; i < group.items.length; i++) {
            results.push(group.items[i].venue);
          }
        }
      }
    })
    .always(function() {
      cb(results);
    });
  };

  /**
   * Invokes the callback with an array of wikipedia results for nearby places.
   * @param {infoReady} cb
   * @param {object} place - Data defining the place.
   * @param {object} [opts] - Additional options.
   * @param {number|string} place.lat
   * @param {number|string} place.lng
   * @param {number} [opts.limit=5] - The maximum number of results to return.
   * @param {number} [opts.maxDimension=144] - The maximum dimension for thumbnail images.
   * @returns {object[]} - Array of objects representing wikipedia pages sorted by proximity.
   */
  sources.wikipedia = function(cb, place, opts) {
    // NOTE https://www.mediawiki.org/wiki/API:Showing_nearby_wiki_information

    var results = [];

    // Abort if required parameters weren't passed.
    if (typeof cb !== 'function') {
      console.warn('No callback passed to `sources.wikipedia`.');
      return;
    }
    /*jshint eqnull:true */
    if (!place || (place.lat == null || place.lng == null)) {
      console.warn('Insufficient place details passed to `sources.wikipedia`.');
      cb(results);
      return;
    }

    opts = opts || {};
    opts.limit = opts.limit || 5;
    opts.maxDimension = opts.maxDimension || 144;

    $.ajax({
      type: 'GET',
      url: 'https://en.wikipedia.org/w/api.php',
      data: {
        // Main data.
        action: 'query',
        format: 'json',
        // Action data.
        prop: 'coordinates|pageimages|pageterms|info',  // Which properties to get for the queried pages.
        generator: 'geosearch',
        // Format data.
        formatversion: 2,  // Formats output in a more modern way.
        // Prop data.
        colimit: opts.limit,
        piprop: 'thumbnail',
        pithumbsize: opts.maxDimension,  // Maximum thumbnail dimension
        pilimit: opts.limit,
        wbptterms: 'description',
        inprop: 'url',  // Basic info properties.
        // Generator data.
        ggscoord: place.lat + '|' + place.lng,
        ggsradius: 10000,  // Search radius in meters.
        ggslimit: opts.limit
      },
      dataType: 'jsonp'
    })
    .done(function(data) {
      if (data.query.pages) {
        // TODO Sort results by proximity to searched place.
        results = data.query.pages.map(function(page) {
          return {
            url: page.fullurl,
            coordinates: page.coordinates,  // Object array with properties: `globe`, `lat`, `lon`, and `primary`.
            lang: page.pagelanguage,
            thumbnail: page.thumbnail,  // Object with properties: `height`, `width`, `source`.
            title: page.title,
            description: page.terms ? page.terms.description : undefined
          };
        });
      }
    })
    .always(function() {
      cb(results);
    });
  };

  global.placeInfo = {
    sources: sources
  };
})(this);
