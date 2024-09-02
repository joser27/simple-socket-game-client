import * as Phaser from 'phaser';
import Player from './Player';
import PlayConfig from './PlayConfig';
import levelCollisions from './Level';
import Tree from './Tree';
import Rock from './Rock';

class GameScene extends Phaser.Scene {
    constructor(gameController, socket) {
        super({ key: 'GameScene' });
        this.socket = socket;
        this.gameController = gameController;
        this.player = null;
        this.players = {}; // Store all players by ID
        this.hitAbleGroup = []; // Initialize hitAbleGroup
    }

    preload() {
        this.loadAssets();
    }

    create() {
        this.createBackground();
        this.createPlayer();

        this.textures.addSpriteSheetFromAtlas('tree_cropped', {
            atlas: 'tree',  // Original sprite sheet key
            frame: 1,       // Frame index to use
            frameWidth: 32, // Width of one frame
            frameHeight: 34 // Height of one frame
        });
        this.textures.addSpriteSheetFromAtlas('stone_rock_cropped', {
            atlas: 'rock',  // Original sprite sheet key
            frame: 1,       // Frame index to use
            frameWidth: 32, // Width of one frame
            frameHeight: 32 // Height of one frame
        });
        this.textures.addSpriteSheetFromAtlas('sword_cropped', {
            atlas: 'sword',  // Original sprite sheet key
            frame: 1,       // Frame index to use
            frameWidth: 80, // Width of one frame
            frameHeight: 64 // Height of one frame
        });

        this.createHitables();

        this.setupSocketListeners();
        this.requestCurrentPlayers();
        this.createCollisionAreas();

        // Add overlap between the player and hitAbleGroup objects
        this.physics.add.collider(this.player, this.hitAbleGroup);
    }

    update() {
        this.updatePlayer();
        this.emitPlayerMovement();
        this.adjustDepth();
    }

    createHitables() {
        // Create a group for hitAble objects
        // this.hitAbleGroup = this.physics.add.staticGroup();

        // Create Trees
        for (let i = 0; i < 10; i++) {
            const tree = new Tree(this, 100 + i * 150, 100 + i * 100);
            this.hitAbleGroup.push(tree);
        }

        // Create Rocks
        for (let i = 0; i < 5; i++) {
            const rock = new Rock(this, 200 + i * 200, 200 + i * 200);
            this.hitAbleGroup.push(rock);
        }
    }

    loadAssets() {
        this.load.image('background', '/assets/sunnymapv2.png');
        this.load.image('tree', '/assets/plants/spr_deco_tree_01_strip4.png');
        this.load.image('rock', '/assets/rocks/stone_rock.png');
        this.load.spritesheet('axe', '/assets/handtools/tools_axe_strip10.png',{ frameWidth: 96, frameHeight: 64 });
        this.load.spritesheet('pickaxe', '/assets/handtools/tools_mining_strip10.png',{ frameWidth: 96, frameHeight: 64 });
        this.load.spritesheet('sword', '/assets/handtools/tools_attack_strip10.png', { frameWidth: 96, frameHeight: 64 });
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
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);
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
        // Combine player and hitAbleGroup objects into a single array
        const allObjects = [this.player, ...this.hitAbleGroup];
    
        // Sort the array by the y-coordinate to set depth correctly
        allObjects.sort((a, b) => a.y - b.y);
    
        // Set depth for each object based on its position in the sorted array
        allObjects.forEach((obj, index) => {
            obj.setDepth(index);
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

    handleOverlap(player, hitableObject) {
        console.log('Player overlapped with:', hitableObject);
    }
}

export default GameScene;
