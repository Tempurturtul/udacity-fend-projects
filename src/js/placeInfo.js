// Functionality for retrieving place information.

(function(global) {

  var sources = {};


  sources.flickr = function(place) {};

  sources.foursquare = function(place) {};

  // This one -might- be better off in map.js.
  sources.google = function(place) {};

  sources.wikipedia = function(place) {};

  sources.yelp = function(place) {};


  /**
   * Gets place info from indicated sources or all sources if none are indicated.
   * @param {object} place - An object with sufficient data (hopefully) to locate and identify a place.
   * @param {string[]} [sources] - The sources from which to retrieve information.
   */
  function amalgamation(place, sources) {}


  global.placeInfo = {
    amalgamation: amalgamation,
    sources: sources
  };
})(this);
