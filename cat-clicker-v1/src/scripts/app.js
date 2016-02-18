// TODO Working on grid - decided to simplify...

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
      ];

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
   * Creates a <div class="grid"> element, along with child <div class="col">
   * and <div class="cell"> elements, in the given document and returns it.
   * Optionally populates the grid with contents.
   * @param {object} doc - The document.
   * @param {object} data - Data describing the grid.
   * @param {number} data.cols - Number of columns.
   * @param {number} data.rows - Number of rows.
   * @param {number} data.size - Cell size.
   * @param {object[]} [contents] - An array of content elements.
   * @returns {object} - The grid element.
   */
  function createGrid(doc, data, contents) {
    var row, col,
        grid = doc.createElement('div');

    grid.classList.add('grid');

    // Create the cols.
    for (col = 0; col < data.cols; col++) {
      var colElem = doc.createElement('div');
      colElem.style.display = 'inline-block';
      colElem.classList.add('col');
      colElem.id = getColumnId(col);

      // Create the cells.
      for (row = 0; row < data.rows; row++) {
        var cell = doc.createElement('div');
        cell.style.height = cell.style.width = data.size + 'px';
        cell.classList.add('cell');
        // Add id (A1, A2, B1, B2...).
        cell.id = colElem.id + (row + 1);

        colElem.appendChild(cell);
      }

      grid.appendChild(colElem);
    }

    if (contents) {
      // TODO Add contents.
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
   * @param {string} [sizes='100vw'] - The <img> sizes attribute value.
   * @returns {object}
   */
  function getCatData(id, sizes) {
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

    if (sizes) {
      data.sizes = sizes;
    } else {
      data.sizes = '100vw';
    }

    return data;
  }

  /**
   * Returns the identifier for the nth column (A...Z, AA...ZZZ).
   * @param {number} n
   * @returns {string}
   */
  function getColumnId(n) {
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        maxLetterPlaces = 3,
        max = Math.pow(alphabet.length, maxLetterPlaces),
        result;

    // Early abort if n is too large.
    if (n >= max) {
      console.error('Column ID exceeds ' + Array(maxLetterPlaces + 1).join(alphabet.charAt(alphabet.length - 1)) + '.');
      return;
    }

    recurse(n);

    return result;

    function recurse(n, acc) {
      acc = acc || '';

      // Base case.
      if (n < alphabet.length) {
        result = alphabet.charAt(n) + acc;
        return;
      }

      var letter = alphabet.charAt(n % alphabet.length);
      acc = letter + acc;

      if (n / alphabet.length === 1) {
        n = 0;
      } else {
        n = Math.floor(n / alphabet.length);
      }

      recurse(n, acc);
    }
  }

  /**
   * Returns data for the next cat image (based on latest displayed image).
   * @param {string} [sizes] - The sizes attribute value.
   * @returns {object}
   */
  function getNextCatData(sizes) {
    var id = (count % catImages[0].urls.length) + 1;
    return getCatData(id, sizes);
  }

  /**
   * Returns data for a random cat image.
   * @param {string} [sizes] - The sizes attribute value.
   * @returns {object}
   */
  function getRandomCatData(sizes) {
    var id = util.randomFromRange(1, catImages[0].urls.length);
    return getCatData(id, sizes);
  }

  /**
   * Returns data for generating a grid capable of housing n elements within the
   * specified dimensions.
   * @param {number} n - The number of elements.
   * @param {number} x - The maximum width of the grid.
   * @param {number} y - The maximum height of the grid.
   * @returns {object} - Object containing rows, cols, and size properties.
   */
  function getGridData(n, x, y) {
    var cols = 1,
        size = Math.min(x, y);  // The smallest of x and y is the greatest possible cell size.

    while (y < size * Math.ceil(n / cols)) {
      // Generate a new column if there's room.
      if (x >= size * (cols + 1)) {
        cols++;
      }
      // Otherwise, shrink size.
      else {
        size--;
      }
    }

    return {
      cols: cols,
      rows: Math.ceil(n / cols),
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

    // Get the data needed to create the grid.
    var gridData = getGridData(catCount, win.innerWidth, win.innerHeight);
    var gridContents = [];

    // Create the cat <img> elements.
    for (var i = 0; i < catCount; i++) {
      // Get data for the element.
      var data = getRandomCatData(gridData.size + 'px');
      // Create the element.
      var elem = createImage(doc, data);
      // Add the onclick event handler to the element.
      elem.onclick = catClicked;
      // Add the element to the gridContents array.
      gridContents.push(elem);
    }

    // Create the grid.
    var grid = createGrid(doc, gridData, gridContents);
    doc.body.appendChild(grid);
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
