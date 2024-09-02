import Tool from './Tool';

class Sword extends Tool {
    constructor(scene, x, y) {
      super(scene, x, y, 'sword', 50, 50); // Example hitbox size for sword
      this.setScale(3);
      this.refreshBody();

      // Adjust the hitbox size (smaller than the sprite)
      this.body.setSize(this.width * .3, this.height * .3);
      this.body.setOffset(this.width * .35, this.height * .5);
    }
  }

  export default Sword;
  