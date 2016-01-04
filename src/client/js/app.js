(function(global) {
  var util = global.util;
  var ctx = global.ctx;
  var Resources = global.Resources;
  var document = global.document;
  var lives = 3;
  var score = 0;
  var wins = 0;
  var allEnemies = [];
  var allCollectables = [];
  var player = null;
  var settings = {
    numEnemies: 2,
    enemySpeedRange: [130, 300],
    numCollectables: 3,
    original: {
      numEnemies: 2,
      enemySpeedRange: [130, 300]
    },
    limits: {
      numEnemies: 6,
      enemySpeedRange: [200, 700]
    }
  };

  // Enemies our player must avoid
  var Enemy = function() {
      // Variables applied to each of our instances go here,
      // we've provided one for you to get started

      // The image/sprite for our enemies, this uses
      // a helper we've provided to easily load images
      this.sprite = 'images/enemy-bug.png';
      this.x = util.randomRange(0, 101 * 4);
      this.y = 83 * util.randomRange(1, 3) - 25;
      this.speed = util.randomRange(settings.enemySpeedRange[0], settings.enemySpeedRange[1]);
  };

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  Enemy.prototype.update = function(dt) {
      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.
      this.x += this.speed * dt;

      if (this.x >= 101 * 5) {
        this.x = -101;
        this.y = 83 * util.randomRange(1, 3) - 25;
        this.speed = util.randomRange(settings.enemySpeedRange[0], settings.enemySpeedRange[1]);
      }

      this.handleCollisions();
  };

  // Draw the enemy on the screen, required method for game
  Enemy.prototype.render = function() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  Enemy.prototype.handleCollisions = function() {
    // Handle player collision.
    if (this.y === player.y && (this.x + 101 / 2 > player.x && this.x - 101 < player.x)) {
      player.die();
    }
  };

  // Now write your own player class
  // This class requires an update(), render() and
  // a handleInput() method.
  var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 101 * 2;
    this.y = 83 * 5 - 25;
  };

  Player.prototype.update = function(dt) {
    if (this.y <= -25) {
      this.win();
    }
  };

  Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  Player.prototype.handleInput = function(input) {
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

  Player.prototype.win = function() {
    score += 100;
    wins++;

    // Increment enemy min speed.
    if (settings.enemySpeedRange[0] + 7 < settings.limits.enemySpeedRange[0]) {
      settings.enemySpeedRange[0] += 7;
    } else {
      settings.enemySpeedRange[0] = settings.limits.enemySpeedRange[0];
    }

    // Increment enemy max speed.
    if (settings.enemySpeedRange[1] + 25 < settings.limits.enemySpeedRange[1]) {
      settings.enemySpeedRange[1] += 25;
    } else {
      settings.enemySpeedRange[1] = settings.limits.enemySpeedRange[1];
    }

    // Increment number of enemies.
    if (wins % 3 === 0 && settings.numEnemies < settings.limits.numEnemies) {
      settings.numEnemies++;
    }

    this.reset();
    spawnEnemies();
    spawnCollectables();
  };

  Player.prototype.die = function() {
    if (--lives < 0) {
      resetGame();
    } else {
      score -= 75;
      this.reset();
    }
  };

  Player.prototype.reset = function() {
    this.x = 101 * 2;
    this.y = 83 * 5 - 25;
  };

  function spawnEnemies() {
    // Empty the array without damaging references to it.
    allEnemies.length = 0;

    for (var i = 0; i < settings.numEnemies; i++) {
      var enemy = new Enemy();
      allEnemies.push(enemy);
    }
  }

  // This listens for key presses and sends the keys to your
  // Player.handleInput() method. You don't need to modify this.
  document.addEventListener('keyup', function(e) {
      var allowedKeys = {
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down'
      };

      player.handleInput(allowedKeys[e.keyCode]);
  });

  document.addEventListener('touchend', function(e) {
    e.preventDefault();  // Prevent double-touch zoom.

    var relativeToPlayer;

    var bodyRect = document.getElementsByTagName('body')[0].getBoundingClientRect();
    var canvasRect = document.getElementsByTagName('canvas')[0].getBoundingClientRect();

    var touchX = e.changedTouches[0].clientX;
    var touchY = e.changedTouches[0].clientY;
    var playerX = bodyRect.width / 2 - canvasRect.width / 2 + (player.x + 50);
    var playerY = player.y + 124;
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
  });

  function drawScore() {
    ctx.font = '28px serif';
    ctx.textAlign = 'end';  // start, end, left, right, center
    ctx.textBaseline = 'top';  // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('Score: ' + score, 101 * 5, 20);
  }

  var Collectable = function() {
    var colors = ['Blue', 'Green', 'Orange'];
    var randomColor = colors[util.randomRange(0, 2)];

    this.sprite = 'images/Gem ' + randomColor + '.png';
    this.x = 101 * util.randomRange(0, 4) + 38;
    this.y = 83 * util.randomRange(1, 3) + 60;
    this.origX = this.x;
    this.origY = this.y;
    this.velocity = util.randomRange(15, 35);

    if (Math.random() > 0.5) {
      this.velocity = -this.velocity;
    }
  };

  Collectable.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 25, 43);
  };

  Collectable.prototype.update = function (dt) {
    if (this.x < this.origX - 8) {
      this.velocity = -this.velocity;
      this.x = this.origX - 8;
    } else if (this.x > this.origX + 8) {
      this.velocity = -this.velocity;
      this.x = this.origX + 8;
    } else {
      this.x += this.velocity * dt;
    }

    this.handleCollisions();
  };

  Collectable.prototype.handleCollisions = function() {
    if (this.y - 60 === player.y + 25 && (this.origX + 101 / 2 > player.x && this.origX - 101 < player.x)) {
      score += 25;
      this.destroy();
    }
  };

  Collectable.prototype.destroy = function() {
    var index = allCollectables.indexOf(this);
    allCollectables.splice(index, 1);
  };

  function spawnCollectables() {
    // Clear the collectables array while preserving references to it.
    allCollectables.length = 0;

    for (var i = 0; i < settings.numCollectables; i++) {
      var collectable = new Collectable();
      allCollectables.push(collectable);
    }
  }

  function drawLives() {
    var x = 0;
    for (var i = 0; i < lives; i++) {
      ctx.drawImage(Resources.get('images/Heart.png'), x, 10, 25, 43);
      x += 30;
    }
  }

  function resetGame() {
    settings.numEnemies = settings.original.numEnemies;
    settings.enemySpeedRange = settings.original.enemySpeedRange;
    wins = 0;
    lives = 3;
    score = 0;
    spawnEnemies();
    spawnCollectables();
    player.reset();
  }

  player = new Player();
  spawnEnemies();
  spawnCollectables();

  global.player = player;
  global.allEnemies = allEnemies;
  global.allCollectables = allCollectables;
  global.drawScore = drawScore;
  global.drawLives = drawLives;
})(this);
