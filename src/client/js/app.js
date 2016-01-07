(function(global) {
  var util = global.util;
  var ctx = global.ctx;
  var Resources = global.Resources;
  var document = global.document;
  var canvas = document.getElementsByTagName('canvas')[0];
  var lives = 3;
  var score = 0;
  var scores = [];
  var wins = 0;
  var allEnemies = [];
  var allCollectables = [];
  var player;
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
  var settings = {
    numEnemies: 2,
    enemySpeedRange: [130, 300],
    numCollectables: 3,
    playerSprite: playerSprites[0],
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

      // Update the enemy's position, required method for game
      // Parameter: dt, a time delta between ticks
      this.update = function(dt) {
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
      this.render = function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
      };

      this.handleCollisions = function() {
        // Handle player collision.
        if (this.y === player.y && (this.x + 101 / 2 > player.x && this.x - 101 < player.x)) {
          player.die();
        }
      };
  };
  // Now write your own player class
  // This class requires an update(), render() and
  // a handleInput() method.
  var Player = function() {
    this.sprite = settings.playerSprite;
    this.x = 101 * 2;
    this.y = 83 * 5 - 25;

    this.update = function(dt) {
      if (this.y <= -25) {
        this.win();
      }
    };

    this.render = function() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    this.handleInput = function(input) {
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

    this.die = function() {
      if (--lives < 0) {
        this.reset();
        scores.push(score);
        // Sort scores in descending order.
        scores = scores.sort(function(a, b) {
          if (a < b) {
            return 1;
          } else if (a > b) {
            return -1;
          } else {
            return 0;
          }
        });
        menus.scores.active = true;
      } else {
        score -= 75;
        this.reset();
      }
    };

    this.reset = function() {
      this.sprite = settings.playerSprite;
      this.x = 101 * 2;
      this.y = 83 * 5 - 25;
    };
  };
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

    this.render = function() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 25, 43);
    };

    this.update = function (dt) {
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

    this.handleCollisions = function() {
      if (this.y - 60 === player.y + 25 && (this.origX + 101 / 2 > player.x && this.origX - 101 < player.x)) {
        score += 25;
        this.destroy();
      }
    };

    this.destroy = function() {
      var index = allCollectables.indexOf(this);
      allCollectables.splice(index, 1);
    };
  };

  // This listens for key presses and sends the keys to your
  // Player.handleInput() method. You don't need to modify this.
  document.addEventListener('keyup', onKeyUp);
  document.addEventListener('touchend', onTouchEnd);
  document.addEventListener('touchstart', onTouchStart);
  canvas.addEventListener('mousemove', onCanvasMouseMove);
  canvas.addEventListener('mousedown', onCanvasMouseDown);
  canvas.addEventListener('mouseup', onCanvasMouseUp);

  init();

  global.player = player;
  global.allEnemies = allEnemies;
  global.allCollectables = allCollectables;
  global.drawScore = drawScore;
  global.drawLives = drawLives;
  global.drawMenu = drawMenu;
  global.menus = menus;

  function drawLives() {
    var x = 0;
    for (var i = 0; i < lives; i++) {
      ctx.drawImage(Resources.get('images/Heart.png'), x, 10, 25, 43);
      x += 30;
    }
  }

  function drawMenu(menu) {
    ctx.save();
    var fillStyle;

    if (menu === 'start') {
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
    } else if (menu === 'scores') {
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

      for (var i = 0; i < 20 && i < scores.length; i++) {
        var col = 0;
        var row = i % 10;

        if (i >= 10) {
          col = 1;
        }

        // Ranking.
        ctx.textAlign = 'end';  // start, end, left, right, center
        ctx.font = '20px serif';
        ctx.fillStyle = '#666';
        ctx.fillText('#' + (i + 1) + ':',  20 + 70 + (Math.floor(scoreTableWidth / 2) * col), 80 + 25 + Math.floor((scoreTableHeight - 35) / 9) * row);
        // Amount.
        ctx.textAlign = 'start';  // start, end, left, right, center
        ctx.font = '20px Courier';
        ctx.fillStyle = '#333';
        ctx.fillText(scores[i], 20 + 70 + 5 + (Math.floor(scoreTableWidth / 2) * col), 80 + 25 + Math.floor((scoreTableHeight - 35) / 9) * row);
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
    }

    ctx.restore();
  }

  function drawScore() {
    ctx.font = '28px serif';
    ctx.textAlign = 'end';  // start, end, left, right, center
    ctx.textBaseline = 'top';  // top, hanging, middle, alphabetic, ideographic, bottom
    ctx.fillText('Score: ' + score, 101 * 5, 20);
  }

  function init() {
    player = new Player();  // Necessary for engine.js's updateEntities function.
  }

  function nextPlayerSprite() {
    var i = playerSprites.indexOf(settings.playerSprite);

    if (++i >= playerSprites.length) {
      i = 0;
    }

    settings.playerSprite = playerSprites[i];
  }

  function onKeyUp(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
  }

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

  function onCanvasMouseUp(e) {
    for (var menu in menus) {
      if (menus[menu].active) {
        for (var button in menus[menu].buttons) {
          button = menus[menu].buttons[button];

          if (button.hovered && button.pressed) {
            button.pressed = false;
            button.action();
          }
        }
      }
    }
  }

  function onTouchEnd(e) {
    e.preventDefault();  // Prevent double-touch zoom.

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

  function play() {
    for (var menu in menus) {
      menus[menu].active = false;
    }
    reset();
  }

  function prevPlayerSprite() {
    var i = playerSprites.indexOf(settings.playerSprite);

    if (--i < 0) {
      i = playerSprites.length - 1;
    }

    settings.playerSprite = playerSprites[i];
  }

  function reset() {
    settings.numEnemies = settings.original.numEnemies;
    settings.enemySpeedRange = settings.original.enemySpeedRange;
    wins = 0;
    lives = 3;
    score = 0;
    spawnEnemies();
    spawnCollectables();
    player.reset();
  }

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

  function spawnCollectables() {
    // Clear the collectables array while preserving references to it.
    allCollectables.length = 0;

    for (var i = 0; i < settings.numCollectables; i++) {
      var collectable = new Collectable();
      allCollectables.push(collectable);
    }
  }

  function spawnEnemies() {
    // Empty the array without damaging references to it.
    allEnemies.length = 0;

    for (var i = 0; i < settings.numEnemies; i++) {
      var enemy = new Enemy();
      allEnemies.push(enemy);
    }
  }

})(this);
