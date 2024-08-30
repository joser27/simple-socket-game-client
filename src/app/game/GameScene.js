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
    this.players = {};  // Store all players by ID
    this.collisionBlocks = []; // Array to keep track of collision blocks
    this.maxCollisionBlocks = 100; // Maximum number of collision blocks
  }

  preload() {
    this.load.image('background', '/assets/sunnymapv2.png');
    this.load.image('sky', '/assets/sky.png');
    this.load.image('ground', '/assets/platform.png');
    this.load.image('star', '/assets/star.png');
    this.load.image('bomb', '/assets/bomb.png');
    this.load.spritesheet('dude', '/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('humanWalk', '/assets/human/WALKING/base_walk_strip8.png', { frameWidth: 96, frameHeight: 64 });
  }

  create() {
    // Sky
    const map = this.add.image(0, 0, 'background').setOrigin(0, 0);
    map.setScale(1);
    
    // Set world bounds to match the map dimensions
    this.physics.world.setBounds(0, 0, map.displayWidth, map.displayHeight);
    
    // Additional setup like player, camera, etc.
    this.player = new Player(this.gameController.playerName, this, 100, 450, 'dude');
    
    this.physics.add.collider(this.player, this.platforms);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1);
    
    // STARS
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    this.stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    
    // Ensure the player is initialized before adding overlap detection
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    
    // Setup socket listeners first
    this.setupSocketListeners();
    
    // Request current players from the server right after setting up the player
    this.socket.emit('requestCurrentPlayers');

    const levelcollisionArray = levelCollisions;
    console.log(levelcollisionArray);
    
    // Convert the single array to a 2D array
    const rowLength = 64; // Adjust this value based on your level's width
    const levelcollision2DArray = this.convertTo2DArray(levelcollisionArray, rowLength);
    
    // Iterate through the levelcollision2DArray and add collision areas
    levelcollision2DArray.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === 2352) { // 2352 indicates a collision block
                const collisionArea = this.physics.add.staticImage(colIndex * PlayConfig.TILE_SIZE, rowIndex * PlayConfig.TILE_SIZE, 'collisionImageKey').setOrigin(0, 0);
                collisionArea.setScale(2); // Adjust the scale
                collisionArea.setVisible(false)
                collisionArea.body.setSize(collisionArea.displayWidth, collisionArea.displayHeight);
                collisionArea.body.setOffset(PlayConfig.TILE_SIZE/4, PlayConfig.TILE_SIZE/4);
                this.physics.add.collider(this.player, collisionArea, () => {
                    console.log('Player collided with the area!');
                });
            }
        });
    });

    // Place a random block every 10 seconds
    this.time.addEvent({
      delay: 10000,
      callback: this.placeRandomBlock,
      callbackScope: this,
      loop: true
    });
  }

  convertTo2DArray(array, rowLength) {
    const result = [];
    for (let i = 0; i < array.length; i += rowLength) {
        result.push(array.slice(i, i + rowLength));
    }
    return result;
  }

  collectStar(player, star) {
    star.disableBody(true, true);
  }

  update() {
    this.player.update(); // Call the update method of the player class

    // Emit player movement and animation state to the server
    this.socket.emit('playerMovement', {
      x: this.player.x,
      y: this.player.y,
      animation: this.player.anims.currentAnim,
    });
  }
  

  placeRandomBlock() {
    if (this.collisionBlocks.length >= this.maxCollisionBlocks) {
      return; // Do not place more than the maximum number of collision blocks
    }

    let randomRow, randomCol, collisionBlock;
    do {
      randomRow = Phaser.Math.Between(0, this.physics.world.bounds.height / PlayConfig.TILE_SIZE - 1);
      randomCol = Phaser.Math.Between(0, this.physics.world.bounds.width / PlayConfig.TILE_SIZE - 1);
    } while (this.player.x === randomCol * PlayConfig.TILE_SIZE && this.player.y === randomRow * PlayConfig.TILE_SIZE);

    collisionBlock = this.physics.add.staticImage(randomCol * PlayConfig.TILE_SIZE, randomRow * PlayConfig.TILE_SIZE, 'collisionImageKey').setOrigin(0, 0);
    collisionBlock.setScale(2); // Adjust the scale
    collisionBlock.setVisible(false);
    collisionBlock.body.setSize(collisionBlock.displayWidth, collisionBlock.displayHeight);
    collisionBlock.body.setOffset(PlayConfig.TILE_SIZE / 4, PlayConfig.TILE_SIZE / 4);
    this.physics.add.collider(this.player, collisionBlock, () => {
      console.log('Player collided with the random block!');
    });

    this.collisionBlocks.push(collisionBlock); // Keep track of the collision block
  }

  setupSocketListeners() {
    this.socket.on('currentPlayers', (players) => {
      this.updatePlayers(players);
    });

    this.socket.on('newPlayer', (playerInfo) => {
      this.addPlayer(playerInfo);
    });

    this.socket.on('playerMoved', (playerInfo) => {
      this.updatePlayerPosition(playerInfo);
    });

    this.socket.on('playerDisconnected', (playerId) => {
      this.removePlayer(playerId);
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
    const newPlayer = new Player(playerInfo.playerName, this, playerInfo.x, playerInfo.y, 'dude');
    this.players[playerInfo.id] = newPlayer;
    this.physics.add.collider(newPlayer, this.platforms);
    
    // Ensure the nameText is visible and correctly positioned
    this.players[playerInfo.id].nameText.setPosition(playerInfo.x, playerInfo.y - 70);
  }
  
  
  

  updatePlayerPosition(playerInfo) {
    if (this.players[playerInfo.id]) {
      const player = this.players[playerInfo.id];
      player.setPosition(playerInfo.x, playerInfo.y);
      player.anims.play(playerInfo.animation.key, true);
      
      // Update the position of the name text for the remote player
      player.nameText.setPosition(playerInfo.x, playerInfo.y - 70);
      
      // Update the position and size of the health bar
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
