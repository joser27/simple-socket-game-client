class Tool extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, hitboxWidth, hitboxHeight) {
      super(scene, x, y, texture);
      this.scene = scene;
      this.hitboxWidth = hitboxWidth;
      this.hitboxHeight = hitboxHeight;
  
      // Enable physics for the tool
      this.scene.physics.world.enable(this);
      this.scene.add.existing(this);
  
      // Initialize the hitbox
      this.hitbox = this.scene.add.rectangle(0, 0, this.hitboxWidth, this.hitboxHeight);
      this.scene.physics.world.enable(this.hitbox);
      this.hitbox.body.setAllowGravity(false);
      this.hitbox.body.setImmovable(true);
      this.hitbox.setActive(false).setVisible(false); // Set hitbox as inactive and invisible initially
    }
  
    activateHitbox(pointer) {
      this.hitbox.setActive(true).setVisible(true);
      this.updateHitboxPosition(pointer);
    }
  
    updateHitboxPosition(player, pointer) {
        if (pointer) {
          // Calculate the direction from the player to the pointer
          const direction = new Phaser.Math.Vector2(pointer.worldX - player.x, pointer.worldY - player.y).normalize();
      
          // Set the hitbox position to be in front of the tool
          const hitboxDistance = 50; // Distance from the tool
          this.hitbox.setPosition(player.x + direction.x * hitboxDistance, player.y + direction.y * hitboxDistance);
        }
      }
      
  
    deactivateHitbox() {
      this.hitbox.setActive(false).setVisible(false);
    }
  }
  
  export default Tool;
  