// TODO: Working on grid creation.

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
      catCount = 12,  // Number of cat <img> elements.
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
      catImagesCount = catImages[0].urls.length;

  initialize();

  /**
   * Increments the counter and changes the image to the next cat.
   */
  function catClicked() {
    counter.innerHTML = ++count;

    var data = getNextCatData();

    changeImage(this, data);
    saveCount();
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
   * Creates a <div class="grid"> element, along with child <div class="row">
   * elements and the content elements, in the given document and returns it.
   * @param {object} doc - The document.
   * @param {number} rows - The number of rows in the grid.
   * @param {object[]} contents - An array of the content elements.
   * @returns {object} - The grid element.
   */
  function createGrid(doc, rows, contents) {
    var grid = doc.createElement('div');
    grid.classList.add('grid');

    // Create the row elements.
    for (var i = 0; i < data.rows; i++) {
      var row = doc.createElement('div');
      row.classList.add('row');
      grid.appendChild(row);
    }

    // Add the contents.
    var containingRow,
        containingRowIndex = -1;
    for (var i = 0; i < contents.length; i++) {
      // Check if containingRow needs to change.
      var contentsPerRow = Math.ceil(contents.length / rows);
      if (i % contentsPerRow === 0) {
        containingRowIndex++;
        containingRow = grid.getElementsByClassname('row')[containingRowIndex]
      }

      // Append the element to the containingRow.
      containingRow.appendChild(contents[i]);
    }

    return grid;
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
   * Returns an object containing data for use in an <img> element.
   * @param {number} id - The id of the image the data should represent.
   * @returns {object}
   */
  function getCatData(id) {
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
   * Returns data for the next cat image (based on latest displayed image).
   * @returns {object}
   */
  function getNextCatData() {
    var id = (count % catImages[0].urls.length) + 1;
    return getCatData(id);
  }

  /**
   * Returns data for a random cat image.
   * @returns {object}
   */
  function getRandomCatData() {
    var id = util.randomFromRange(1, catImages[0].urls.length);
    return getCatData(id);
  }

  /**
   * Returns data for generating a grid capable of housing n elements within the
   * specified dimensions.
   * @param {number} n - The number of elements (square dimensions).
   * @param {number} x - The width of the grid.
   * @param {number} y - The height of the grid.
   * @returns {object} - Object containing rows and size properties.
   */
  function gridData(n, x, y) {
    var rows = 1,
        size = Math.min(x, y),
        step = 0.1;  // The percentage by which to reduce size each time it's found to be too large.

    while (x < size * Math.ceil(n / rows)) {
      // Generate a new row if there's room.
      if (y >= size * (rows + 1)) {
        rows++;
      }
      // Otherwise, shrink size.
      else {
        size -= Math.floor(size * step);
      }
    }

    return {
      rows: rows,
      size: size
    };
  }

  /**
   * Initializes the application. Should only be called once.
   */
  function initialize() {
    // Set the count.
    count = retrieveCount();
    // Set the counter.
    counter.innerHTML = count;

    // Create the grid.
    var grid = createGrid(doc,
                          gridData(catImagesCount, win.innerWidth, win.innerHeight));
    doc.body.appendChild(grid);

    // Create the cat <img> elements.
    for (var i = 0; i < catCount; i++) {
      // Get data for the element.
      var data = getRandomCatData();
      // Create the element.
      var elem = createImage(doc, data);
      // Add the onclick event handler to the element.
      elem.onclick = catClicked;
      // TODO:  Add the element to the grid.
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
