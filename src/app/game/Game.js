// import Player from "./Player";
// import GameMap from "./GameMap";

// class Game {
//     constructor(context, socket, playerName) {
//       this.c = context;
//       this.socket = socket;
//       this.playerName = playerName;
//       this.players = {}; // Store all players by ID
//       this.player = null; // Initialize without a local player
//       this.gameMap = null;
//     }
  
//     update() {
//       if (this.player) {
//         this.player.update();
//               // Emit the movement data, including offsets
//       this.socket.emit('playerMovement', {
//         x: this.player.hitBox.x,
//         y: this.player.hitBox.y,
//     });
//       }


//     }
  

  
  
  
//     clearPlayers() {
//       this.players = {};
//       this.player = null;
//     }
  
//     updatePlayers(players) {
//       this.players = {};
//       for (const id in players) {
//         if (id === this.player?.id) {
//           continue;
//         }
//         this.players[id] = new Player(this.c, this.socket, players[id].x, players[id].y, players[id].name);
//       }
//     }
  
//     addPlayer(playerInfo) {
//       if (playerInfo.id === this.player?.id || !this.player) {
//         this.player = new Player(this.c, this.socket, playerInfo.x, playerInfo.y, playerInfo.name);
//         this.player.id = playerInfo.id;
//         this.gameMap = new GameMap(this.c, this.player);
//       } else {
//         this.players[playerInfo.id] = new Player(this.c, this.socket, playerInfo.x, playerInfo.y, playerInfo.name);
//       }
//     }
    

//     updatePlayerPosition(playerInfo) {
//       if (this.players[playerInfo.id]) {
//         this.players[playerInfo.id].hitBox.x = playerInfo.x;
//         this.players[playerInfo.id].hitBox.y = playerInfo.y;
//       }
//     }
    

    
  
//     removePlayer(playerId) {
//       delete this.players[playerId];
//     }
//   }
  
//   export default Game;
  