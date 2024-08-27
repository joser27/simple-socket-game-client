// GameMap.js
import Config from './config';

class GameMap {
    constructor(context, player) {
        this.c = context;
        this.player = player;
        this.dungeon = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
        ];
    }

    update() {
        // Logic for updating the map or any related game mechanics
    }

    render() {
        const tileSize = Config.TILE_SIZE;
        for (let row = 0; row < this.dungeon.length; row++) {
            for (let col = 0; col < this.dungeon[row].length; col++) {
                const tile = this.dungeon[row][col];
    
                // Set fill color based on tile type
                this.c.fillStyle = tile === 1 ? 'grey' : 'red';
    
                // Draw the tile as a rectangle on the canvas
                this.c.fillRect(
                    col * tileSize - this.player.xLvlOffset,
                    row * tileSize - this.player.yLvlOffset,
                    tileSize,
                    tileSize
                );
            }
        }
    }
    
}

export default GameMap;
