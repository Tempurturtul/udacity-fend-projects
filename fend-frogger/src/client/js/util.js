/* util.js
 * This file provides utility functions for use by other aspects of the program.
 */

(function(global) {
  global.util = {
    compareRanges: compareRanges,
    randomFromRange: randomFromRange,
    storageAvailable: storageAvailable
  };

  /**
   * Checks the position of range b relative to range a. Returns -1 if range b
   * occurs before (less-than) range a, 1 if after, and 0 if there is any
   * overlap.
   * @param {number[]} a
   * @param {number[]} b
   * @returns {number} -1 for b before a, 1 for b after a, 0 for overlap.
   */
  function compareRanges(a, b) {
    if (b[1] < a[0]) {
      return -1;
    } else if (b[0] > a[1]) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Returns random integer between min (included) and max (included).
   * @returns {number} A random integer between min and max (inclusive).
   */
  function randomFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Detects whether localStorage is both supported and available.
   * Courtesy of MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
   * @param {string} type - The type of storage to check ('localStorage' for example).
   * @returns {boolean} True if storage is available, false otherwise.
   */
  function storageAvailable(type) {
    try {
      var storage = global.window[type];
      var x = '__storage_test__';

      storage.setItem(x, x);
      storage.removeItem(x);

      return true;
    }
    catch(e) {
      return false;
    }
  }
})(this);
