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
var minY;
var maxY; 
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
    enemiesGroup = this.physics.add.group();

    // Create 6 enemies and add them to the group
    for (var i = 0; i < 5; i++) {
        var enemy = this.physics.add.sprite((i + 1) * (window.innerWidth / 6), window.innerHeight / 2, 'enemy');
        enemy.setCollideWorldBounds(true);
        enemy.setScale(0.5);
        var enemySpeed = Phaser.Math.Between(50, 80) * 0.1; // Speed needs to be more because of the screen length
        enemy.speed = enemySpeed;
        enemiesGroup.add(enemy);
    }

    treasure = this.physics.add.sprite(window.innerWidth - 20, window.innerHeight / 2, 'treasure');
    treasure.setCollideWorldBounds(true);
    treasure.setScale(0.5);

    character.setSize(30, 50);

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(character, enemiesGroup, handleCollision, null, this);
    this.physics.add.collider(character, treasure, handleCollision, null, this);
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

    enemiesGroup.children.iterate(function (enemy) {
        enemy.y += enemy.speed; // Use the assigned speed

        if (enemy.y <= minY || enemy.y >= maxY) {
            enemy.speed *= -1;
        }
    });
}

function handleCollision(character, object) {
    if (object.texture.key === "treasure") {
        alert("You have found the treasure. You Won!");
    } else if (object.texture.key === "enemy") {
        alert("Game Over, the enemy got you");
    }

    shakePage();

    if (!checkFlag) {
        checkFlag = true;
        this.physics.pause();
        setTimeout(function () {
            resetGame();
        }, 500);
    }
}

function resetGame() {
    character.destroy();
    enemiesGroup.destroy(true);
    treasure.destroy();
    window.location.reload();
}

function shakePage() {
    document.body.classList.add("shake");
}