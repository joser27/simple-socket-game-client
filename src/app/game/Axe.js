import Tool from './Tool';

class Axe extends Tool {
    constructor(scene, x, y) {
        super(scene, x, y, 'axe', 50, 50);
        this.setScale(3);
        this.refreshBody();
  
        // Adjust the hitbox size (smaller than the sprite)
        this.body.setSize(this.width * .3, this.height * .3);
        this.body.setOffset(this.width * .35, this.height * .5);
      }
  }
  export default Axe;