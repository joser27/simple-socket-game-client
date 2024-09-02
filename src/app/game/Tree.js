import HitableObject from './HitableObject';

class Tree extends HitableObject {
    constructor(scene, x, y) {
        super(scene, x, y, 'tree_cropped');
        
        this.setScale(4);
        this.refreshBody();
        scene.physics.add.existing(this, true); // 'true' makes it a static body
        // Adjust the hitbox size (smaller than the sprite)
        this.body.setSize(this.width * 0.3, this.height * 0.3);
        this.body.setOffset(this.width * 0.35, this.height * 0.5);
    }

    // Optionally override or extend methods
    takeDamage(amount = 15) {
        super.takeDamage(amount);
        // Additional logic specific to Tree
        console.log('Tree-specific damage logic');
    }
}

export default Tree;
