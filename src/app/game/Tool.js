class Tool extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, animationKey) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.isSwinging = false; // Track if the tool is currently swinging
    this.hasHitTarget = false; // Track if the tool has hit a target during the current swing
    this.animationKey = animationKey; // Unique animation key for each tool

    // Enable physics for the tool
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.setScale(3);
    this.refreshBody();
    // Adjust the hitbox size (smaller than the sprite)
    this.body.setSize(this.width * .2, this.height * .2);
    this.body.setOffset(this.width * .35, this.height * .3);
    // Define the swing animation
    this.scene.anims.create({
      key: this.animationKey,
      frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: 10 }), // Adjust frame numbers as needed
      frameRate: 10,
      repeat: 0
    });
    this.setDepth(20);
  }

  swing(player, pointer) {
    console.log("SWING " + this.animationKey.toUpperCase());
    if (!this.isSwinging) {
      this.isSwinging = true;
      this.hasHitTarget = false; // Reset the hit flag at the start of the swing
      // Flip the tool based on its position relative to the player
      if (this.x < player.x) {
        this.flipX = true; // Flip the tool if it's on the left side of the player
      } else {
        this.flipX = false; // Do not flip the tool if it's on the right side of the player
      }
      this.play(this.animationKey, true);
      this.on('animationcomplete', () => {
        this.isSwinging = false;
      }, this);
    }
  }

  checkOverlap(hitables) {
    if (this.isSwinging && !this.hasHitTarget) {
      hitables.forEach(hitable => {
        if (this.scene.physics.world.overlap(this, hitable)) {
          this.handleOverlap(this, hitable);
        }
      });
    }
  }

  handleOverlap(tool, hitable) {
    if (this.isSwinging && !this.hasHitTarget) {
      hitable.takeDamage();
      hitable.playAudio();
      this.hasHitTarget = true; // Set the hit flag to true after hitting a target
    }
  }
}

export default Tool;
