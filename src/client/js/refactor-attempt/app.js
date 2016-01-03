// REFACTORING TO SEPARATE LOGIC.
// APP.JS SHOULD CONTAIN ONLY GAME-SPECIFIC LOGIC.

(function(global) {
  var doc = global.document;
  var win = global.window;
  var game = {
    // No change.
    entities: {
      enemies: [],
      players: []
    },
    // events -> eventHandlers
    eventHandlers: {
      onKeyUp: onKeyUp,
      onTouchEnd: onTouchEnd
    },
    // mapData.rowSprites -> mapData.spritesByRow
    // Removed rowHeight, colWidth, rowImageHeight, colImageWidth, rowImageOffsetTop, colImageOffsetLeft
    // Added winRow, startRow
    mapData: {
      cols: 5,
      rows: 6,
      spritesByRow: [
        'water',  // Row 0 (Win.)
        'stone',  // Row 1 (Enemies.)
        'stone',  // Row 2 (Enemies.)
        'stone',  // Row 3 (Enemies.)
        'grass',  // Row 4
        'grass'   // Row 5 (Start.)
      ],
      enemyRows: [1, 2, 3],
      winRow: 0,
      startRow: 5
    },
    // No change.
    settings: {
      numEnemies: 4,
      playerSprite: 'charBoy'
    },
    // sprites[sprite].imageWidth -> width; imageHeight -> height
    // Removed sprites[sprite].colliderWidth, colliderHeight, colliderOffsetTop, colliderOffsetLeft
    // Added sprites[sprite].collider; collider.width; collider.height; collider.pos
    sprites: {
      water: {
        url: 'images/water-block.png',
        width: 101,
        height: 171,
        collider: {
          width: 101,
          height: 83,
          pos: {
            x: 0,
            y: 50
          }
        }
      },
      stone: {
        url: 'images/stone-block.png',
        width: 101,
        height: 171,
        collider: {
          width: 101,
          height: 83,
          pos: {
            x: 0,
            y: 50
          }
        }
      },
      grass: {
        url: 'images/grass-block.png',
        width: 101,
        height: 171,
        collider: {
          width: 101,
          height: 83,
          pos: {
            x: 0,
            y: 50
          }
        }
      },
      charBoy: {
        url: 'images/char-boy.png',
        width: 101,
        height: 171,
        collider: {
          width: 68,
          height: 78,
          pos: {
            x: 17,
            y: 62
          }
        }
      },
      charCatGirl: {
        url: 'images/char-cat-girl.png',
        width: 101,
        height: 171,
        collider: {
          width: 68,
          height: 78,
          pos: {
            x: 17,
            y: 62
          }
        }
      },
      charHornGirl: {
        url: 'images/char-horn-girl.png',
        width: 101,
        height: 171,
        collider: {
          width: 68,
          height: 78,
          pos: {
            x: 17,
            y: 62
          }
        }
      },
      charPinkGirl: {
        url: 'images/char-pink-girl.png',
        width: 101,
        height: 171,
        collider: {
          width: 68,
          height: 78,
          pos: {
            x: 17,
            y: 62
          }
        }
      },
      charPrincessGirl: {
        url: 'images/char-princess-girl.png',
        width: 101,
        height: 171,
        collider: {
          width: 68,
          height: 78,
          pos: {
            x: 17,
            y: 62
          }
        }
      },
      enemyBug: {
        url: 'images/enemy-bug.png',
        width: 101,
        height: 171,
        collider: {
          width: 98,
          height: 67,
          pos: {
            x: 1,
            y: 77
          }
        }
      }
    }
  };


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
    this.onCollision = function(collision) {};
  }

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
      this.pos.x += this.speed * dt * engine.scale;

      // Reset if too far right.
      var tileSprite = game.sprites[game.mapData.spritesByRow[0]];
      // If the entirety of the enemy sprite is off the entirety of the map.
      if (this.pos.x > (tileSprite.collider.width * game.mapData.cols + (tileSprite.width - tileSprite.collider.width)) * engine.scale) {
        // The enemy has gone completely off the right side of the map.
        this.reset();
      }
    };

    this.onCollision = function(collision) {
      // Check if the collision is with a player.
      for (var i = 0; i < game.entities.players.length; i++) {
        var player = game.entities.players[i];

        if (collision.entity === player) {
          player.die();
          break;
        }
      }
    };

    this.reset = function() {
      // Place off the left side of the map by a full unit.
      this.pos.x = -game.mapData.colWidth * engine.scale;

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

  /* Entity -> Player */
  function Player(sprite) {
    var pos = getInitialPos();

    Entity.call(this, sprite, pos);

    this.update = function(dt) {
      // Handle entering the win zone (top row).
      if (this.pos.y + this.sprite.colliderOffsetTop <= game.mapData.rowHeight + game.mapData.rowImageOffsetTop) {
        this.win();
      }
    };

    /******************************************
    *  I'M HERE, WORKING DOWNWARD. NEED TO DEAL WITH CHECKING BOUNDS WHILE CENTERING PLAYER.
    *  ... YOU KNOW WHAT; I THINK I WANT TO REWORK MY DATA STRUCTURES.
    ******************************************/
    this.handleInput = function(input) {
      var tileWidth = game.mapData.colWidth;
      var tileHeight = game.mapData.rowHeight;
      switch (input) {
        case 'left':
          var newX = this.x - tileWidth * engine.scale;
          var leftBoundary = game.mapData.colImageOffsetLeft * engine.scale;

          if (newX <= leftBoundary) {
            this.x = ;
          } else {
            this.x -= tileWidth;
          }
          break;
        case 'right':
          if (this.x + tileWidth >= tileWidth * (game.mapData.cols - 1) - (game.mapData.colImageWidth - (game.mapData.colImageOffsetLeft + tileWidth))) {
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

    this.onCollision = function(collision) {

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

    // Returns a position placing the player on the center (or just left of center) of the bottom row.
    function getInitialPos() {
      // Assign x to the left-side of the target tile's collider.
      var x = game.mapData.colWidth * Math.floor((game.mapData.cols - 1) / 2) + game.mapData.colImageOffsetLeft;
      // Adjust x to center the player's collider on the target tile's collider.
      x = x - player.sprite.colliderOffsetLeft + (game.mapData.colWidth - player.sprite.colliderWidth) / 2;
      // Scale x.
      x *= engine.scale;

      // Assign y to the top of the target tile's collider.
      var y = game.mapData.rowImageOffsetTop;
      // Adjust y to center the player's collider on the target tile's collider.
      y = y - player.sprite.colliderOffsetTop + (game.mapData.rowHeight - player.sprite.colliderHeight) / 2;
      // Scale y.
      y *= engine.scale;

      return {
        x: x,
        y: y
      };
    }
  }

  Player.prototype = new Entity();

  function spawnEnemies() {
    for (var i = 0; i < game.settings.numEnemies; i++) {
      var x = randomRange(-1, game.mapData.rows - 1);
      var y = randomRange(game.mapData.enemyRows[0], game.mapData.enemyRows[game.mapData.enemyRows.length - 1]);
      var enemy = new Enemy(game.sprites.enemyBug, {x: x, y: y});

      game.entities.enemies.push(enemy);
    }
  }

  // TODO Use engine.js for event listeners.
  function start() {
    var player = new Player(game.sprites[game.settings.playerSprite]);

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
