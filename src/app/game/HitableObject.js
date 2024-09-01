import * as Phaser from 'phaser';

class HitableObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        // Set the object as immovable so it won't move when collided with
        this.body.setImmovable(true);
        this.hp = 100; // Default health
    }

    takeDamage(amount = 10) {
        this.hp -= amount;
        console.log(`${this.texture.key} took ${amount} damage! Remaining HP: ${this.hp}`);
        if (this.hp <= 0) {
            this.destroy();
            console.log(`${this.texture.key} destroyed!`);
        }
    }

    playAudio() {
        console.log(`${this.texture.key} sound effect played.`);
        // You can add audio play logic here if needed.
    }
}

export default HitableObject;
