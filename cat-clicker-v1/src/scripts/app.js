/**
 * app.js
 * Core functionality for the Cat Clicker application.
 */

(function(global) {
  var doc = global.document,
      win = global.window,
      util = global.util,
      counter = doc.getElementById('counter'),
      count,  // Number of cat clicks.
      cats = [
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
      sizes = '70vw';  // Cat <img> element sizes attribute.

  initialize();

  /**
   * Increments the counter.
   */
  function catClicked() {
    counter.textContent = ++count;

    saveCount();
  }

  /**
   * Change the cat.
   * @param {object} elem - The cat <div> element.
   * @param {object} data - Data pertaining to the new cat.
   * @param {string} data.name - The cat's name.
   * @param {object} data.imageData - Data pertaining to the cat image.
   * @param {string} data.imageData.src
   * @param {string} data.imageData.alt
   * @param {string} data.imageData.srcset
   * @param {string} data.imageData.sizes
   */
  function changeCat(elem, data) {
    changeImage(elem.getElementsByTagName('img')[0], data.imageData);
    elem.getElementsByTagName('h2')[0].textContent = data.name;
  }

  /**
   * Changes an <img> element.
   * @param {object} elem - HTML <img> element.
   * @param {sting|object} data - Path to image, or object containing image data.
   * @param {string} data.src
   * @param {string} data.alt
   * @param {string} data.srcset
   * @param {string} data.sizes
   * @returns {object} - The changed <img> element.
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

    return elem;
  }

  /**
   * Creates an <img> element in the given document and returns it.
   * @param {object} doc - The document.
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
   * Returns an object containing data relating to a cat image.
   * @param {number} id - The id of the image the data should represent.
   * @param {string} [sizes='100vw'] - The <img> sizes attribute value.
   * @returns {object}
   */
  function getCatData(id, sizes) {
    var re = new RegExp('cat-' + id);

    var filteredcats = cats.map(function(set) {
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

    var name = getCatName(id);
    var data = {
      name: name,
      imageData: {}
    };

    data.imageData.src = filteredcats[0].url;
    data.imageData.alt = 'A cat.';

    // Set data.imageData.srcset.
    filteredcats.forEach(function(set) {
      var srcset = set.url + ' ' + set.width;

      if (data.imageData.srcset) {
        data.imageData.srcset += ', ' + srcset;
      } else {
        data.imageData.srcset = srcset;
      }
    });

    if (sizes) {
      data.imageData.sizes = sizes;
    } else {
      data.imageData.sizes = '100vw';
    }

    return data;
  }

  /**
   * Returns the name of the cat with the given ID.
   * @param {number|string} id - The cat's ID.
   * @returns {string} - The cat's name.
   */
  function getCatName(id) {
    var names = [
      'Killit',
      'Scratchit',
      'Watchit',
      'Pounceonit',
      'Warmm',
      'Curious',
      'Guru',
      'Myspot',
      'Lazy',
      'Feedme',
      'Petme'
    ];

    return names[id - 1];
  }

  /**
   * Returns data for the next cat image (based on latest displayed image).
   * @param {string} [sizes] - The sizes attribute value.
   * @returns {object}
   */
  function getNextCatData(sizes) {
    var id = (count % cats[0].urls.length) + 1;
    return getCatData(id, sizes);
  }

  /**
   * Returns data for a random cat image.
   * @param {string} [sizes] - The sizes attribute value.
   * @returns {object}
   */
  function getRandomCatData(sizes) {
    var id = util.randomFromRange(1, cats[0].urls.length);
    return getCatData(id, sizes);
  }

  /**
   * Initializes the application. Should only be called once.
   */
  function initialize() {
    var main = doc.getElementsByTagName('main')[0],
        list = doc.getElementsByTagName('ul')[0];

    // Set the count.
    count = retrieveCount();
    // Set the counter.
    counter.textContent = count;

    // Get data for a random cat element.
    var catData = getRandomCatData(sizes);

    // Create the containing div and the heading element.
    var cat = doc.createElement('div');
    cat.classList.add('cat');
    var heading = doc.createElement('h2');
    heading.textContent = catData.name;
    cat.appendChild(heading);

    // Create the image element.
    var img = createImage(doc, catData.imageData);
    // Add the onclick event handler to the cat.
    img.onclick = catClicked;
    // Add the img to the containing div.
    cat.appendChild(img);

    // Add the cat div to the document.
    main.appendChild(cat);

    var liClickFunc = (function(id) {
      return function() {
        changeCat(cat, getCatData(id, sizes));
      };
    });

    // Populate the cat list.
    for (var i = 1, len = cats[0].urls.length; i <= len; i++) {
      var li = doc.createElement('li');
      li.textContent = getCatName(i);
      li.onclick = liClickFunc(i);
      list.appendChild(li);
    }
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
})(this);
