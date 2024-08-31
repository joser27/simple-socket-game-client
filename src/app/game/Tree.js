// import PlayConfig from './PlayConfig';

// class Tree {
//     constructor(scene, x, y, texture = 'tree') {
//         this.scene = scene;
//         this.tree = scene.staticTrees.create(x, y, texture);
//         this.tree.setOrigin(0, 0);
//         this.tree.setScale(3);
//         this.tree.body.setSize(this.tree.displayWidth/4, this.tree.displayHeight);
//         this.tree.body.setOffset(0,0);
//     }

//     static spawnRandomTree(scene) {
//         console.log("TREE SPAWNING")
//         const randomRow = Phaser.Math.Between(0, scene.physics.world.bounds.height / PlayConfig.TILE_SIZE - 1);
//         const randomCol = Phaser.Math.Between(0, scene.physics.world.bounds.width / PlayConfig.TILE_SIZE - 1);
//         return new Tree(scene, randomCol * PlayConfig.TILE_SIZE, randomRow * PlayConfig.TILE_SIZE);
//     }
// }

// export default Tree;
