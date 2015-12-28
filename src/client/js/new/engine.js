// REFACTORING TO SEPARATE LOGIC.
// ENGINE.JS SHOULD CONTAIN ONLY ENGINE-SPECIFIC LOGIC.

// TODO Add get event functionality (getTouchEnd, getKeyUp, ...).
// TODO Add collision checking functionality (getCollisions).

var Engine = (function(global) {
  var doc = global.document;
  var win = global.window;
  var canvas = doc.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var lastTime;


  // TODO Move this concept elsewhere in engine.js (init?).
  updateSizes();

  // TODO Remake this, separating game logic from engine logic.
  function updateSizes() {
    setCanvasDimensions();
    updateBoardImageSizes();
    updateBoardTileSizes();

    // Determine canvas width and height based on body dimensions.
    function setCanvasDimensions() {
      var bodyRect = doc.body.getBoundingClientRect();
      var baseCanvasHeight = 606;
      var baseCanvasWidth = 505;

      // Check if the base canvas dimensions exceed the bounds of the body element.
      if (bodyRect.width < baseCanvasWidth || bodyRect.height < baseCanvasHeight) {
        // If they do, resize the canvas appropriately.
        var newWidth;
        var newHeight;

        // Figure out which axis to resize by.
        if (baseCanvasWidth - bodyRect.width > baseCanvasHeight - bodyRect.height) {
          // Resize by width.
          newWidth = Math.floor(bodyRect.width);
          newHeight = Math.floor((baseCanvasHeight / baseCanvasWidth) * newWidth);
        } else {
          // Resize by height.
          newHeight = Math.floor(bodyRect.height);
          newWidth = Math.floor((baseCanvasWidth / baseCanvasHeight) * newHeight);
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
      } else {
        // If they do not, create the canvas with the base dimensions.
        canvas.width = 505;
        canvas.height = 606;
      }
    }

    function updateBoardImageSizes() {
      // Determine image sizes.
      var baseImageWidth = 101;
      var baseImageHeight = 171;
      var newImageWidth = canvas.width / board.cols;
      var newImageHeight = (baseImageHeight / baseImageWidth) * newImageWidth;

      board.tileImageWidth = newImageWidth;
      board.tileImageHeight = newImageHeight;
    }

    function updateBoardTileSizes() {
      // Determine tile sizes.
      var baseTileWidth = 101;
      var baseTileHeight = 83;
      var baseTileCenterTopOffset = -30;
      var newTileWidth = canvas.width / board.cols;
      var newTileHeight = (baseTileHeight / baseTileWidth) * newTileWidth;
      var newTileCenterTopOffset = (baseTileHeight + baseTileCenterTopOffset) / baseTileHeight * newTileHeight - newTileHeight;

      board.tileWidth = newTileWidth;
      board.tileHeight = newTileHeight;
      board.tileCenterTopOffset = newTileCenterTopOffset;
    }
  }

  // TODO Move this elsewhere in engine.js (init?).
  doc.body.appendChild(canvas);

  function main() {
      var now = Date.now(),
          dt = (now - lastTime) / 1000.0;

      update(dt);
      render();

      lastTime = now;

      win.requestAnimationFrame(main);
  }

  function init() {
      reset();
      lastTime = Date.now();
      main();
  }

  function update(dt) {
      updateEntities(dt);
  }

  // TODO Access game logic differently.
  function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    player.update();
  }

  // TODO Access game logic differently.
  function render() {
    for (var row = 0; row < board.rows; row++) {
      for (var col = 0; col < board.cols; col++) {
        ctx.drawImage(Resources.get(board.rowImages[row]), col * board.tileWidth, row * board.tileHeight, board.tileImageWidth, board.tileImageHeight);
      }
    }

    renderEntities();
  }

  // TODO Access game logic differently.
  function renderEntities() {
    allEnemies.forEach(function(enemy) {
        enemy.render();
    });

    player.render();
  }

  function reset() {
    // noop
  }

  // TODO Access game logic differently.
  Resources.load([
      'images/stone-block.png',
      'images/water-block.png',
      'images/grass-block.png',
      'images/enemy-bug.png',
      'images/char-boy.png',
      'images/char-cat-girl.png'
  ]);

  Resources.onReady(init);

  // TODO Publicize engine logic differently.
  global.ctx = ctx;

  // TODO Publicize engine logic differently.
  global.board = board;

  win.addEventListener('resize', updateSizes);
})(this);
