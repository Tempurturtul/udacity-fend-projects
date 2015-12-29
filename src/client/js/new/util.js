(function(global) {
  global.util = {
    randomRange: randomRange
  };

  // Returns random number between min (included) and max (included).
  function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})(this);
