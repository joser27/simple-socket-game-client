import Tool from './Tool';

class Fist extends Tool {
    constructor(scene, x, y) {
        super(scene, x, y, 'fist');
        
        this.damage = 10;
        this.range = 50;
        this.cooldown = 500;
        
        this.body.setSize(32, 32);
        this.setAlpha(0.5);
    }

    use() {
        this.setAlpha(1);
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.setAlpha(0);
            }
        });
    }

    onHit(tool, target) {
        if (target.takeDamage) {
            target.takeDamage(this.damage);
            if (target.playAudio) {
                target.playAudio();
            }
        }
    }
}

export default Fist;
