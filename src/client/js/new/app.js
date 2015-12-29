// REFACTORING TO SEPARATE LOGIC.
// APP.JS SHOULD CONTAIN ONLY GAME-SPECIFIC LOGIC.

(function(global) {
  var doc = global.document;
  var win = global.window;
  var game = {
    sprites: {
      water: {
        url: 'images/water-block.png',
        imageWidth: 101,
        imageHeight: 171,
        colliderWidth: 101,
        colliderHeight: 83,
        colliderOffsetTop: 50,
        colliderOffsetLeft: 0
      },
      stone: {
        url: 'images/stone-block.png',
        imageWidth: 101,
        imageHeight: 171,
        colliderWidth: 101,
        colliderHeight: 83,
        colliderOffsetTop: 50,
        colliderOffsetLeft: 0
      },
      grass: {
        url: 'images/grass-block.png',
        imageWidth: 101,
        imageHeight: 171,
        colliderWidth: 101,
        colliderHeight: 83,
        colliderOffsetTop: 50,
        colliderOffsetLeft: 0
      },
      charBoy: {
        url: 'images/char-boy.png',
        imageWidth: 101,
        imageHeight: 171,
        colliderWidth: 68,
        colliderHeight: 78,
        colliderOffsetTop: 62,
        colliderOffsetLeft: 17
      },
      charCatGirl: {
        url: 'images/char-cat-girl.png',
        imageWidth: 101,
        imageHeight: 171,
        colliderWidth: 68,
        colliderHeight: 78,
        colliderOffsetTop: 62,
        colliderOffsetLeft: 17
      },
      charHornGirl: {
        url: 'images/char-horn-girl.png',
        imageWidth: 101,
        imageHeight: 171,
        colliderWidth: 68,
        colliderHeight: 78,
        colliderOffsetTop: 62,
        colliderOffsetLeft: 17
      },
      charPinkGirl: {
        url: 'images/char-pink-girl.png',
        imageWidth: 101,
        imageHeight: 171,
        colliderWidth: 68,
        colliderHeight: 78,
        colliderOffsetTop: 62,
        colliderOffsetLeft: 17
      },
      charPrincessGirl: {
        url: 'images/char-princess-girl.png',
        imageWidth: 101,
        imageHeight: 171,
        colliderWidth: 68,
        colliderHeight: 78,
        colliderOffsetTop: 62,
        colliderOffsetLeft: 17
      },
      enemyBug: {
        url: 'images/enemy-bug.png',
        imageWidth: 101,
        imageHeight: 171,
        colliderWidth: 98,
        colliderHeight: 67,
        colliderOffsetTop: 77,
        colliderOffsetLeft: 1
      }
    },
    mapData: {
      rows: 6,
      cols: 5,
      rowHeight: 83,
      colWidth: 101,
      rowImageHeight: 171,
      colImageWidth: 101,
      rowSprites: [
        'water',  // Row 0 (Win.)
        'stone',  // Row 1 (Enemies.)
        'stone',  // Row 2 (Enemies.)
        'stone',  // Row 3 (Enemies.)
        'grass',  // Row 4
        'grass'   // Row 5 (Start.)
      ],
      enemyRows: [1, 2, 3]
    },
    entities: {
      players: [],
      enemies: []
    },
    settings: {
      numEnemies: 4,
      playerSprite: 'charBoy'
    },
    events: {
      onKeyUp: onKeyUp,
      onTouchEnd: onTouchEnd
    }
  };

  // TODO Use engine.js for rendering.
  /**
   * @param {Object} sprite
   * @param {string} sprite.url
   * @param {number} sprite.imageWidth
   * @param {number} sprite.imageHeight
   * @param {number} sprite.colliderWidth
   * @param {number} sprite.colliderHeight
   * @param {number} sprite.colliderOffsetTop
   * @param {number} sprite.colliderOffsetLeft
   * @param {Object} pos
   * @param {number} pos.x
   * @param {number} pos.y
   */
  function Entity(sprite, pos) {
    this.sprite = sprite;
    this.pos = pos;

    this.render = function() {
      // ctx.drawImage(Resources.get(this.sprite.url), this.pos.x, this.pos.y, board.tileImageWidth, board.tileImageHeight);
    };
  }

  // TODO Use engine.js for collision checking.
  /**
   * @param {Object} sprite
   * @param {string} sprite.url
   * @param {number} sprite.imageWidth
   * @param {number} sprite.imageHeight
   * @param {number} sprite.colliderWidth
   * @param {number} sprite.colliderHeight
   * @param {number} sprite.colliderOffsetTop
   * @param {number} sprite.colliderOffsetLeft
   * @param {Object} pos
   * @param {number} pos.x
   * @param {number} pos.y
   * @param {(number|number[])} speed
   */
  function Enemy(sprite, pos, speed) {
    Entity.call(this, sprite, pos);

    this.speed = getSpeed(speed);

    this.update = function(dt) {
      // Move right.
      this.pos.x += this.speed * dt;

      // Reset if too far right.
      if (this.pos.x > game.mapData.cols) {
        // The enemy has gone off the right side of the map by a full unit.
        this.reset();
      }

      // Handle collisions.
      this.handleCollisions();
    };

    this.handleCollisions = function() {
      // TODO Handle player collision.

      // if (this.y === player.y && (this.x + board.tileWidth / 2 > player.x && this.x - board.tileWidth / 2 < player.x)) {
      //   player.die();
      // }
    };

    this.reset = function() {
      // Place off the left side of the map by a full unit.
      this.pos.x = -1;

      // Redetermine speed.
      this.speed = getSpeed(speed);
    };

    function getSpeed(speed) {
      if (Array.isArray(speed)) {
        // If speed is an array it should contain two numbers, the first being the
        // minimum speed and the second being the maximum speed.
        return util.randomRange(speed[0], speed[1]);
      } else {
        return speed;
      }
    }
  }

  Enemy.prototype = new Entity();

  // TODO Use engine.js for collision checking.
  /* Entity -> Player */
  function Player(sprite) {
    var startX = Math.floor((game.mapData.cols - 1) / 2);  // Middle or immediately left of middle.
    var startY = game.mapData.rows - 1;  // Bottom y-axis.
    var pos = {x: startX, y: startY};

    Entity.call(this, sprite, pos);

    this.update = function(dt) {
      this.handleCollisions();
    };

    this.handleInput = function(input) {
      switch (input) {
        case 'left':
          if (this.x - 1 <= 0) {
            this.x = 0;
          } else {
            this.x--;
          }
          break;
        case 'right':
          if (this.x + 1 >= game.mapData.cols - 1) {
            this.x = game.mapData.cols - 1;
          } else {
            this.x++;
          }
          break;
        case 'down':
          if (this.y + 1 >= game.mapData.rows - 1) {
            this.y = game.mapData.rows - 1;
          } else {
            this.y++;
          }
          break;
        case 'up':
          if (this.y - 1 <= 0) {
            this.y = 0;
          } else {
            this.y--;
          }
          break;
      }
    };

    this.handleCollisions = function() {
      // Handle win zone collisions (top row).
      if (this.y <= 0) {
        this.win();
      }
    };

    this.reset = function() {
      this.pos.x = startX;
      this.pos.y = startY;
    };

    this.die = function() {
      this.reset();
    };

    this.win = function() {
      restart();
    };
  }

  Player.prototype = new Entity();

  function spawnEnemies() {
    for (var i = 0; i < game.settings.numEnemies; i++) {
      var x = randomRange(-1, game.mapData.rows - 1);
      var y = randomRange(game.mapData.enemyRows[0], game.mapData.enemyRows[game.mapData.enemyRows.length - 1]);
      var enemy = new Enemy('images/enemy-bug.png', {x: x, y: y});

      game.entities.enemies.push(enemy);
    }
  }

  // TODO Use engine.js for event listeners.
  function start() {
    var player = new Player(game.settings.playerSprite);

    game.entities.players.push(player);

    spawnEnemies();
  }

  function restart() {
    // TODO Destroy existing enemies.

    spawnEnemies();

    player.reset();
  }

  // TODO Perform this call elsewhere.
  start();

  function onKeyUp(e) {
    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
  }

  function onTouchEnd(e) {
    var relativeToPlayer;

    // Determine on which axis the touch is furthest from the player. (Recall
    // that the player's pos refers to the top-left position of the player,
    // therefore we adjust to search from the middle of the player.)
    if (Math.abs(e.pos.x - (player.pos.x + player.sprite.colliderWidth / 2)) > Math.abs(e.pos.y - (player.pos.y + player.sprite.colliderHeight / 2))) {
      // Furthest on the x-axis.
      // Check where the click was relative to the player on the x-axis, again
      // don't forget that the player's pos refers to the top-left position.
      if (e.pos.x > player.pos.x + player.sprite.colliderWidth) {
        relativeToPlayer = 'right';
      } else if (e.pos.x < player.pos.x) {
        relativeToPlayer = 'left';
      }
    } else {
      // Furthest on the y-axis.
      // Check where the click was relative to the player on the y-axis.
      if (e.pos.y > player.pos.y + player.sprite.colliderHeight) {
        relativeToPlayer = 'down';
      } else if (e.pos.x < player.pos.x) {
        relativeToPlayer = 'up';
      }
    }

    // Check if relativeToPlayer was defined.
    if (relativeToPlayer) {
      player.handleInput(relativeToPlayer);
    }
  }

  global.game = game;
})(this);
