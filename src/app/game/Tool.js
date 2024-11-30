import * as Phaser from 'phaser';

class Tool extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        
        // Common properties for all tools
        this.scene = scene;
        this.damage = 0;
        this.range = 0;
        this.cooldown = 0;
        this.lastUsed = 0;
        
        // Enable physics
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        
        // Set default tool state
        this.isActive = false;
        
        // Add reference to the player
        this.player = null;
        
        // Debug: Make hitbox visible
        this.debugGraphics = this.scene.add.graphics();
        this.debugGraphics.lineStyle(2, 0xff0000);
    }

    setPlayer(player) {
        this.player = player;
    }

    // Update position to follow player
    update() {
        if (this.player) {
            // Only update base position when not attacking
            if (!this.scene.input.activePointer.leftButtonDown()) {
                this.x = this.player.x;
                this.y = this.player.y;
            }
        }
    }

    // Abstract methods that child classes should implement
    use() {
        throw new Error('Tool subclass must implement use() method');
    }

    // Common method to check if tool can be used
    canUse() {
        const currentTime = Date.now();
        return currentTime - this.lastUsed >= this.cooldown;
    }

    // Modify checkOverlap to work with mouse position
    checkOverlap(hitableGroup) {
        if (this.scene.input.activePointer.leftButtonDown() && this.canUse()) {
            // Get mouse position in world coordinates
            const pointer = this.scene.input.activePointer;
            const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
            
            // Calculate direction to mouse
            const angle = Phaser.Math.Angle.Between(
                this.player.x, this.player.y,
                worldPoint.x, worldPoint.y
            );

            // Position the tool in front of the player in the direction of the mouse
            this.x = this.player.x + Math.cos(angle) * this.range;
            this.y = this.player.y + Math.sin(angle) * this.range;

            // Debug: Draw hitbox
            this.debugGraphics.clear();
            this.debugGraphics.strokeRect(this.x - this.body.width/2, this.y - this.body.height/2, 
                                        this.body.width, this.body.height);

            console.log('Tool position:', this.x, this.y);
            console.log('Checking for overlaps...');

            this.use();
            this.scene.physics.overlap(this, hitableGroup, (tool, target) => {
                console.log('Overlap detected!');
                this.onHit(tool, target);
            }, null, this);
            this.lastUsed = Date.now();
        }
    }

    // Default hit behavior
    onHit(tool, target) {
        if (target.takeDamage) {
            console.log(`${this.constructor.name} hit ${target.constructor.name}!`);
            target.takeDamage(this.damage);
        }
    }
}

export default Tool;
