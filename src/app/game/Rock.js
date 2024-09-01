import HitableObject from './HitableObject';

class Rock extends HitableObject {
    constructor(scene, x, y) {
        super(scene, x, y, 'stone_rock_cropped');
        this.setScale(2);
        this.refreshBody();
    }

    takeDamage(amount = 5) {
        super.takeDamage(amount);
        // Additional logic specific to Rock
        console.log('Rock-specific damage logic');
    }
}

export default Rock;
