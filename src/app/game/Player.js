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

    // Create cursor keys for movement
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.attackKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Spacebar for attacking

    // Initialize the hitbox
    this.hitbox = this.scene.add.rectangle(0, 0, 1, 1);
    this.scene.physics.world.enable(this.hitbox);
    this.hitbox.body.setAllowGravity(false);
    this.hitbox.body.setImmovable(true);
    this.hitbox.setActive(false).setVisible(false); // Set hitbox as inactive and invisible initially

    // Enable mouse input
    this.scene.input.on('pointerdown', (pointer) => this.activateHitbox(pointer));
    this.scene.input.on('pointerup', () => this.deactivateHitbox());

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
    // this.sword = new Sword(this.scene, this.x, this.y);
    // this.sword.setVisible(false)
    // this.axe = new Sword(this.scene, this.x, this.y);
    // this.axe.setVisible(false)
    // this.pickaxe = new Sword(this.scene, this.x, this.y);
    // this.pickaxe.setVisible(false)
        // Initialize tools
    this.handTools = {
      sword: new Sword(this.scene, this.x, this.y),
      axe: new Axe(this.scene, this.x, this.y),
      pickaxe: new Pickaxe(this.scene, this.x, this.y)
    };
    this.currentTool = this.handTools.sword;
    Object.values(this.handTools).forEach(tool => {
      tool.setVisible(false);
    });
    this.scene.input.keyboard.on('keydown-ONE', () => this.switchTool('sword'));
    this.scene.input.keyboard.on('keydown-TWO', () => this.switchTool('axe'));
    this.scene.input.keyboard.on('keydown-THREE', () => this.switchTool('pickaxe'));
  }

  createAnimations() {
    this.scene.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNumbers('humanWalk', { start: 1, end: 1 }),
      frameRate: 1,
      repeat: -1
    });

    this.scene.anims.create({
      key: 'left',
      frames: this.scene.anims.generateFrameNumbers('humanWalk', { start: 0, end: 7 }), 
      frameRate: 10,
      repeat: -1
    });
  
    this.scene.anims.create({
      key: 'right',
      frames: this.scene.anims.generateFrameNumbers('humanWalk', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
  
    this.scene.anims.create({
      key: 'up',
      frames: this.scene.anims.generateFrameNumbers('humanWalk', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
  
    this.scene.anims.create({
      key: 'down',
      frames: this.scene.anims.generateFrameNumbers('humanWalk', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
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
    let moving = false; // Flag to track if the player is moving
  
    // Reset player velocity to stop the movement when no keys are pressed
    this.setVelocity(0);
  
    // Diagonal movement
    if (this.cursors.left.isDown && this.cursors.up.isDown) {
      this.setVelocityX(-this.movementSpeed);
      this.setVelocityY(-this.movementSpeed);
      this.anims.play('left', true);
      moving = true;
    } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
      this.setVelocityX(-this.movementSpeed);
      this.setVelocityY(this.movementSpeed);
      this.anims.play('left', true);
      moving = true;
    } else if (this.cursors.right.isDown && this.cursors.up.isDown) {
      this.setVelocityX(this.movementSpeed);
      this.setVelocityY(-this.movementSpeed);
      this.anims.play('right', true);
      moving = true;
    } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
      this.setVelocityX(this.movementSpeed);
      this.setVelocityY(this.movementSpeed);
      this.anims.play('right', true);
      moving = true;
    } else {
      // Horizontal movement
      if (this.cursors.left.isDown) {
        this.moveLeft();
        moving = true;
      } else if (this.cursors.right.isDown) {
        this.moveRight();
        moving = true;
      }
  
      // Vertical movement
      if (this.cursors.up.isDown) {
        this.moveUp();
        moving = true;
      } else if (this.cursors.down.isDown) {
        this.moveDown();
        moving = true;
      }
    }
  
    // If no movement, stop the animation
    if (!moving) {
      this.anims.play('idle', true);
    }

    // Update the hitbox position if it exists
    if (this.hitbox.active) {

      const pointer = this.scene.input.activePointer;
      this.updateHitboxPosition(pointer);
    }

    // Update the position of the name text
    this.nameText.setPosition(this.x, this.y - 70);

    // Update the position and size of the health bar
    this.updateHealthBar();
  }

  activateHitbox(pointer) {
    this.hitbox.setActive(true).setVisible(true);
    this.updateHitboxPosition(pointer);
    // Object.values(this.handTools).forEach(tool => {
    //   tool.setVisible(true);
    // });
    this.currentTool.setVisible(true);
  }

  updateHitboxPosition(pointer) {
    // Calculate the direction from the player to the pointer
    const direction = new Phaser.Math.Vector2(pointer.worldX - this.x, pointer.worldY - this.y).normalize();

    // Set the hitbox position to be in front of the player
    const hitboxDistance = 50; // Distance from the player
    this.hitbox.setPosition(this.x + direction.x * hitboxDistance, this.y + direction.y * hitboxDistance);
    // Object.values(this.handTools).forEach(tool => {
    //   tool.setPosition(this.hitbox.x,this.hitbox.y)
    // });
    this.currentTool.setPosition(this.hitbox.x,this.hitbox.y)
  }
  switchTool(toolName) {
    switch(toolName) {
      case 'sword':
        this.currentTool = this.handTools.sword;
        break;
      case 'axe':
        this.currentTool = this.handTools.axe;
        break;
      case 'pickaxe':
        this.currentTool = this.handTools.pickaxe;
        break;
      default:
        // code block
    }
  }

  deactivateHitbox() {
    this.hitbox.setActive(false).setVisible(false);
    Object.values(this.handTools).forEach(tool => {
      tool.setVisible(false);
    });
  }

  updateHealthBar() {
    // Clear the previous health bar
    this.healthBar.clear();
  
    // Calculate the width of the health bar based on current health
    const healthBarWidth = (this.currentHealth / this.maxHealth) * this.healthBarWidth;
  
    // Draw the health bar background
    this.healthBar.fillStyle(0xff0000); // Red color for the background
    this.healthBar.fillRect(this.x - this.healthBarWidth / 2, this.y - 60, this.healthBarWidth, 10);
  
    // Draw the current health
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
}

export default Player;
