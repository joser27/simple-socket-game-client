import GameScene from './GameScene';
import PlayConfig from './PlayConfig';

class GameController {
  constructor(socket, playerName) {
    this.socket = socket;
    this.playerName = playerName;

    this.config = {
      type: Phaser.AUTO,
      width: PlayConfig.CANVAS_WIDTH,
      height: PlayConfig.CANVAS_HEIGHT,
      parent: 'phaser-game',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: true,
          fps: 60,
        }
      },
      render: {
        pixelArt: true 
      },
      scene: new GameScene(this, this.socket),
    };

    this.game = new Phaser.Game(this.config);
  }

  setupSocketListeners(scene) {
    const events = ['currentPlayers', 'newPlayer', 'playerMoved', 'playerDisconnected'];
    events.forEach(event => {
      this.socket.on(event, (data) => {
        scene.handleSocketEvent(event, data);
      });
    });
  }
}

export default GameController;
