/**
 * app.js
 * Core functionality for the Cat Clicker application.
 */

(function(global) {
  var doc = global.document,
      win = global.window,
      util = global.util,
      counter = doc.getElementById('counter'),
      count,
      cat,
      catImages = [
        {
          width: '1920w',
          urls: [
            'image/cat-1.jpg',
            'image/cat-2.jpg',
            'image/cat-3.jpg',
            'image/cat-4.jpg',
            'image/cat-5.jpg',
            'image/cat-6.jpg',
            'image/cat-7.jpg',
            'image/cat-8.jpg',
            'image/cat-9.jpg',
            'image/cat-10.jpg',
            'image/cat-11.jpg'
          ]
        },
        {
          width: '960w',
          urls: [
            'image/960x635/cat-1-960x635.jpg',
            'image/960x635/cat-2-960x635.jpg',
            'image/960x635/cat-3-960x635.jpg',
            'image/960x635/cat-4-960x635.jpg',
            'image/960x635/cat-5-960x635.jpg',
            'image/960x635/cat-6-960x635.jpg',
            'image/960x635/cat-7-960x635.jpg',
            'image/960x635/cat-8-960x635.jpg',
            'image/960x635/cat-9-960x635.jpg',
            'image/960x635/cat-10-960x635.jpg',
            'image/960x635/cat-11-960x635.jpg'
          ]
        },
        {
          width: '480w',
          urls: [
            'image/480x318/cat-1-480x318.jpg',
            'image/480x318/cat-2-480x318.jpg',
            'image/480x318/cat-3-480x318.jpg',
            'image/480x318/cat-4-480x318.jpg',
            'image/480x318/cat-5-480x318.jpg',
            'image/480x318/cat-6-480x318.jpg',
            'image/480x318/cat-7-480x318.jpg',
            'image/480x318/cat-8-480x318.jpg',
            'image/480x318/cat-9-480x318.jpg',
            'image/480x318/cat-10-480x318.jpg',
            'image/480x318/cat-11-480x318.jpg'
          ]
        }
      ],
      numberOfCats = 11;

  initialize();

  /**
   * Initializes the application. Should only be called once.
   */
  function initialize() {
    // Set the count.
    count = retrieveCount();
    // Set the counter.
    counter.innerHTML = count;
    // Get data for the cat <img> element.
    var data = getCatData();
    // Create the cat <img> element.
    cat = createImage(doc, data);
    // Add the onclick event handler to the cat <img> element.
    cat.onclick = catClicked;
    // Append the cat <img> element to the container.
    doc.getElementById('app').appendChild(cat);
  }

  /**
   * Increments the counter and changes the image to the next cat.
   */
  function catClicked() {
    counter.innerHTML = ++count;

    var data = getCatData();

    changeImage(cat, data);
    saveCount();
  }

  /**
   * Returns an object containing data for use in an <img> element.
   * @returns {object}
   */
  function getCatData() {
    var id = (count % numberOfCats) + 1;
    var re = new RegExp('cat-' + id);

    var filteredCatImages = catImages.map(function(set) {
      var url;

      // For each url...
      for (var i = 0, len = set.urls.length; i < len; i++) {
        // If the url is to the image matching the id, remember it and break the loop.
        if (re.test(set.urls[i])) {
          url = set.urls[i];
          break;
        }
      }

      return {
        width: set.width,
        url: url
      };
    });

    var data = {};
    data.src = filteredCatImages[0].url;
    data.alt = 'A cat.';

    // Set data.srcset.
    filteredCatImages.forEach(function(set) {
      var srcset = set.url + ' ' + set.width;

      if (data.srcset) {
        data.srcset += ', ' + srcset;
      } else {
        data.srcset = srcset;
      }
    });

    data.sizes = '100vw';

    return data;
  }

  /**
   * Returns the count stored in local storage, or zero if no count is found.
   * @returns {number} The stored count or zero.
   */
  function retrieveCount() {
    if (util.storageAvailable('localStorage')) {
      var retrievedCount = win.localStorage.getItem('count') || 0;
      return retrievedCount;
    } else {
      console.warn('Unable to retrieve count; local storage is unavailable.');
      return 0;
    }
  }

  /**
   * Attempts to save the count to local storage.
   */
  function saveCount() {
    if (util.storageAvailable('localStorage')) {
      win.localStorage.setItem('count', count);
    } else {
      console.warn('Count not saved; local storage is unavailable.');
    }
  }

  /**
   * Creates an <img> element in the given document and returns it.
   * @param {string|object} data - Path to image, or object containing image data.
   * @param {string} data.src
   * @param {string} data.alt
   * @param {string} data.srcset
   * @param {string} data.sizes
   * @returns {object}
   */
  function createImage(doc, data) {
    var elem = doc.createElement('img');

    if (typeof data === 'string') {
      elem.src = data;
    } else {
      elem.src = data.src;
      elem.alt = data.alt;
      elem.srcset = data.srcset;
      elem.sizes = data.sizes;
    }

    return elem;
  }

  /**
   * Changes an <img> element.
   * @param {object} elem - HTML <img> element.
   * @param {sting|object} data - Path to image, or object containing image data.
   * @param {string} data.src
   * @param {string} data.alt
   * @param {string} data.srcset
   * @param {string} data.sizes
   */
  function changeImage(elem, data) {
    if (typeof data === 'string') {
      elem.src = data;
      elem.alt = undefined;
      elem.srcset = undefined;
      elem.sizes = undefined;
    } else {
      elem.src = data.src;
      elem.alt = data.alt;
      elem.srcset = data.srcset;
      elem.sizes = data.sizes;
    }
  }
})(this);
