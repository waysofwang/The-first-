var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }
    }
  }
};

var game = new Phaser.Game(config);

var bird;
var pipes;
var scoreText;
var username;
var leaderboard = []; // Placeholder for leaderboard data

function preload() {
  // Load bird image
  this.load.image('bird', 'Users/sonamwangchuklama/Downloads/bird.png');
  // Load pipe top and bottom images
  this.load.image('pipeTop', 'path/to/your/pipe_top.png');
  this.load.image('pipeBottom', 'path/to/your/pipe_bottom.png');
}

function create() {
  // Username input
  username = document.getElementById('username').value;

  // Bird sprite
  bird = this.physics.add.sprite(100, 200, 'bird');
  bird.setBounce(0);
  bird.setAllowGravity(false);

  // Pipes group
  pipes = this.physics.add.group();

  // Score text
  scoreText = this.add.text(16, 16, "Score: 0", { font: "32px Arial", fill: "#fff" });

  // Controls (spacebar for flapping)
  this.input.keyboard.on('keydown_SPACE', function () {
    bird.setVelocityY(-200);
  });

  // Spawn pipes at regular intervals
  this.time.addEvent({ delay: 2000, callback: spawnPipe, callbackScope: this, loop: true });

  // Get leaderboard data from local storage (if it exists)
  var leaderboardString = localStorage.getItem('flappyBirdLeaderboard');
  if (leaderboardString) {
    leaderboard = JSON.parse(leaderboardString);
  }
}

function update() {
  // Check for collisions with pipes
  this.physics.arcade.overlap(bird, pipes, gameOver, null, this);

  // Keep the bird within the game boundaries
  bird.body.setWorldBounds(0, 0, config.width, config.height);
}

function spawnPipe() {
  // Gap between pipes (adjust as needed)
  var gapSize = 100;

  // Random y-position for the top pipe within the game height
  var y = Math.floor(Math.random() * (config.height - gapSize - pipeTop.height));

  // Create top pipe sprite
  var pipeTop = this.physics.add.sprite(config.width, y, 'pipeTop');
  pipeTop.setVelocityX(-200); // Move left at 200 pixels per second
  pipeTop.body.setAllowGravity(false); // Prevent top pipe from falling

  // Create bottom pipe sprite positioned below the gap
  var pipeBottom = this.physics.add.sprite(config.width, y + pipeTop.height + gapSize, 'pipeBottom');
  pipeBottom.setVelocityX(-200); // Move left at 200 pixels per second
  pipeBottom.body.setAllowGravity(false); // Prevent bottom pipe from falling

  // Add pipes to the group (optional for managing them together)
  pipes.add(pipeTop);
  pipes.add(pipeBottom);

  // Destroy pipes once they go off-screen
  pipeTop.checkWorldBounds = true;
  pipeTop.outOfBoundsKill = true;
  pipeBottom.checkWorldBounds = true;
  pipeBottom.outOfBoundsKill = true;
}

function gameOver() {
  // Stop the game
  this.physics.pause();

  // Display score and username input (if username is missing)
  var gameOverText = this.add.text(game.config.width / 2, game.config.height / 2, "Game Over\nScore: " + score, { font: "32px Arial", fill: "#fff" });

  if (!username) {
    username = prompt("Enter Username for Leaderboard:");
  }

  // Add score to leaderboard
  leaderboard.push({ name: username, score: score });

  // Update local storage with leaderboard data
  localStorage.setItem('flappyBirdLeaderboard', JSON
