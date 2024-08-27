import Game from "./Game";

class GameController {
    constructor(context, socket, playerName) {
      this.c = context;
      this.socket = socket;
      this.game = new Game(this.c, this.socket, playerName);
  
      // Setup socket listeners
      this.setupSocketListeners();
  
      // Handle reconnection
      this.socket.on('connect', () => {
        console.log('Reconnected to the server.');
        this.handleReconnection();
      });
    }
  
    setupSocketListeners() {
      // Listen for other players' data from the server
      this.socket.on('currentPlayers', (players) => {
        this.game.updatePlayers(players);
      });
  
      this.socket.on('newPlayer', (playerInfo) => {
        
        this.game.addPlayer(playerInfo);
      });
  
      this.socket.on('playerMoved', (playerInfo) => {
        this.game.updatePlayerPosition(playerInfo);
      });
  
      this.socket.on('playerDisconnected', (playerId) => {
        this.game.removePlayer(playerId);
      });
    }
  
    handleReconnection() {
        // On reconnection, clear local player and all remote players
        this.game.clearPlayers();
      
        // Emit an event to the server to create a new player
        this.socket.emit('createPlayer');
      
        // Listen for the server response to create the player
        this.socket.on('playerCreated', (playerInfo) => {
          // Initialize the local player
          this.game.addPlayer(playerInfo);
        });
      }
      
  
    update() {
        // Game update logic
        this.game.update();
      }
      
  
    render() {
      // Rendering logic
      this.game.render();
    }
  }
  
  export default GameController;
  