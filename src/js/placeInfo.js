// Functionality for retrieving place information.

(function(global) {

  var $ = global.jQuery,
      sources = {};

  // Abort if jquery isn't found.
  if (!$) {
    console.warn('jQuery not found.');
    global.placeInfo = null;
    return;
  }

  // Noteworthy Flickr API restrictions:
  // - DO prominently place the following notice: "This product uses the Flickr API but is not endorsed or certified by Flickr."
  // - DO comply with photo owners' requirements/restrictions.
  // - DO link content back to its page on Flickr.
  // - DO NOT use the Flickr logo.
  // - DO NOT display more than 30 Flickr photos per page.
  // - DO NOT cache or store Flickr photos for more than reasonable periods.

  /**
   * Returns an array of photos for the given place.
   * @param {object} place - Data defining the place.
   * @param {number} [limit=20] - The maximum number of results to return.
   * @param {number|string} [place.lat]
   * @param {number|string} [place.lng]
   * @param {string} [place.bbox] - Comma delimited values representing: min lng, min lat, max lng, max lat.
   * @param {number|string} [place.woeid]
   * @returns {object[]} - Each element includes `src`, `url`, and `title` properties.
   */
  sources.flickr = function(place, limit) {
    var results = [];

    place = place || {};
    limit = limit || 20;

    $.ajax({
      url: 'https://api.flickr.com/services/rest/',
      data: {
        method: 'flickr.photos.search',
        api_key: '361633fa9bcc997bf3519b5cca2e6ceb',  // You've found a key! Unfortunately, the key you're looking for is in another castle.
        content_type: 1,  // Photos only.
        lat: place.lat,
        lon: place.lng,
        bbox: place.bbox,
        woe_id: place.woeid,
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
      return results;
    });
  };

  // Noteworthy Foursquare API restrictions:
  // - DO attribute Foursquare either generally or contextually.
  // - DO link back to venue pages whenever displaying venue data.
  // - DO give visual attribution if displaying more than basic venue data.
  // - DO give visual attribution if displaying a list of venues.
  // - DO give visual attribution if displaying any non-venue data.
  // - DO NOT cache any data for more than 30 days.

  /**
   * Returns an array of popular nearby venues.
   * @param {object} place - Data defining the place.
   * @param {number} [limit=5] - The maximum number of results to return.
   * @param {number|string} place.lat
   * @param {number|string} place.lng
   * @returns {object[]} - Each element includes "Compact Object" data documented here: https://developer.foursquare.com/docs/responses/venue
   */
  sources.foursquare = function(place, limit) {
    var results = [];

    // Abort if required parameters weren't passed.
    if (!place || !(place.lat && place.lng)) {
      return results;
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
      return results;
    });
  };

  // This one -might- be better off in map.js.
  sources.google = function(place) {};

  // Noteworthy Wikipedia API restrictions:
  // - DO identify the client with a `User-Agent` or `Api-User-Agent` header.

  /**
   * TODO
   */
  sources.wikipedia = function(place) {
    var results = [];

    $.ajax({
      url: 'https://en.wikipedia.org/w/api.php',
      data: {
        action: 'query',
        format: 'json'
      },
      type: 'POST',
      headers: {
        'Api-User-Agent': 'fend-neighborhood-map/1.0 (https://tempurturtul.github.io/fend-neighborhood-map/; tempurturtul@gmail.com)'
      },
      dataType: 'json'
    })
    .done(function(data) {
      console.log(data);
    })
    .always(function() {
      return results;
    });
  };

  sources.yelp = function(place) {};

  global.placeInfo = {
    sources: sources
  };
})(this);
