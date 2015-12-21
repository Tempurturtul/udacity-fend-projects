// TODO Ability to reset entire game.

// Information about the game board.
var boardInfo = {
  tileHeight: 83,
  tileWidth: 101,
  // The center of the tile as an offset from its height. (Ex.: A tile at 0 on the y-axis would have a y-axis center at 83-30.)
  tileCenterHeightOffset: 30,
  rows: 6,
  cols: 5,
  enemyRows: [1, 2, 3]
}

// Enemies our player must avoid
var Enemy = function() {
  this.sprite;
  this.x;
  this.y;
  this.speed;

  // Initialize the enemy.
  this.init();
};

Enemy.prototype.init = function() {
  this.sprite = 'images/enemy-bug.png';

  // A random row from enemyRows.
  var row = boardInfo.enemyRows[Math.round(Math.random() * (boardInfo.enemyRows.length - 1))];

  // Initial location.
  this.x = 0;
  this.y = boardInfo.tileHeight * row - boardInfo.tileCenterHeightOffset;

  var minSpeed = 80;
  var maxSpeed = 130;

  // Random speed between min (included) and max (excluded).
  this.speed = Math.floor(Math.random() * (maxSpeed - minSpeed)) + minSpeed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Update location.
    this.x += this.speed * dt;

    // Handle player collision.
    if (player.y === this.y && (player.x > this.x - boardInfo.tileWidth / 2  && player.x < this.x + boardInfo.tileWidth / 2)) {
      player.die();
    }

    // Handle moving off game board.
    if (this.x >= boardInfo.tileWidth * (boardInfo.cols)) {
      this.die();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.die = function() {
  this.init();
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
  this.sprite;
  this.x;
  this.y;
  this.move;

  this.init();
};

Player.prototype.init = function() {
  this.sprite = 'images/char-boy.png';

  // Initial position (column 3).
  this.x = boardInfo.tileWidth * 2;
  // Bottom (row 6).
  this.y = boardInfo.tileHeight * 5 - boardInfo.tileCenterHeightOffset;

  // Movement.
  this.move = '';
};

Player.prototype.update = function(dt) {
  // Update location.
  switch (this.move) {
    case '':
      break;
    case 'left':
      // Do not move further left than column 0.
      this.x - boardInfo.tileWidth <= 0 ? this.x = 0 : this.x -= boardInfo.tileWidth;
      break;
    case 'right':
      // Do not move further right than columns.
      this.x + boardInfo.tileWidth >= boardInfo.tileWidth * (boardInfo.cols - 1) ? this.x = boardInfo.tileWidth * (boardInfo.cols - 1) : this.x += boardInfo.tileWidth;
      break;
    case 'down':
      // Do not move further down than rows.
      this.y + boardInfo.tileHeight >= boardInfo.tileHeight * (boardInfo.rows - 1) - boardInfo.tileCenterHeightOffset ? this.y = boardInfo.tileHeight * (boardInfo.rows - 1) - boardInfo.tileCenterHeightOffset : this.y += boardInfo.tileHeight;
      break;
    case 'up':
      // Do not move further up than row 0.
      this.y - boardInfo.tileHeight <= 0 - boardInfo.tileCenterHeightOffset ? this.y = 0 - boardInfo.tileCenterHeightOffset : this.y -= boardInfo.tileHeight;
      break;
  }

  // Reset movement.
  this.move = '';

  // Handle water collision.
  if (this.y <= 0 - boardInfo.tileCenterHeightOffset) {
    this.win();
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(input) {
  this.move = input;
};

Player.prototype.die = function() {
  this.init();
};

Player.prototype.win = function() {
  this.init();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var player = new Player();

for (var i = 0; i < 5; i++) {
  var enemy = new Enemy();
  allEnemies.push(enemy);
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
