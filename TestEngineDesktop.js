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
// set variables and above setup the config
var game = new Phaser.Game(config);
var character;
var cursors;
var enemiesGroup;
var minY; 
var maxY;
var enemySpeed = 0.5;
var treasure;
var checkFlag = false;

function preload() {
    // Load of all associated assets from assets folder
    this.load.image('background', 'assets/BackgroundMain.png')
    this.load.image('char', 'assets/MainChar.png');
    this.load.image('enemy', 'assets/EnemySprite.png');
    this.load.image('treasure', 'assets/TreasureChest.png')
}

function create() {
    // Manage on create function and load in sprites
    var backgroundImage = this.add.image(0, 0, 'background');
    backgroundImage.setOrigin(0, 0);
    backgroundImage.displayWidth = this.sys.game.config.width;
    backgroundImage.displayHeight = this.sys.game.config.height;

    character = this.physics.add.sprite(20, config.height / 2, 'char');
    character.setCollideWorldBounds(true);
    character.setScale(0.5);

    minY = 110;
    maxY = config.height - 110;
    enemiesGroup = this.physics.add.group();

    // Calculate the starting X position for the first enemy to be in the middle
    var startX = window.innerWidth / 6;

    // Create 6 enemies and add them to the group
    for (var i = 0; i < 6; i++) {
        var enemy = this.physics.add.sprite(startX + (i * 200), window.innerHeight/2, 'enemy');
        enemy.setCollideWorldBounds(true);
        enemy.setScale(0.5);
        var enemySpeed = Phaser.Math.Between(2, 10) * 0.1;
        enemy.speed = enemySpeed;
        enemiesGroup.add(enemy);
    }

    treasure = this.physics.add.sprite(window.innerWidth - 20, window.innerHeight / 2, 'treasure');
    treasure.setCollideWorldBounds(true);
    treasure.setScale(0.5);
    character.setSize(30, 50);
    enemiesGroup.children.iterate(function (enemy) {
        enemy.setSize(30, 50);
    });

    cursors = this.input.keyboard.createCursorKeys();

    // Add collision between character and enemy group with a callback function
    this.physics.add.collider(character, [enemiesGroup, treasure], handleCollision, null, this);
}

function update() {
    // On update and include input
    if (cursors.left.isDown) {
        character.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        character.setVelocityX(200);
    } else {
        character.setVelocityX(0);
    }

    if (this.input.pointer1.isDown) {
        if (this.input.pointer1.x < config.width / 2) {
            character.setVelocityX(-200);
        } else {
            character.setVelocityX(200);
        }
    }

    // Update each enemy's vertical movement individually
    enemiesGroup.children.iterate(function (enemy) {
        enemy.y += enemy.speed; // Use the assigned speed

        if (enemy.y <= minY || enemy.y >= maxY) {
            enemy.speed *= -1;
        }
    });
}

function handleCollision(character, object) {
    // on collision with a sprite
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
    // reset game on success or failure
    character.destroy();
    enemiesGroup.destroy(true);
    treasure.destroy();
    window.location.reload();
}

function shakePage() {
    // shake if failure or success
    document.body.classList.add("shake");
}