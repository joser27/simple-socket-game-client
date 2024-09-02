class Tool extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, hitboxWidth, hitboxHeight, animationKey) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.hitboxWidth = hitboxWidth;
    this.hitboxHeight = hitboxHeight;
    this.isSwinging = false; // Track if the tool is currently swinging
    this.animationKey = animationKey; // Unique animation key for each tool

    // Enable physics for the tool
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    // Initialize the hitbox
    this.hitbox = this.scene.add.rectangle(0, 0, this.hitboxWidth, this.hitboxHeight);
    this.scene.physics.world.enable(this.hitbox);
    this.hitbox.body.setAllowGravity(false);
    this.hitbox.body.setImmovable(true);
    this.hitbox.setActive(false).setVisible(false); // Set hitbox as inactive and invisible initially

    // Define the swing animation
    this.scene.anims.create({
      key: this.animationKey,
      frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 11 }), // Adjust frame numbers as needed
      frameRate: 10,
      repeat: 0
    });
    this.setDepth(20)
  }

  swing(player, pointer) {
    console.log("SWING " + this.animationKey.toUpperCase());
    if (!this.isSwinging) {
      this.isSwinging = true;
      this.activateHitbox(pointer);

      // Flip the tool based on its position relative to the player
      if (this.x < player.x) {
        this.flipX = true; // Flip the tool if it's on the left side of the player
      } else {
        this.flipX = false; // Do not flip the tool if it's on the right side of the player
      }

      this.play(this.animationKey, true);
      this.on('animationcomplete', () => {
        this.deactivateHitbox();
        this.isSwinging = false;
      }, this);
    }
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
    this.setFrame(0); // Set to the first frame
    this.hitbox.setActive(false).setVisible(false);
  }
}

export default Tool;
