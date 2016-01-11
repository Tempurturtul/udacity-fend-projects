/* app.js
 * This file handles the game state, sounds, logic, menus, and necessary event
 * listeners. It relies on engine.js for the game loop and for initiating calls
 * to appropriate render, update, and draw methods.
 */

(function(global) {
  // The global properties we'll use.
  var window = global.window;
  var document = global.document;
  var canvas = document.getElementsByTagName('canvas')[0];
  var util = global.util;  // Exposed by util.js.
  var ctx = global.ctx;  // Exposed by engine.js.
  var Resources = global.Resources;  // Exposed by resources.js.

  var audioCtx = new window.AudioContext();
  var sounds = {
    died: {
      audio: new Audio('sounds/died.wav'),
      mediaElementSource: null  // Created in init.
    },
    won: {
      audio: new Audio('sounds/won.wav'),
      mediaElementSource: null  // Created in init.
    },
    collectablePickup: {
      audio: new Audio('sounds/collectable-pickup.wav'),
      mediaElementSource: null  // Created in init.
    },
    buttonPress: {
      audio: new Audio('sounds/button-press.wav'),
      mediaElementSource: null  // Created in init.
    }
  };
  // Audio needs to be primed by a user event on mobile devices.
  var audioPrimed = false;
  var player;
  var allEnemies = [];
  var allCollectables = [];
  // The user's past scores.
  var scores = [];
  // Track the game state.
  var gameState = {
    lives: 3,
    level: 1,
    score: 0,
    numEnemies: 2,
    enemySpeedRange: [130, 300],
    newEnemyLevel: 5,
    numCollectables: 3,
    original: {
      lives: 3,
      level: 1,
      score: 0,
      numEnemies: 2,
      enemySpeedRange: [130, 300],
      newEnemyLevel: 5,
      numCollectables: 3
    }
  };
  // The available player sprites.
  var playerSprites = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
  ];
  var menus = {
    start: {
      active: true,
      buttons: {
        left: {
          x: (canvas.width - 2) / 2 - 50 - 20,  // Canvas-relative.
          y: 327 + 10,                          // Canvas-relative.
          width: 65,
          height: 30,
          hovered: false,
          pressed: false,
          action: prevPlayerSprite
        },
        right: {
          x: (canvas.width - 2) / 2 + 5,  // Canvas-relative.
          y: 327 + 10,                    // Canvas-relative.
          width: 65,
          height: 30,
          hovered: false,
          pressed: false,
          action: nextPlayerSprite
        },
        play: {
          x: (canvas.width - 2) / 2 - 50,  // Canvas-relative.
          y: canvas.height - 120,          // Canvas-relative.
          width: 100,
          height: 40,
          hovered: false,
          pressed: false,
          action: play
        },
        issues: {
          x: 10,                 // Canvas-relative.
          y: canvas.height - 30, // Canvas-relative.
          width: 20,
          height: 20,
          hovered: false,
          pressed: false,
          action: openBugTacker
        }
      }
    },
    scores: {
      active: false,
      buttons: {
        continue: {
          x: (canvas.width - 2) / 2 - 70,  // Canvas-relative.
          y: canvas.height - 80,           // Canvas-relative.
          width: 140,
          height: 40,
          hovered: false,
          pressed: false,
          action: restart
        }
      }
    }
  };
  // User-modifiable settings.
  var settings = {
    playerSprite: playerSprites[0]
  };

  // The base class for all entities (enemies, collectables, player...).
  var Entity = function(sprite, x, y) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;

    // The basic render method.
    this.render = function() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
  };
  var Enemy = function() {
    var sprite = 'images/enemy-bug.png';
    var x = util.randomFromRange(0, 101 * 4);
    var y = 83 * util.randomFromRange(1, 3) - 25;

    Entity.call(this, sprite, x, y);

    this.speed = getSpeed();

    this.update = function(dt) {
      this.x += this.speed * dt;

      if (this.x >= 101 * 5) {
        this.x = -101;
        this.y = 83 * util.randomFromRange(1, 3) - 25;
        this.speed = getSpeed();
      }

      this.handleCollisions();
    };

    this.handleCollisions = function() {
      // Handle player collision.
      if (!player.suspended) {
        if (this.y === player.y && (this.x + 101 / 2 > player.x && this.x - 101 < player.x)) {
          player.die();
        }
      }
    };

    // Returns a semi-random speed within the currently allowable speed range
    // with a bias applied in favor of lower speeds.
    function getSpeed() {
      // Retrieve a random speed within the allowable range.
      var s = util.randomFromRange(gameState.enemySpeedRange[0], gameState.enemySpeedRange[1]);

      // Reduce the random speed by a percentage of 0% to 50% without reducing it below the allowable range.
      s = Math.max(Math.round(s * util.randomFromRange(50, 100) * 0.01), gameState.enemySpeedRange[0]);

      return s;
    }
  };
  // Make Enemy.prototype inherit from Entity.prototype.
  Enemy.prototype = Object.create(Entity.prototype);
  // Set the constructor property appropriately.
  Enemy.prototype.constructor = Enemy;
  var Player = function() {
    var sprite = settings.playerSprite;
    var x = 101 * 2;
    var y = 83 * 5 - 25;

    Entity.call(this, sprite, x, y);

    this.scale = 1;  // The amount by which to scale the sprite's size.
    this.opacity = 1;  // The opacity of the player sprite.
    this.suspended = false;  // Used to suspend interaction between the player and the world.
    this.animations = {
      win: {
        isPlaying: false
      },
      death: {
        isPlaying: false
      }
    };

    this.update = function(dt) {
      // Play animations.
      for (var animation in this.animations) {
        if (this.animations[animation].isPlaying) {
          switch (animation) {
            case 'win':
              this.winAnimation(dt);
              break;
            case 'death':
              this.deathAnimation(dt);
              break;
          }
        }
      }

      // Handle collisions.
      this.handleCollisions();
    };

    // Overwrite the basic Entity.render method.
    this.render = function() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      // Draw the sprite and adjust its size by the scale percentage while keeping it centered.
      ctx.drawImage(Resources.get(this.sprite), this.x + (50 - 50 * this.scale), this.y + (121 - 121 * this.scale), 101 * this.scale, 171 * this.scale);
      ctx.restore();
    };

    this.handleCollisions = function() {
      // Handle collisions with the win row.
      if (!this.suspended && this.y <= -25) {
        this.win();
      }
    };

    this.handleInput = function(input) {
      // Early abort if suspended.
      if (this.suspended) {
        return;
      }

      // Early abort if a menu is active.
      for (var menu in menus) {
        if (menus[menu].active) {
          return;
        }
      }

      switch (input) {
        case 'left':
          if (this.x - 101 <= 0) {
            this.x = 0;
          } else {
            this.x -= 101;
          }
          break;
        case 'right':
          if (this.x + 101 >= 101 * 4) {
            this.x = 101 * 4;
          } else {
            this.x += 101;
          }
          break;
        case 'down':
          if (this.y + 83 >= 83 * 5 - 25) {
            this.y = 83 * 5 - 25;
          } else {
            this.y += 83;
          }
          break;
        case 'up':
          if (this.y - 83 <= -25) {
            this.y = -25;
          } else {
            this.y -= 83;
          }
          break;
      }
    };

    this.win = function() {
      this.suspended = true;
      gameState.score += 200;
      gameState.level++;
      playSound('won');
      this.animations.win.isPlaying = true;
    };

    this.winAnimation = function(dt) {
      if (this.scale > 0) {
        this.scale -= 2 * dt;
      } else {
        this.animations.win.isPlaying = false;
        this.finalizeWin();
      }
    };

    this.finalizeWin = function() {
      this.reset();

      updateDifficulty();
      spawnEnemies();
      spawnCollectables();
    };

    this.die = function() {
      this.suspended = true;
      gameState.lives--;
      playSound('died');
      this.animations.death.isPlaying = true;
    };

    this.deathAnimation = function(dt) {
      if (this.opacity - 1 * dt > 0 && this.scale > 0) {
        this.opacity -= 1 * dt;
        this.y -= 50 * dt;
        this.scale -= 0.3 * dt;
      } else {
        this.animations.death.isPlaying = false;
        this.finalizeDeath();
      }
    };

    this.finalizeDeath = function() {
      if (gameState.lives < 0) {
        gameOver();
      } else {
        this.reset();
      }
    };

    this.reset = function() {
      this.sprite = settings.playerSprite;

      // The starting position.
      this.x = 101 * 2;
      this.y = 83 * 5 - 25;

      this.scale = 1;
      this.opacity = 1;
      this.suspended = false;
    };
  };
  Player.prototype = Object.create(Entity.prototype);
  Player.prototype.constructor = Player;
  var Collectable = function() {
    var colors = ['Blue', 'Green', 'Orange'];
    var randomColor = colors[util.randomFromRange(0, 2)];
    var sprite = 'images/Gem ' + randomColor + '.png';
    var x = 101 * util.randomFromRange(0, 4) + 38;
    var y = 83 * util.randomFromRange(1, 3) + 60;

    Entity.call(this, sprite, x, y);

    this.velocity = util.randomFromRange(15, 35);
    this.points = 50;

    // Randomize the initial velocity direction.
    if (Math.random() > 0.5) {
      this.velocity = -this.velocity;
    }

    // Overwrite Entity's render method to introduce scaling.
    this.render = function() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 25, 43);
    };

    this.update = function (dt) {
      this.idleAnimation(dt);
      this.handleCollisions();
    };

    this.handleCollisions = function() {
      // Handle collisions with the player.
      if (!player.suspended) {
        if (this.y - 60 === player.y + 25 && (x + 101 / 2 > player.x && x - 101 < player.x)) {
          gameState.score += this.points;
          playSound('collectablePickup');
          this.destroy();
        }
      }
    };

    this.idleAnimation = function(dt) {
      if (this.x < x - 8) {
        this.velocity = -this.velocity;
        this.x = x - 8;
      } else if (this.x > x + 8) {
        this.velocity = -this.velocity;
        this.x = x + 8;
      } else {
        this.x += this.velocity * dt;
      }
    };

    this.destroy = function() {
      var index = allCollectables.indexOf(this);
      allCollectables.splice(index, 1);
    };
  };
  Collectable.prototype = Object.create(Entity.prototype);
  Collectable.prototype.constructor = Collectable;

  document.addEventListener('keyup', onKeyUp);
  document.addEventListener('touchend', onTouchEnd);
  document.addEventListener('touchstart', onTouchStart);
  canvas.addEventListener('mousemove', onCanvasMouseMove);
  canvas.addEventListener('mousedown', onCanvasMouseDown);
  canvas.addEventListener('mouseup', onCanvasMouseUp);

  init();

  // Expose the objects used by engine.js.
  global.player = player;
  global.allEnemies = allEnemies;
  global.allCollectables = allCollectables;
  global.drawScore = drawScore;
  global.drawLives = drawLives;
  global.drawLevel = drawLevel;
  global.drawMenu = drawMenu;
  global.menus = menus;

  /**
   * Draws the level text on the canvas.
   */
  function drawLevel() {
    ctx.save();
    ctx.font = '20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('Level - ' + gameState.level, 101 * 2.5, 45);
    ctx.restore();
  }

  /**
   * Draws the hearts (indicating lives remaining) on the canvas.
   */
  function drawLives() {
    var x = 0;
    for (var i = 0, len = gameState.lives; i < len; i++) {
      ctx.drawImage(Resources.get('images/Heart.png'), x, 10, 25, 43);
      x += 30;
    }
  }

  /**
   * Draws the specified menu on the canvas.
   */
  function drawMenu(menu) {
    if (menu === 'start') {
      drawStartMenu();
    } else if (menu === 'scores') {
      drawScoresMenu();
    }
  }

  /**
   * Draws the score text on the canvas.
   */
  function drawScore() {
    ctx.save();
    ctx.font = '24px serif';
    ctx.textAlign = 'end';  // start, end, left, right, center
    ctx.textBaseline = 'alphabetic';  // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('Score: ' + gameState.score, 101 * 5, 45);
    ctx.restore();
  }

  /**
   * Draws the scores menu on the canvas.
   */
  function drawScoresMenu() {
    // Includes a top padding of 6px.
    ctx.save();

    var fillStyle;

    // Draw the background.
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 6, canvas.width, canvas.height - 6);
    ctx.strokeRect(1, 6, canvas.width - 2, canvas.height - 7);

    // Draw the title.
    ctx.fillStyle = '#393';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(51, 153, 51, 0.3)";  // Equivalent to #393 with 50% alpha.
    ctx.font = '38px serif';
    ctx.textAlign = 'center';  // start, end, left, right, center
    ctx.textBaseline = 'alphabetic';  // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('Your High Scores', (canvas.width - 2) / 2, 60);

    // Draw the high scores.
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.strokeStyle = '#666';
    ctx.fillStyle = '#fafafa';
    ctx.strokeRect(20, 60 + 20, canvas.width - 40, canvas.height - 80 - 80 - 20);
    ctx.fillRect(20, 60 + 20, canvas.width - 40, canvas.height - 80 - 80 - 20);

    ctx.shadowColor = "rgba(0, 0, 0, 0.0)";
    ctx.textBaseline = 'alphabetic';  // top, hanging, middle, alphabetic, ideographic, bottom
    var scoreTableHeight = (canvas.height - 80 - 80 - 20);
    var scoreTableWidth = canvas.width - 40;

    for (var i = 0, len = scores.length; i < 20 && i < len; i++) {
      var col = 0;
      var row = i % 10;

      if (i >= 10) {
        col = 1;
      }

      // Ranking.
      ctx.textAlign = 'end';  // start, end, left, right, center
      ctx.font = '16px serif';
      ctx.fillStyle = '#666';
      ctx.fillText('#' + (i + 1) + ':',  20 + 40 + (Math.floor(scoreTableWidth / 2) * col), 80 + 25 + Math.floor((scoreTableHeight - 35) / 9) * row);
      // Amount.
      ctx.textAlign = 'start';  // start, end, left, right, center
      ctx.font = '20px Courier';
      ctx.fillStyle = '#333';
      ctx.fillText(scores[i].amount, 20 + 40 + 5 + (Math.floor(scoreTableWidth / 2) * col), 80 + 25 + Math.floor((scoreTableHeight - 35) / 9) * row);
      // Level.
      ctx.font = '14px Courier';
      ctx.fillStyle = '#777';
      ctx.fillText('level ' + scores[i].level, 20 + 110 + 5 + (Math.floor(scoreTableWidth / 2) * col), 80 + 25 + Math.floor((scoreTableHeight - 35) / 9) * row);
    }

    // Draw the buttons.

    // Continue button.
    // If pressed...
    if (menus.scores.buttons.continue.pressed) {
      fillStyle = '#ddd';
    }
    // Else, if hovered...
    else if (menus.scores.buttons.continue.hovered) {
      fillStyle = '#e7e7e7';
    }
    // Else...
    else {
      fillStyle = '#fafafa';
    }

    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = '#666';
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.strokeRect((canvas.width - 2) / 2 - 70, canvas.height - 80, 140, 40);
    ctx.fillRect((canvas.width - 2) / 2 - 70, canvas.height - 80, 140, 40);
    ctx.shadowColor = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = '#393';  // Same as title.
    ctx.font = '24px serif';
    ctx.textAlign = 'center';  // start, end, left, right, center
    ctx.textBaseline = 'middle';  // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('Continue', (canvas.width - 2) / 2, canvas.height - 60);

    ctx.restore();
  }

  /**
   * Draws the start menu on the canvas.
   */
  function drawStartMenu() {
    ctx.save();
    var fillStyle;

    // Includes a top padding of 6px.

    // Draw the background.
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 6, canvas.width, canvas.height - 6);
    ctx.strokeRect(1, 6, canvas.width - 2, canvas.height - 7);

    // Draw the title.
    ctx.fillStyle = '#393';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = "rgba(51, 153, 51, 0.3)";  // Equivalent to #393 with 50% alpha.
    ctx.font = '38px serif';
    ctx.textAlign = 'center';  // start, end, left, right, center
    ctx.textBaseline = 'alphabetic';  // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('Escape By Water!', (canvas.width - 2) / 2, 86);


    // Draw the player preview.
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.strokeStyle = '#666';
    ctx.fillStyle = '#fafafa';
    ctx.strokeRect((canvas.width - 2) / 2 - 50, 156 + 30, 101, 171 - 30);
    ctx.fillRect((canvas.width - 2) / 2 - 50, 156 + 30, 101, 171 - 30);

    // Draw the player preview sprite.
    // The player sprite is 101 x 171.
    ctx.shadowColor = "rgba(0, 0, 0, 0)";
    ctx.drawImage(Resources.get(settings.playerSprite), (canvas.width - 2) / 2 - 50, 156);

    // Draw the buttons.

    // Previous player sprite button.
    // If pressed...
    if (menus.start.buttons.left.pressed) {
      fillStyle = '#ddd';
    }
    // Else, if hovered...
    else if (menus.start.buttons.left.hovered) {
      fillStyle = '#e7e7e7';
    }
    // Else...
    else {
      fillStyle = '#fafafa';
    }

    ctx.fillStyle = fillStyle;
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.strokeRect((canvas.width - 2) / 2 - 50 - 20, 327 + 10, 65, 30);
    ctx.fillRect((canvas.width - 2) / 2 - 50 - 20, 327 + 10, 65, 30);
    ctx.strokeStyle = '#000';
    ctx.shadowColor = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo((canvas.width - 2) / 2 - 50 - 20 + 45, 327 + 10 + 15);  // Base of arrow.
    ctx.lineTo((canvas.width - 2) / 2 - 50 - 20 + 20, 327 + 10 + 15);  // Tip of arrow.
    ctx.lineTo((canvas.width - 2) / 2 - 50 - 20 + 30, 327 + 10 + 10);  // Top angle of arrow.
    ctx.moveTo((canvas.width - 2) / 2 - 50 - 20 + 20, 327 + 10 + 15);  // Tip of arrow.
    ctx.lineTo((canvas.width - 2) / 2 - 50 - 20 + 30, 327 + 10 + 20);  // Bottom angle of arrow.
    ctx.stroke();

    // Next player sprite button.
    // If pressed...
    if (menus.start.buttons.right.pressed) {
      fillStyle = '#ddd';
    }
    // Else, if hovered...
    else if (menus.start.buttons.right.hovered) {
      fillStyle = '#e7e7e7';
    }
    // Else...
    else {
      fillStyle = '#fafafa';
    }

    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = '#666';
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.strokeRect((canvas.width - 2) / 2 + 5, 327 + 10, 65, 30);
    ctx.fillRect((canvas.width - 2) / 2 + 5, 327 + 10, 65, 30);
    ctx.strokeStyle = '#000';
    ctx.shadowColor = "rgba(0, 0, 0, 0)";
    ctx.beginPath();
    ctx.moveTo((canvas.width - 2) / 2 + 5 + 20, 327 + 10 + 15);  // Base of arrow.
    ctx.lineTo((canvas.width - 2) / 2 + 5 + 45, 327 + 10 + 15);  // Tip of arrow.
    ctx.lineTo((canvas.width - 2) / 2 + 5 + 35, 327 + 10 + 10);  // Top angle of arrow.
    ctx.moveTo((canvas.width - 2) / 2 + 5 + 45, 327 + 10 + 15);  // Tip of arrow.
    ctx.lineTo((canvas.width - 2) / 2 + 5 + 35, 327 + 10 + 20);  // Bottom angle of arrow.
    ctx.stroke();

    // Play button.
    // If pressed...
    if (menus.start.buttons.play.pressed) {
      fillStyle = '#ddd';
    }
    // Else, if hovered...
    else if (menus.start.buttons.play.hovered) {
      fillStyle = '#e7e7e7';
    }
    // Else...
    else {
      fillStyle = '#fafafa';
    }

    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = '#666';
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.strokeRect((canvas.width - 2) / 2 - 50, canvas.height - 120, 100, 40);
    ctx.fillRect((canvas.width - 2) / 2 - 50, canvas.height - 120, 100, 40);
    ctx.shadowColor = "rgba(0, 0, 0, 0)";
    ctx.fillStyle = '#393';  // Same as title.
    ctx.font = '24px serif';
    ctx.textAlign = 'center';  // start, end, left, right, center
    ctx.textBaseline = 'middle';  // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('Play', (canvas.width - 2) / 2, canvas.height - 100);

    // Bug Report button.
    // If pressed...
    if (menus.start.buttons.issues.pressed) {
      fillStyle = '#ddd';
    }
    // Else, if hovered...
    else if (menus.start.buttons.issues.hovered) {
      fillStyle = '#e7e7e7';
    }
    // Else...
    else {
      fillStyle = '#fafafa';
    }

    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = '#666';
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.strokeRect(10, canvas.height - 30, 20, 20);
    ctx.fillRect(10, canvas.height - 30, 20, 20);

    // Draw a little bug :)
    ctx.beginPath();
    // The body.
    ctx.arc(20, canvas.height - 20, 5, 0, Math.PI, true);
    ctx.lineTo(15, canvas.height - 18);
    ctx.arc(20, canvas.height - 18, 5, Math.PI, 0, true);
    ctx.lineTo(25, canvas.height - 20);
    ctx.fillStyle = '#111';
    ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    ctx.fill();
    // The antennae.
    ctx.moveTo(17, canvas.height - 24);
    ctx.lineTo(15, canvas.height - 27);
    ctx.moveTo(23, canvas.height - 24);
    ctx.lineTo(25, canvas.height - 27);
    // The legs.
    // Left middle.
    ctx.moveTo(15, canvas.height - 19);
    ctx.lineTo(12, canvas.height - 19);
    // Right middle.
    ctx.moveTo(25, canvas.height - 19);
    ctx.lineTo(28, canvas.height - 19);
    // Left bottom.
    ctx.moveTo(16, canvas.height - 16);
    ctx.lineTo(13, canvas.height - 15);
    // Right bottom.
    ctx.moveTo(24, canvas.height - 16);
    ctx.lineTo(27, canvas.height - 15);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Called on game over. Updates the high scores, activates the scores menu
   * and removes all enemies and collectables from play.
   */
  function gameOver() {
    updateScores();
    menus.scores.active = true;
    allEnemies.length = 0;
    allCollectables.length = 0;
  }

  /**
   * Initializes the game.
   */
  function init() {
    // Create the media element sources.
    for (var sound in sounds) {
      sounds[sound].mediaElementSource = audioCtx.createMediaElementSource(sounds[sound].audio);
    }

    // Create the player.
    player = new Player();

    // Load the scores from local storage.
    scores = retrieveScores();
  }

  /**
   * Sets the player sprite to the next sprite in the list, or the first if
   * none remain.
   */
  function nextPlayerSprite() {
    var i = playerSprites.indexOf(settings.playerSprite);

    if (++i >= playerSprites.length) {
      i = 0;
    }

    settings.playerSprite = playerSprites[i];
  }

  /**
   * Handles the keyup event.
   * @param {object} e - The event.
   */
  function onKeyUp(e) {
    if (!audioPrimed) {
      primeAudio();
    }

    var allowedKeys = {
        37: 'left',  // left arrow
        65: 'left',  // a
        38: 'up',    // up arrow
        87: 'up',    // w
        39: 'right', // right arrow
        68: 'right', // d
        40: 'down',  // down arrow
        83: 'down'   // s
    };

    player.handleInput(allowedKeys[e.keyCode]);
  }

  /**
   * Handles the canvas's mousedown event.
   * @param {object} e - The event.
   */
  function onCanvasMouseDown(e) {
    for (var menu in menus) {
      if (menus[menu].active) {
        for (var button in menus[menu].buttons) {
          button = menus[menu].buttons[button];

          // Set pressed state to false initially.
          button.pressed = false;

          if (button.hovered) {
            button.pressed = true;
          }
        }
      }
    }
  }

  /**
   * Handles the canvas's mousemove event.
   * @param {object} e - The event.
   */
  function onCanvasMouseMove(e) {
    for (var menu in menus) {
      if (menus[menu].active) {
        for (var button in menus[menu].buttons) {
          button = menus[menu].buttons[button];

          // Set hovered state to false initially.
          button.hovered = false;

          // Check if hovered on the x-axis.
          if (e.layerX > button.x && e.layerX <= button.x + button.width) {
            // Check if hovered on the y-axis.
            if (e.layerY > button.y && e.layerY <= button.y + button.height) {
              button.hovered = true;
            }
          }

          // Set pressed state to false if not hovered.
          if (!button.hovered) {
            button.pressed = false;
          }
        }
      }
    }
  }

  /**
   * Handles the canvas's mouseup event.
   * @param {object} e - The event.
   */
  function onCanvasMouseUp(e) {
    for (var menu in menus) {
      if (menus[menu].active) {
        for (var button in menus[menu].buttons) {
          button = menus[menu].buttons[button];

          if (button.hovered && button.pressed) {
            button.pressed = false;
            playSound('buttonPress');
            button.action();
          }
        }
      }
    }
  }

  /**
   * Handles the touchend event.
   * @param {object} e - The event.
   */
  function onTouchEnd(e) {
    e.preventDefault();  // Prevent double-touch zoom.

    if (!audioPrimed) {
      primeAudio();
    }

    var handlingMenu = false;

    // If any menus are active...
    for (var menu in menus) {
      if (menus[menu].active) {
        handlingMenu = true;
        handleMenuTouchEnd(menu);
      }
    }

    if (!handlingMenu) {
      handleGameTouchEnd();
    }

    function handleMenuTouchEnd(menu) {
      // Early abort if the touch didn't end on the canvas.
      if (e.target !== canvas) {
        // Set all buttons' hovered and pressed states to false.
        for (var menuButton in menus[menu].buttons) {
          menus[menu].buttons[menuButton].hovered = false;
          menus[menu].buttons[menuButton].pressed = false;
        }
        return;
      }

      var canvasX = e.changedTouches[0].pageX - e.target.offsetLeft;  // The touch's canvas-relative x-axis position.
      var canvasY = e.changedTouches[0].pageY - e.target.offsetTop;   // The touch's canvas-relative y-axis poisition.

      // Check if the touch ended on a button.
      for (var button in menus[menu].buttons) {
        button = menus[menu].buttons[button];

        // If the button isn't hovered, the touch didn't start on the button;
        // therefore we don't care if it ends on the button.
        if (button.hovered) {
          // Check if aligned on the x-axis.
          if (canvasX > button.x && canvasX <= button.x + button.width) {
            // Check if aligned on the y-axis.
            if (canvasY > button.y && canvasY <= button.y + button.height) {
              playSound('buttonPress');
              button.action();
            }
          }

          // Always set hovered and pressed to false on touch end.
          button.hovered = button.pressed = false;
        }
      }
    }

    function handleGameTouchEnd() {
      var relativeToPlayer;

      var canvasRect = canvas.getBoundingClientRect();

      var touchX = e.changedTouches[0].pageX;
      var touchY = e.changedTouches[0].pageY;
      var playerX = canvasRect.left + player.x + 50;
      var playerY = canvasRect.top + player.y + 124;
      var buffer = 101 / 2;

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
    }
  }

  /**
   * Handles the touchstart event.
   * @param {object} e - The event.
   */
  function onTouchStart(e) {
    // If any menus are active...
    for (var menu in menus) {
      if (menus[menu].active) {
        handleMenuTouchStart(menu);
      }
    }

    function handleMenuTouchStart(menu) {
      // Early abort if the touch didn't start on the canvas.
      if (e.target !== canvas) {
        return;
      }

      var canvasX = e.changedTouches[0].pageX - e.target.offsetLeft;  // The touch's canvas-relative x-axis position.
      var canvasY = e.changedTouches[0].pageY - e.target.offsetTop;   // The touch's canvas-relative y-axis poisition.

      // Check if the touch started on a button.
      for (var button in menus[menu].buttons) {
        button = menus[menu].buttons[button];

        // Check if aligned on the x-axis.
        if (canvasX > button.x && canvasX <= button.x + button.width) {
          // Check if aligned on the y-axis.
          if (canvasY > button.y && canvasY <= button.y + button.height) {
            button.hovered = button.pressed = true;
          }
        }
      }
    }
  }

  /**
   * Opens the bug tracker for this app.
   */
  function openBugTacker() {
    window.open('https://github.com/Tempurturtul/fend-frogger/issues', '_blank');
  }

  /**
   * Called to play the game. Ensures no menus are active then resets the game.
   */
  function play() {
    for (var menu in menus) {
      menus[menu].active = false;
    }
    reset();
  }

  /**
   * Plays the sound using the audio context.
   * @param {string} sound - The name of the appropriate property in sounds.
   */
  function playSound(sound) {
    // Early abort if sound not in sounds.
    if (!sounds[sound]) {
      return;
    }

    sound = sounds[sound];
    // Reset the track.
    sound.audio.currentTime = 0;
    // Set the track volume.
    sound.audio.volume = 0.01;
    // Play the track.
    sound.audio.play();

    // Connect the sound's audio context source to the audio context's destination.
    sound.mediaElementSource.connect(audioCtx.destination);
  }

  /**
  * Sets the player sprite to the previous sprite in the list, or the last if
  * none remain.
   */
  function prevPlayerSprite() {
    var i = playerSprites.indexOf(settings.playerSprite);

    if (--i < 0) {
      i = playerSprites.length - 1;
    }

    settings.playerSprite = playerSprites[i];
  }

  /**
   * Called in response to a user-triggered event; silently plays every sound.
   */
  function primeAudio() {
    // Many mobile devices prevent sounds from being played except as a
    // response to a user event action.
    for (var sound in sounds) {
      var audio = sounds[sound].audio;
      audio.volume = 0;
      audio.play();
    }
    audioPrimed = true;
  }

  /**
   * Resets the game.
   */
  function reset() {
    gameState.numEnemies = gameState.original.numEnemies;
    gameState.enemySpeedRange = gameState.original.enemySpeedRange;
    gameState.newEnemyLevel = gameState.original.newEnemyLevel;
    gameState.lives = 3;
    gameState.level = 1;
    gameState.score = 0;
    spawnEnemies();
    spawnCollectables();
    player.reset();
  }

  /**
   * Restarts the game. (Differs from reset in that it sets the active menu to
   * the start menu, whereas reset does not effect the menus.)
   */
  function restart() {
    for (var menu in menus) {
      if (menu === 'start') {
        menus[menu].active = true;
      } else {
        menus[menu].active = false;
      }
    }
    reset();
  }

  /**
   * Returns the high scores stored in local storage, or an empty array if none
   * are found.
   * @returns {object[]|array} The stored high scores or an empty array.
   */
  function retrieveScores() {
    if (util.storageAvailable('localStorage')) {
      var retrievedScores = JSON.parse(window.localStorage.getItem('scores')) || [];
      return retrievedScores;
    } else {
      console.warn('Unable to retrieve high scores; local storage is unavailable.');
      return [];
    }
  }

  /**
   * Attempts to save the high scores to local storage.
   */
  function saveScores() {
    if (util.storageAvailable('localStorage')) {
      window.localStorage.setItem('scores', JSON.stringify(scores));
    } else {
      console.warn('High scores not saved; local storage is unavailable.');
    }
  }

  /**
   * Removes existing collectables and spawns new ones.
   */
  function spawnCollectables() {
    // Clear the collectables array while preserving references to it.
    allCollectables.length = 0;

    for (var i = 0, len = gameState.numCollectables; i < len; i++) {
      var collectable = new Collectable();
      allCollectables.push(collectable);
    }
  }

  /**
   * Removes existing enemies and spawns new ones.
   */
  function spawnEnemies() {
    // Empty the array without damaging references to it.
    allEnemies.length = 0;

    for (var i = 0, len = gameState.numEnemies; i < len; i++) {
      var enemy = new Enemy();
      allEnemies.push(enemy);
    }
  }

  /**
   * Updates the game difficulty (after a level increase, for example).
   */
  function updateDifficulty() {
    // Increase enemy speed.
    var range = gameState.enemySpeedRange;
    var minLimit = 200;
    var maxLimit = 500;
    var minIncrement = 5;
    var maxIncrement = 20;

    range[0] = range[0] + minIncrement > minLimit ? minLimit : range[0] + minIncrement;
    range[1] = range[1] + maxIncrement > maxLimit ? maxLimit : range[1] + maxIncrement;

    gameState.enemySpeedRange = range;

    // Increase number of enemies if the limit hasn't been reached, and set the
    // new newEnemyLevel.
    var enemyCap = 5;
    var newEnemyLevel = gameState.newEnemyLevel;

    if (gameState.numEnemies < enemyCap && gameState.level === newEnemyLevel) {
      allEnemies.push(new Enemy());
      gameState.numEnemies++;

      // Set the newEnemyLevel to the lesser of double the current newEnemyLevel
      // and 30 + the current newEnemyLevel.
      var double = newEnemyLevel * 2;
      var maxIncrease = newEnemyLevel + 30;
      gameState.newEnemyLevel = Math.min(double, maxIncrease);
    }
  }

  /**
   * Updates the high scores with the current score and level, then sorts and
   * saves them.
   */
  function updateScores() {
    scores.push({
      'amount': gameState.score,
      'level': gameState.level
    });

    // Sort scores in descending order based on the score amount.
    scores = scores.sort(function(a, b) {
      if (a.amount < b.amount) {
        return 1;
      } else if (a.amount > b.amount) {
        return -1;
      } else {
        return 0;
      }
    });

    saveScores();
  }

})(this);
