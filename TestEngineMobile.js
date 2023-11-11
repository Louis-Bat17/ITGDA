var config = {
    type: Phaser.AUTO,
    width: window.innerWidth, // Use the full width of the mobile screen
    height: window.innerHeight, // Use the full height of the mobile screen
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
var enemySpeed; // Adjust the speed based on screen height
var enemy2;
var enemySpeed2; // Adjust the speed based on screen height
var enemy3;
var enemySpeed3; // Adjust the speed based on screen height
var treasure;
var checkFlag = false;

function preload() {
    // Load your assets, e.g., images, as needed
    this.load.image('background', 'assets/BackgroundMain.png')
    this.load.image('char', 'assets/MainChar.png');
    this.load.image('enemy', 'assets/EnemySprite.png');
    this.load.image('treasure', 'assets/TreasureChest.png')
}

function create() {
    // Set the background image to cover the entire game screen
    var backgroundImage = this.add.image(0, 0, 'background');
    backgroundImage.setOrigin(0, 0);
    backgroundImage.displayWidth = window.innerWidth;
    backgroundImage.displayHeight = window.innerHeight;

    character = this.physics.add.sprite(20, window.innerHeight / 2, 'char');
    character.setCollideWorldBounds(true);
    character.setScale(0.5);

    minY = 110;
    maxY = window.innerHeight - 110;

    // Calculate enemy speed based on screen height
    enemySpeed = window.innerHeight / 300;
    enemy = this.physics.add.sprite(window.innerWidth / 4, Phaser.Math.Between(minY, maxY), 'enemy');
    enemy.setCollideWorldBounds(true);
    enemy.setScale(0.5);

    // Calculate enemy2 speed based on screen height
    enemySpeed2 = window.innerHeight / 200;
    enemy2 = this.physics.add.sprite(window.innerWidth / 2, Phaser.Math.Between(minY, maxY), 'enemy');
    enemy2.setCollideWorldBounds(true);
    enemy2.setScale(0.5);

    // Calculate enemy3 speed based on screen height
    enemySpeed3 = window.innerHeight / 200;
    enemy3 = this.physics.add.sprite(window.innerWidth / 2 + 200, Phaser.Math.Between(minY, maxY), 'enemy');
    enemy3.setCollideWorldBounds(true);
    enemy3.setScale(0.5);

    treasure = this.physics.add.sprite(window.innerWidth - 20, window.innerHeight / 2, 'treasure');
    treasure.setCollideWorldBounds(true);
    treasure.setScale(0.5);

    character.setSize(30, 50);
    enemy.setSize(30, 50);
    enemy2.setSize(30, 30);
    enemy3.setSize(30, 30);

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(character, [enemy, enemy2, enemy3, treasure], handleCollision, null, this);
}

function update() {
    if (cursors.left.isDown) {
        character.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        character.setVelocityX(200);
    } else {
        character.setVelocityX(0);
    }

    if (this.input.pointer1.isDown) {
        if (this.input.pointer1.x < window.innerWidth / 2) {
            character.setVelocityX(-200);
        } else {
            character.setVelocityX(200);
        }
    }

    enemy.y += enemySpeed;
    if (enemy.y <= minY || enemy.y >= maxY) {
        enemySpeed *= -1;
    }

    enemy2.y += enemySpeed2;
    if (enemy2.y <= minY || enemy2.y >= maxY) {
        enemySpeed2 *= -1;
    }

    enemy3.y += enemySpeed3;
    if (enemy3.y <= minY || enemy3.y >= maxY) {
        enemySpeed3 *= -1;
    }
}

function handleCollision(character, enemy) {
    const distance = Phaser.Math.Distance.Between(
        character.x, character.y,
        enemy.x, enemy.y
    );
    const collisionThreshold = 100;
    var message = enemy.texture.key;
    if (message == "treasure") {
        message = "You have found the " + message + ". You Won!";
    } else if (message == "enemy") {
        message = "Game Over, the " + message + " got you";
    }
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