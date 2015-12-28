// REFACTORING TO SEPARATE LOGIC.
// APP.JS SHOULD CONTAIN ONLY GAME-SPECIFIC LOGIC.

// LAST DONE:
//  Defined game object.
//  Removed redundant variables defined in game object.

(function(global) {
  var doc = global.document;
  var win = global.window;

  var game = {
    sprites: {
      water: {
        url: 'images/water-block.png',
        width: 101,
        height: 83,
        imageWidth: 101,
        imageHeight: 171,
        offsetTop: 50,  // Offset to apply to image to get functional top.
        offsetLeft: 0   // Offset to apply to image to get functional left.
      },
      stone: {
        url: 'images/stone-block.png',
        width: 101,
        height: 83,
        imageWidth: 101,
        imageHeight: 171,
        offsetTop: 50,  // Offset to apply to image to get functional top.
        offsetLeft: 0   // Offset to apply to image to get functional left.
      },
      grass: {
        url: 'images/grass-block.png',
        width: 101,
        height: 83,
        imageWidth: 101,
        imageHeight: 171,
        offsetTop: 50,  // Offset to apply to image to get functional top.
        offsetLeft: 0   // Offset to apply to image to get functional left.
      },
      charBoy: {
        url: 'images/char-boy.png',
        width: 68,
        height: 78,
        imageWidth: 101,
        imageHeight: 171,
        offsetTop: 62,
        offsetLeft: 17
      },
      charCatGirl: {
        url: 'images/char-cat-girl.png',
        width: 68,
        height: 78,
        imageWidth: 101,
        imageHeight: 171,
        offsetTop: 62,
        offsetLeft: 17
      },
      charHornGirl: {
        url: 'images/char-horn-girl.png',
        width: 68,
        height: 78,
        imageWidth: 101,
        imageHeight: 171,
        offsetTop: 62,
        offsetLeft: 17
      },
      charPinkGirl: {
        url: 'images/char-pink-girl.png',
        width: 68,
        height: 78,
        imageWidth: 101,
        imageHeight: 171,
        offsetTop: 62,
        offsetLeft: 17
      },
      charPrincessGirl: {
        url: 'images/char-princess-girl.png',
        width: 68,
        height: 78,
        imageWidth: 101,
        imageHeight: 171,
        offsetTop: 62,
        offsetLeft: 17
      },
      enemyBug: {
        url: 'images/enemy-bug.png',
        width: 98,
        height: 67,
        imageWidth: 101,
        imageHeight: 171,
        offsetTop: 77,
        offsetLeft: 1
      }
    },
    map: {
      rows: 6,
      cols: 5,
      enemyRows: [1, 2, 3],  // First row is 0.
      rowSprites: [
        'water',  // Row 0 (Win row.)
        'stone',  // Row 1 (Enemy row.)
        'stone',  // Row 2 (Enemy row.)
        'stone',  // Row 3 (Enemy row.)
        'grass',  // Row 4
        'grass'   // Row 5 (Start row.)
      ]
    },
    entities: {
      player: null,
      enemies: []
    },
    settings: {
      numEnemies: 4,
      playerSprite: 'charBoy'
    }
  };

  function Actor(sprite, x, y) {
    this.sprite = sprite || '';
    this.x = x || 0;
    this.y = y || 0;

    this.render = function() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y, board.tileImageWidth, board.tileImageHeight);
    };
  }

  // TODO Use engine.js for collision checking.
  /* Actor -> Enemy */
  function Enemy(sprite, x, y) {
    Actor.call(this, sprite, x, y);

    var minSpeed = 120;
    var maxSpeed = 330;

    this.speed = randomRange(minSpeed, maxSpeed);

    this.update = function(dt) {
      // Move right.
      this.x += this.speed * dt;

      // Reset if too far right.
      if (this.x > board.tileWidth * board.cols) {
        this.reset();
      }

      this.handleCollisions();
    };

    this.handleCollisions = function() {
      // Handle player collision.
      if (this.y === player.y && (this.x + board.tileWidth / 2 > player.x && this.x - board.tileWidth / 2 < player.x)) {
        player.die();
      }
    };

    this.reset = function() {
      this.x = -board.tileWidth;
      this.speed = randomRange(minSpeed, maxSpeed);
    };
  }

  Enemy.prototype = new Actor();

  // TODO Use engine.js for collision checking.
  /* Actor -> Player */
  function Player(sprite) {
    var startX = board.tileWidth * (Math.floor((board.cols - 1) / 2));  // Middle x-axis.
    var startY = board.tileHeight * (board.rows - 1) + board.tileCenterTopOffset;  // Bottom y-axis.

    Actor.call(this, sprite, startX, startY);


    this.update = function(dt) {
      this.handleCollisions();
    };

    this.handleInput = function(input) {
      switch (input) {
        case 'left':
          // Do not move further left than column 0.
          if (this.x - board.tileWidth <= 0) {
            this.x = 0;
          } else {
            this.x -= board.tileWidth;
          }
          break;
        case 'right':
          // Do not move further right than columns.
          if (this.x + board.tileWidth >= board.tileWidth * (board.cols - 1)) {
            this.x = board.tileWidth * (board.cols - 1);
          } else {
            this.x += board.tileWidth;
          }
          break;
        case 'down':
          // Do not move further down than rows.
          if (this.y + board.tileHeight >= board.tileHeight * (board.rows - 1) + board.tileCenterTopOffset) {
            this.y = board.tileHeight * (board.rows - 1) + board.tileCenterTopOffset;
          } else {
            this.y += board.tileHeight;
          }
          break;
        case 'up':
          // Do not move further up than row 0.
          if (this.y - board.tileHeight <= 0 + board.tileCenterTopOffset) {
            this.y = 0 + board.tileCenterTopOffset;
          } else {
            this.y -= board.tileHeight;
          }
          break;
      }
    };

    this.handleCollisions = function() {
      // Handle win zone collisions (top row).
      if (this.y <= board.tileCenterTopOffset) {
        this.win();
      }
    };

    this.reset = function() {
      this.x = startX;
      this.y = startY;
    };

    this.die = function() {
      this.reset();
    };

    this.win = function() {
      restart();
    };
  }

  Player.prototype = new Actor();

  function spawnEnemies() {
    for (var i = 0; i < allEnemies.length; i++) {
      var x = board.tileWidth * randomRange(-1, board.rows - 1);
      var y = board.tileHeight * randomRange(board.enemyRows[0], board.enemyRows[board.enemyRows.length - 1]) + board.tileCenterTopOffset;
      var enemy = new Enemy('images/enemy-bug.png', x, y);

      allEnemies[i] = enemy;
    }
  }

  function start() {
    player = new Player('images/char-boy.png');

    spawnEnemies();

    doc.addEventListener('keyup', function(e) {
      var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
      };

      player.handleInput(allowedKeys[e.keyCode]);
    });

    doc.addEventListener('touchend', function(e) {
      e.preventDefault();  // Prevent double-touch zoom.

      var relativeToPlayer;

      var bodyRect = doc.getElementsByTagName('body')[0].getBoundingClientRect();
      var canvasRect = doc.getElementsByTagName('canvas')[0].getBoundingClientRect();

      var touchX = e.changedTouches[0].clientX;
      var touchY = e.changedTouches[0].clientY;
      var playerX = bodyRect.width / 2 - canvasRect.width / 2 + (player.x + 50);
      var playerY = bodyRect.height / 2 - canvasRect.height / 2 + (player.y + 124);
      var buffer = board.tileWidth / 2;

      if (Math.abs(touchX - playerX) > Math.abs(touchY - playerY)) {
        if (touchX > playerX + buffer) {
          relativeToPlayer = 'right';
        } else if (touchX < playerX - buffer) {
          relativeToPlayer = 'left';
        }
      } else {
        if (touchY > playerY + buffer) {
          relativeToPlayer = 'down';
        } else if (touchY < playerY - buffer) {
          relativeToPlayer = 'up';
        }
      }

      player.handleInput(relativeToPlayer);
    });
  }

  function restart() {
    spawnEnemies();

    player.reset();
  }

  // TODO Perform this call elsewhere.
  start();

  // TODO Expose differently.
  global.player = player;
  global.allEnemies = allEnemies;


  // TODO Move utility functions elsewhere (util.js?).
  /*************************
    Utility Functions
  *************************/

  function randomRange(min, max) {
    // Returns random number between min (included) and max (included).
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})(this);
