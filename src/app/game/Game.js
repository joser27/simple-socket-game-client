import Player from "./Player";

class Game {
    constructor(context) {
      this.c = context;
      this.players = {}; // Store all players by ID
      this.player = null; // Initialize without a local player
    }
  
    update() {
      if (this.player) {
        this.player.update();
      }
    }
  
    render() {
      this.c.clearRect(0, 0, this.c.canvas.width, this.c.canvas.height);
  
      if (this.player) {
        this.player.render();
      }
  
      for (const id in this.players) {
        if (id !== this.player?.id) {
          this.players[id].render();
        }
      }
    }
  
    clearPlayers() {
      this.players = {};
      this.player = null;
    }
  
    updatePlayers(players) {
      this.players = {};
      for (const id in players) {
        if (id === this.player?.id) {
          continue;
        }
        this.players[id] = new Player(this.c, players[id].x, players[id].y);
      }
    }
  
    addPlayer(playerInfo) {
        if (playerInfo.id === this.player?.id || !this.player) {
          // Initialize the local player if it doesn't exist
          this.player = new Player(this.c, playerInfo.x, playerInfo.y);
          this.player.id = playerInfo.id;
        } else {
          // Add remote player
          this.players[playerInfo.id] = new Player(this.c, playerInfo.x, playerInfo.y);
        }
      }
      
  
    updatePlayerPosition(playerInfo) {
      if (this.players[playerInfo.id]) {
        this.players[playerInfo.id].x = playerInfo.x;
        this.players[playerInfo.id].y = playerInfo.y;
      }
    }
  
    removePlayer(playerId) {
      delete this.players[playerId];
    }
  }
  
  export default Game;
  