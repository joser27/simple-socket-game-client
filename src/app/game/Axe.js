import Tool from './Tool';

class Axe extends Tool {
  constructor(scene, x, y) {
    super(scene, x, y, 'axe', 50, 50, 'axeSwing'); // Unique animation key for axe
    this.setScale(3);
    this.refreshBody();

    // Adjust the hitbox size (smaller than the sprite)
    this.body.setSize(this.width * .3, this.height * .3);
    this.body.setOffset(this.width * .35, this.height * .5);
  }

  swing(pointer, player) {
    console.log("SWING AXE");
    if (!this.isSwinging) {
      this.isSwinging = true;
      this.activateHitbox(pointer);

      // Flip the tool based on its position relative to the player
      if (this.x < player.x) {
        this.flipX = true; // Flip the tool if it's on the left side of the player
      } else {
        this.flipX = false; // Do not flip the tool if it's on the right side of the player
      }

      // Check if the tool is below the player
      if (this.y > player.y) {
        this.setAngle(180); // Rotate the tool if it's below the player
      } else {
        this.setAngle(0); // Reset the rotation if it's not below the player
      }

      this.play('axeSwing', true);

      this.on('animationcomplete', () => {
        this.deactivateHitbox();
        this.isSwinging = false;
      }, this);
    }
  }
}

export default Axe;
