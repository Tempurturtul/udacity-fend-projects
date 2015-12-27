/*  TODO
*     Score
*     Collectables
*     Player Selection
*     Health
*     Levels
*     Dialogue
*/

(function(global) {
  var doc = global.document;
  var win = global.window;
  var board = {
    tileHeight: 83,
    tileWidth: 101,
    tileCenterTopOffset: -30,  // The center of the tile as an offset from its height. (Ex.: A tile at 0 on the y-axis would have a y-axis center at 83 + -30.)
    rows: 6,
    cols: 5,
    enemyRows: [1, 2, 3]
  };
  var player;
  var allEnemies = [null, null, null, null];

  function Actor(sprite, x, y) {
    this.sprite = sprite || '';
    this.x = x || 0;
    this.y = y || 0;

    this.render = function() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
  }

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
      this.reset();
    };
  }

  Player.prototype = new Actor();

  function start() {
    player = new Player('images/char-boy.png');

    allEnemies.forEach(function(enemy, index) {
      var x = board.tileWidth * randomRange(-1, board.rows - 1);
      var y = board.tileHeight * randomRange(board.enemyRows[0], board.enemyRows[board.enemyRows.length - 1]) + board.tileCenterTopOffset;

      enemy = new Enemy('images/enemy-bug.png', x, y);

      allEnemies[index] = enemy;
    });

    doc.addEventListener('keyup', function(e) {
      var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
      };

      player.handleInput(allowedKeys[e.keyCode]);
    });
  }

  start();

  global.player = player;
  global.allEnemies = allEnemies;

  /*************************
    Utility Functions
  *************************/

  function randomRange(min, max) {
    // Returns random number between min (included) and max (included).
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
})(this);
