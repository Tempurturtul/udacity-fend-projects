/**
 * util.js
 * Utility functions for use by other aspects of the program.
 */

(function(global) {
  global.util = {
    randomFromRange: randomFromRange,
    storageAvailable: storageAvailable
  };

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
