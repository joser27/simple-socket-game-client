import * as Phaser from 'phaser';
import Sword from './Sword';
import Axe from './Axe';
import Pickaxe from './Pickaxe';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(playerName, scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene = scene; 
    this.movementSpeed = 200;
    this.playerName = playerName;

    // Enable physics for the player
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setScale(5); 
    // Adjust the physics body size to match the new scale
    this.body.setSize(8, 12);
    this.body.setOffset(44, 27); // Adjust the offset

    // Player properties
    this.setCollideWorldBounds(true);

    // Create animations
    this.createAnimations();

    // Replace cursor keys with WASD keys
    this.keys = this.scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Create a text object for the player's name
    this.nameText = this.scene.add.text(this.x, this.y - 50, this.playerName, {
      fontSize: '20px',
      fill: '#fff',
      align: 'center',
    }).setOrigin(0.5); // Center the text horizontally

    // Create a health bar above the player's head
    this.healthBar = this.scene.add.graphics();
    this.maxHealth = 100; // Define maximum health
    this.currentHealth = this.maxHealth; // Set initial health
    this.healthBarWidth = 50; // Set width of health bar
    this.updateHealthBar();
    this.anims.play('idle', true);
  }

  createAnimations() {
    // Check if animations already exist before creating them
    if (!this.scene.anims.exists('idle')) {
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers('humanWalk', { start: 1, end: 1 }),
            frameRate: 1,
            repeat: -1
        });
    }

    if (!this.scene.anims.exists('left')) {
        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('humanWalk', { start: 0, end: 7 }), 
            frameRate: 10,
            repeat: -1
        });
    }

    if (!this.scene.anims.exists('right')) {
        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('humanWalk', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    }

    if (!this.scene.anims.exists('up')) {
        this.scene.anims.create({
            key: 'up',
            frames: this.scene.anims.generateFrameNumbers('humanWalk', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    }

    if (!this.scene.anims.exists('down')) {
        this.scene.anims.create({
            key: 'down',
            frames: this.scene.anims.generateFrameNumbers('humanWalk', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    }
  }

  moveLeft() {
    this.setVelocityX(-this.movementSpeed);
    this.flipX = true; // Flip the sprite horizontally
    this.anims.play('right', true); // Play the 'right' animation, but flipped
  }

  moveRight() {
    this.setVelocityX(this.movementSpeed);
    this.flipX = false; // Ensure the sprite is not flipped
    this.anims.play('right', true);
  }

  moveUp() {
    this.setVelocityY(-this.movementSpeed);
    this.anims.play('up', true);
  }

  moveDown() {
    this.setVelocityY(this.movementSpeed);
    this.anims.play('down', true);
  }

  update() {
    let moving = false;
    this.setVelocity(0);

    // Update all cursor.left.isDown to this.keys.left.isDown etc.
    if (this.keys.left.isDown && this.keys.up.isDown) {
        this.setVelocityX(-this.movementSpeed);
        this.setVelocityY(-this.movementSpeed);
        this.anims.play('left', true);
        moving = true;
    } else if (this.keys.left.isDown && this.keys.down.isDown) {
        this.setVelocityX(-this.movementSpeed);
        this.setVelocityY(this.movementSpeed);
        this.anims.play('left', true);
        moving = true;
    } else if (this.keys.right.isDown && this.keys.up.isDown) {
        this.setVelocityX(this.movementSpeed);
        this.setVelocityY(-this.movementSpeed);
        this.anims.play('right', true);
        moving = true;
    } else if (this.keys.right.isDown && this.keys.down.isDown) {
        this.setVelocityX(this.movementSpeed);
        this.setVelocityY(this.movementSpeed);
        this.anims.play('right', true);
        moving = true;
    } else {
        if (this.keys.left.isDown) {
            this.moveLeft();
            moving = true;
        } else if (this.keys.right.isDown) {
            this.moveRight();
            moving = true;
        }
        if (this.keys.up.isDown) {
            this.moveUp();
            moving = true;
        } else if (this.keys.down.isDown) {
            this.moveDown();
            moving = true;
        }
    }

    // If no movement, stop the animation
    if (!moving) {
      this.anims.play('idle', true);
    }


    // Update the position of the name text
    this.nameText.setPosition(this.x, this.y - 70);

    // Update the position and size of the health bar
    this.updateHealthBar();
  }

  updateHealthBar() {
    this.healthBar.clear();
    const healthBarWidth = (this.currentHealth / this.maxHealth) * this.healthBarWidth;
    this.healthBar.fillStyle(0xff0000); // Red color for the background
    this.healthBar.fillRect(this.x - this.healthBarWidth / 2, this.y - 60, this.healthBarWidth, 10);
    this.healthBar.fillStyle(0x00ff00); // Green color for the current health
    this.healthBar.fillRect(this.x - this.healthBarWidth / 2, this.y - 60, healthBarWidth, 10);
  }

  takeDamage(amount) {
    this.currentHealth = Phaser.Math.Clamp(this.currentHealth - amount, 0, this.maxHealth);
    this.updateHealthBar();
  }

  heal(amount) {
    this.currentHealth = Phaser.Math.Clamp(this.currentHealth + amount, 0, this.maxHealth);
    this.updateHealthBar();
  }

  destroy() {
    // Clean up text and health bar before destroying the sprite
    if (this.nameText) {
        this.nameText.destroy();
    }
    if (this.healthBar) {
        this.healthBar.destroy();
    }
    if (this.healthBarBackground) {
        this.healthBarBackground.destroy();
    }
    // Call the parent class's destroy method
    super.destroy();
  }
}

export default Player;
