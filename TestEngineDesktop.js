var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var character;
var cursors;
var enemy;
var minY; // Minimum Y position for enemy
var maxY; // Maximum Y position for enemy
var enemySpeed = 0.5; // Adjust the speed as needed

var enemy2;
var enemySpeed2 = 1;

var enemy3;
var enemySpeed3 = 1;

var treasure;

var checkFlag = false;


function preload ()
{
    this.load.image('background', 'assets/BackgroundMain.png')
    this.load.image('char', 'assets/myuniquechar.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('treasure', 'assets/treasure.png')
}

function create ()
{
    // this.cameras.main.setBackgroundColor(0x000000);
    // Add the background image
    var backgroundImage = this.add.image(0, 0, 'background');

    // Set the background image to cover the entire game screen
    backgroundImage.setOrigin(0, 0);
    backgroundImage.displayWidth = this.sys.game.config.width;
    backgroundImage.displayHeight = this.sys.game.config.height;

    character = this.physics.add.sprite(20, config.height / 2, 'char');
    character.setCollideWorldBounds(true);
    character.setScale(0.5);

    // Calculate the vertical movement range based on the window height
    minY = 110;
    maxY = config.height - 110;

    // Create the enemy sprite with an initial Y position within the range
    enemy = this.physics.add.sprite(config.width / 2 / 2, Phaser.Math.Between(minY, maxY), 'enemy');
    enemy.setCollideWorldBounds(true);
    enemy.setScale(0.5);

    enemy2= this.physics.add.sprite(config.width / 2, Phaser.Math.Between(minY, maxY), 'enemy');
    enemy2.setCollideWorldBounds(true);
    enemy2.setScale(0.5);

    enemy3= this.physics.add.sprite(config.width / 2 + 200, Phaser.Math.Between(minY, maxY), 'enemy');
    enemy3.setCollideWorldBounds(true);
    enemy3.setScale(0.5);

    treasure = this.physics.add.sprite(window.innerWidth - 20, window.innerHeight / 2, 'treasure');
    treasure.setCollideWorldBounds(true);
    treasure.setScale(0.5);

    character.setSize(30, 50);
    // Inside the create() function, set a custom hitbox size for the enemy sprites
    enemy.setSize(30, 50); // Adjust the width and height as needed
    enemy2.setSize(30, 30); // Adjust the width and height as needed
    enemy3.setSize(30, 30); // Adjust the width and height as needed


    // Create cursors for character movement
    cursors = this.input.keyboard.createCursorKeys();

    // Add collision between character and enemy group with a callback function
    this.physics.add.collider(character, [enemy, enemy2, enemy3, treasure], handleCollision, null, this);

    // Create cursors for character movement
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // Character movement logic using keyboard
    if (cursors.left.isDown) {
        character.setVelocityX(-200); // Move left
    } else if (cursors.right.isDown) {
        character.setVelocityX(200); // Move right
    } else {
        character.setVelocityX(0); // Stop moving horizontally
    }

    // Character movement logic using touch gestures
    if (this.input.pointer1.isDown) {
        // Check if the touch position is on the left or right side of the screen
        if (this.input.pointer1.x < config.width / 2) {
            character.setVelocityX(-200); // Move left
        } else {
            character.setVelocityX(200); // Move right
        }
    }

    // Update the enemy's vertical movement
    enemy.y += enemySpeed;

    // Check if the enemy has reached the top or bottom of the window
    if (enemy.y <= minY || enemy.y >= maxY) {
        enemySpeed *= -1; // Reverse the movement direction
    }

    // Update the enemy's vertical movement
    enemy2.y += enemySpeed2;

    // Check if the enemy has reached the top or bottom of the window
    if (enemy2.y <= minY || enemy2.y >= maxY) {
        enemySpeed2 *= -1; // Reverse the movement direction
    }

            // Update the enemy's vertical movement
    enemy3.y += enemySpeed3;

    // Check if the enemy has reached the top or bottom of the window
    if (enemy3.y <= minY || enemy3.y >= maxY) {
        enemySpeed3 *= -1; // Reverse the movement direction
    }
}

function handleCollision(character, enemy) {
    // Calculate the distance between character and enemy
    const distance = Phaser.Math.Distance.Between(
        character.x, character.y,
        enemy.x, enemy.y
    );
     // Set a threshold for collision detection
    const collisionThreshold = 100; // Adjust this value as needed
    var message;
    message = enemy.texture.key;
    if (message == "treasure") {
        message = "You have found the " + message + ". You Won!";
    }else if (message == "enemy"){
        message = "Game Over, the " +  message + " got you";
    }
    // Check if the distance is less than the threshold
    if (distance < collisionThreshold) {
        shakePage();
        if (checkFlag == false) {
            alert(message);
            checkFlag = true;     
        }
        this.physics.pause();
        setTimeout(function() {
            resetGame();
          }, 500);
        return true;
    }
    return false;
}

function resetGame() {
    character.destroy();
    enemy.destroy();
    enemy2.destroy();
    enemy3.destroy();
    treasure.destroy();
    window.location.reload();

}

function shakePage() {
    document.body.classList.add("shake");
}
