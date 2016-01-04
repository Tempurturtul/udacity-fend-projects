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
      lastTime = Date.now();
      main();
    }
  }

  function resizeCanvas() {
    canvas.width = doc.body.getBoundingClientRect().width;
    canvas.height = doc.body.getBoundingClientRect().height;

    updateScale();
  }

  function updateScale() {
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

    var formattedEvent = {
      pos: {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
    };

    // Call the related game event method.
    game.events.onTouchEnd(formattedEvent);
  }

  function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();
    checkCollisions();

    lastTime = now;

    win.requestAnimationFrame(main);
  }

  function update(dt) {
    updateEntities(dt);
  }

  function updateEntities(dt) {
    for (var entityArr in game.entities) {
      for (var i = 0; i < game.entities[entityArr].length; i++) {
        game.entities[entityArr][i].update(dt);
      }
    }
  }

  function render() {
    renderMap();
    renderEntities();
  }

  function renderMap() {
    for (var row = 0; row < game.mapData.rows; row++) {
      var rowSprite = game.sprites[game.mapData.rowSprites[row]];

      for (var col = 0; col < game.mapData.cols; col++) {
        ctx.drawImage(Resources.get(rowSprite.url),
                      col * board.mapData.colWidth * scale,
                      row * board.mapData.rowHeight * scale,
                      board.mapData.colImageWidth * scale,
                      board.mapData.rowImageHeight * scale);
      }
    }
  }

  function renderEntities() {
    game.entities.forEach(function(entityArr) {
      entityArr.forEach(function(entity) {
        ctx.drawImage(Resources.get(entity.sprite.url),
                      entity.pos.x * scale,
                      entity.pos.y * scale,
                      entity.sprite.imageWidth * scale,
                      entity.sprite.imageHeight * scale);
      });
    });
  }

  function checkCollisions() {
    // For every entity array...
    for (var i = 0; i < game.entities.length; i++) {
      // For every entity...
      for (var j = 0; j < game.entities[i].length; j++) {
        var entity = game.entities[i][j];

        // For every entity array except those already completely iterated through...
        for (var i2 = i; i2 < game.entities.length; i2++) {
          // For every entity except those already iterated through...
          for (var j2 = j + 1; j2 < game.entities[i2].length; j2++) {
            var entity2 = game.entities[i2][j2];

            var xBegin = entity.pos.x + entity.colliderOffsetLeft;
            var xEnd = xBegin + entity.colliderWidth;
            var x2Begin = entity2.pos.x + entity2.colliderOffsetLeft;
            var x2End = x2Begin + entity2.colliderWidth;

            var yBegin = entity.pos.y + entity.colliderOffsetTop;
            var yEnd = yBegin + entity.colliderHeight;
            var y2Begin = entity2.pos.y + entity2.colliderOffsetTop;
            var y2End = y2Begin + entity2.colliderHeight;

            // Check for a collider overlap on the x and y axes.
            var overlapX = util.compareRanges([xBegin, xEnd], [x2Begin, x2End]);
            var overlapY = util.compareRanges([yBegin, yEnd], [y2Begin, y2End]);

            // If there is an overlap on both axes... (util.compareRanges returns 0 on overlap)
            if (overlapX === 0 && overlapY === 0) {
              var collision = {
                entity: entity2
              };
              var collision2 = {
                entity: entity
              };

              // Call both entity's onCollision functions.
              entity.onCollision(collision);
              entity2.onCollision(collision2);
            }
          }
        }
      }
    }
  }

  global.engine = {
    scale: scale
  };
})(this);
