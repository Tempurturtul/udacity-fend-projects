// REFACTORING TO SEPARATE LOGIC.
// ENGINE.JS SHOULD CONTAIN ONLY ENGINE-SPECIFIC LOGIC.

// TODO Add collision checking functionality (getCollisions).

var Engine = (function(global) {
  var doc = global.document;
  var win = global.window;
  var canvas = doc.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var lastTime;
  var scale;  // The scale at which to draw things on the canvas.

  init();

  function init() {
    resizeCanvas();
    doc.body.appendChild(canvas);
    win.addEventListener('resize', resizeCanvas);
    doc.addEventListener('keyup', onKeyUp);
    doc.addEventListener('touchend', onTouchEnd);

    var spritesToLoad = [];
    for (var sprite in game.sprites) {
      spritesToLoad.push(game.sprites[sprite].url);
    }
    Resources.load(spritesToLoad);
    Resources.onReady(stageTwo);

    function stageTwo() {
      reset();
      lastTime = Date.now();
      main();
    }
  }

  function resizeCanvas() {
    // Set the canvas's width and height equal to the map bounds.
    canvas.width = doc.body.getBoundingClientRect().width;
    canvas.height = doc.body.getBoundingClientRect().height;

    updateResizePercentage();
  }

  function updateResizePercentage() {
    // Get the game map's visible width and height.
    var visibleMapWidth = game.mapData.colWidth * game.mapData.cols + (game.mapData.colImageWidth - game.mapData.colWidth);
    var visibleMapHeight = game.mapData.rowHeight * game.mapData.rows + (game.mapData.rowImageHeight - game.mapData.rowHeight);

    // Get the resize percentage required to display the entire visible map.
    if (visibleMapWidth < canvas.width && visibleMapHeight < canvas.height) {
      // No resizing required.
      scale = 1;
    } else {
      // Determine which axis has a greater overflow.
      if (visibleMapWidth - canvas.width >= visibleMapHeight - canvas.height) {
        // The x-axis has the greater or equal overflow.
        scale = canvas.width / visibleMapWidth;
      } else {
        // The y-axis has the greater overflow.
        scale = canvas.height / visibleMapHeight;
      }
    }
  }

  function onKeyUp(e) {
    e.preventDefault();

    var formattedEvent = {
      keyCode: e.keyCode
    };

    // Call the related game event method.
    game.events.onKeyUp(formattedEvent);
  }

  function onTouchEnd(e) {
    e.preventDefault();

    var x = getRelativePos(e.changedTouches[0].clientX);
    var y = getRelativePos(e.changedTouches[0].clientY);

    var formattedEvent = {
      pos: {
        x: x,  // x-axis position relative to canvas.
        y: y   // y-axis position relative to canvas.
      }
    };

    // Call the related game event method.
    game.events.onTouchEnd(formattedEvent);
  }

  /**
   * Converts a number to be relative to the size of game.mapData.rowHeight and
   * game.mapData.colWidth. For example, if rowHeight and colWidth are both 100,
   * then a pos value of {x: 50, y: 100} will return {x: 0.5, y: 1}.
   * @param {Object} pos
   * @param {number} pos.x
   * @param {number} pos.y
   */
  function getRelativePos(pos) {
    var canvasRect = canvas.getBoundingClientRect();  // left and top is equivalent to 0 and 0.

    // Offset pos by canvas's position.
    pos.x -= canvasRect.left;
    pos.y -= canvasRect.top;

    // Resize pos by colWidth and rowHeight.
    pos.x /= game.mapData.colWidth;
    pos.y /= game.mapData.rowHeight;

    return pos;
  }

  function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;

    win.requestAnimationFrame(main);
  }

  function update(dt) {
    updateEntities(dt);
  }

  function updateEntities(dt) {
    for (var entityArr in game.entities) {
      entityArr.forEach(function(entity) {
        entity.update(dt);
      });
    }
  }

  /***************************************
  * I WAS HERE LAST, WORKING MY WAY DOWNWARD!
  ***************************************/
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

})(this);
