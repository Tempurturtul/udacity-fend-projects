// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = util.randomRange(0, 101 * 4);
    this.y = 83 * util.randomRange(1, 3) - 25;
    this.speed = util.randomRange(80, 500);
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
      this.speed = util.randomRange(80, 500);
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
  this.reset();
  spawnEnemies();
  spawnCollectables();
};

Player.prototype.die = function() {
  this.reset();
  score -= 75;
};

Player.prototype.reset = function() {
  this.x = 101 * 2;
  this.y = 83 * 5 - 25;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var numEnemies = 4;
var allEnemies = [];
var player = new Player();

spawnEnemies();

function spawnEnemies() {
  allEnemies = [];

  for (var i = 0; i < numEnemies; i++) {
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
  var playerY = bodyRect.height / 2 - canvasRect.height / 2 + (player.y + 124);
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

var score = 0;

function drawScore() {
  ctx.font = '28px serif';
  ctx.textAlign = 'end';  // start, end, left, right, center
  ctx.textBaseline = 'top';  // top, hanging, middle, alphabetic, ideographic, bottom
  ctx.fillText('Score: ' + score, 101 * 5, 20);
}

var Collectable = function() {
  var colors = ['Blue', 'Green', 'Orange'];
  var randomColor = colors[util.randomRange(0, 2)];
  var velocities = [-20, 20];
  var randomVelocity = velocities[util.randomRange(0, 1)];

  this.sprite = 'images/Gem ' + randomColor + '.png';
  this.x = 101 * util.randomRange(0, 4) + 38;
  this.y = 83 * util.randomRange(1, 3) + 60;
  this.origX = this.x;
  this.origY = this.y;
  this.velocity = randomVelocity;
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

var numCollectables = 3;
var allCollectables = [];
spawnCollectables();

function spawnCollectables() {
  allCollectables = [];

  for (var i = 0; i < numCollectables; i++) {
    var collectable = new Collectable();
    allCollectables.push(collectable);
  }
}
