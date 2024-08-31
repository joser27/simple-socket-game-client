import * as Phaser from 'phaser';
import Player from './Player';
import PlayConfig from './PlayConfig';
import levelCollisions from './Level';

class GameScene extends Phaser.Scene {
    constructor(gameController, socket) {
        super({ key: 'GameScene' });
        this.socket = socket;
        this.gameController = gameController;
        this.player = null;
        this.players = {}; // Store all players by ID
        this.trees = null; // Group to store trees
        this.treeOverlapTimers = new Map(); // Map to store timers for each tree
        this.hitAble = [];
    }

    preload() {
        this.loadAssets();
    }

    create() {
        this.createBackground();
        this.createPlayer();
        // Crop the sprite sheet to create a new texture for the first tree image
        this.textures.addSpriteSheetFromAtlas('tree_cropped', {
            atlas: 'tree',  // Original sprite sheet key
            frame: 1,       // Frame index to use
            frameWidth: 32, // Width of one frame
            frameHeight: 34 // Height of one frame
        });
        this.createTrees();
        this.setupSocketListeners();
        this.requestCurrentPlayers();
        this.createCollisionAreas();

        // Add collision detection between player hitbox and trees
        this.physics.add.collider(this.player, this.trees);
        // Add players and trees to the hitAble list
        this.hitAble.push(this.players);
        this.hitAble.push(this.trees);
    }

    update() {
        this.updatePlayer();
        this.emitPlayerMovement();
        this.adjustDepth();

        // Iterate over the hitAble array
        if (this.player.hitbox.active) {
          this.hitAble.forEach((hitableGroup) => {
            if (hitableGroup instanceof Phaser.GameObjects.Group) {
                hitableGroup.children.iterate((hitable) => {
                    // Example interaction logic
                    if (this.player.hitbox.active && this.physics.overlap(this.player.hitbox, hitable)) {
                        // Perform action
                        console.log('Overlapping with', hitable.texture.key);
                    }
                });
            } else {
                for (const id in hitableGroup) {
                    const hitable = hitableGroup[id];
                    if (this.player.hitbox.active && this.physics.overlap(this.player.hitbox, hitable)) {
                        // Perform action
                        console.log('Overlapping with', hitable.playerName || hitable.texture.key);
                        hitable.takeDamage();
                    }
                }
            }
        });
        }
    }

    loadAssets() {
        this.load.image('background', '/assets/sunnymapv2.png');
        this.load.image('tree', '/assets/plants/spr_deco_tree_01_strip4.png');
        this.load.image('ground', '/assets/platform.png');
        this.load.spritesheet('dude', '/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('humanWalk', '/assets/human/WALKING/base_walk_strip8.png', { frameWidth: 96, frameHeight: 64 });
    }

    createBackground() {
        const map = this.add.image(0, 0, 'background').setOrigin(0, 0);
        map.setScale(1);
        this.physics.world.setBounds(0, 0, map.displayWidth, map.displayHeight);
    }

    createPlayer() {
        this.player = new Player(this.gameController.playerName, this, 100, 450, 'humanWalk');
        this.physics.add.collider(this.player, this.platforms);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);
    }

    createTrees() {
        this.trees = this.physics.add.staticGroup({
            key: 'tree_cropped',
            repeat: 10, // Number of trees
            setXY: { x: 100, y: 100, stepX: 150, stepY: 100 }
        });

        this.trees.children.iterate((tree) => {
            tree.setScale(4); // Scale the tree to 4 times its original size
            tree.refreshBody(); // Refresh the body to apply the new scale

            // Adjust the hitbox size (smaller than the sprite)
            tree.body.setSize(tree.width * 1, tree.height * 1); // Example: 80% of the sprite size
            tree.body.setOffset(tree.width * 1.5, tree.height * 2); // Center the smaller hitbox
        });
    }

    setupSocketListeners() {
        this.socket.on('currentPlayers', (players) => this.updatePlayers(players));
        this.socket.on('newPlayer', (playerInfo) => this.addPlayer(playerInfo));
        this.socket.on('playerMoved', (playerInfo) => this.updatePlayerPosition(playerInfo));
        this.socket.on('playerDisconnected', (playerId) => this.removePlayer(playerId));
    }

    requestCurrentPlayers() {
        this.socket.emit('requestCurrentPlayers');
    }

    createCollisionAreas() {
        const levelcollisionArray = levelCollisions;
        const rowLength = 64; // Adjust this value based on level's width
        const levelcollision2DArray = this.convertTo2DArray(levelcollisionArray, rowLength);
        levelcollision2DArray.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 2352) { // 2352 indicates a collision block
                    const collisionArea = this.physics.add.staticImage(colIndex * PlayConfig.TILE_SIZE, rowIndex * PlayConfig.TILE_SIZE, 'collisionImageKey').setOrigin(0, 0);
                    collisionArea.setScale(2); // Adjust the scale
                    collisionArea.setVisible(false);
                    collisionArea.body.setSize(collisionArea.displayWidth, collisionArea.displayHeight);
                    collisionArea.body.setOffset(PlayConfig.TILE_SIZE / 4, PlayConfig.TILE_SIZE / 4);
                    this.physics.add.collider(this.player, collisionArea, () => {
                        console.log('Player collided with the area!');
                    });
                }
            });
        });
    }

    convertTo2DArray(array, rowLength) {
        const result = [];
        for (let i = 0; array.length > i; i += rowLength) {
            result.push(array.slice(i, i + rowLength));
        }
        return result;
    }

    updatePlayer() {
        this.player.update();
    }

    emitPlayerMovement() {
        this.socket.emit('playerMovement', {
            x: this.player.x,
            y: this.player.y,
            animation: this.player.anims.currentAnim,
            flipX: this.player.flipX, // Include the flipX state
            name: this.player.playerName // Include the player name
        });
    }

    adjustDepth() {
        this.player.setDepth(this.player.y);

        for (const id in this.players) {
            this.players[id].setDepth(this.players[id].y);
        }

        this.trees.children.iterate((tree) => {
            tree.setDepth(tree.y);
        });
    }

    updatePlayers(players) {
        for (const id in players) {
            if (id !== this.socket.id) {  // Ensure not to add the main player again
                this.addPlayer(players[id]);
            }
        }
    }

    addPlayer(playerInfo) {
        const newPlayer = new Player(playerInfo.name, this, playerInfo.x, playerInfo.y, 'humanWalk');
        this.players[playerInfo.id] = newPlayer;
        newPlayer.nameText.setText(playerInfo.name);  // Set the player's name
        newPlayer.nameText.setPosition(playerInfo.x, playerInfo.y - 70);
    }

    updatePlayerPosition(playerInfo) {
        if (this.players[playerInfo.id]) {
            const player = this.players[playerInfo.id];
            player.setPosition(playerInfo.x, playerInfo.y);
            player.anims.play(playerInfo.animation.key, true);
            player.flipX = playerInfo.flipX; // Apply the flipX state
            player.nameText.setText(playerInfo.name);  // Update the name
            player.nameText.setPosition(playerInfo.x, playerInfo.y - 70);
            player.updateHealthBar();
        }
    }

    removePlayer(playerId) {
        if (this.players[playerId]) {
            this.players[playerId].destroy();
            delete this.players[playerId];
        }
    }
}

export default GameScene;
