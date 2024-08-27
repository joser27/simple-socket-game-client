import Rectangle from './Rectangle';
import Config from './config';


class Player {
    constructor(context, socket, x = 0, y = 0, playerName) {
      this.c = context;
      this.socket = socket;
      this.playerName = playerName;
      this.speed = 5;
      this.hitBox = new Rectangle(x,y,300,300)
      this.keys = {};
      this.isMoving = false;

      //BorderOffset X
      this.xLvlOffset = 0,
      this.leftBorder = (0.5 * Config.CANVAS_WIDTH),
      this.rightBorder = (0.5 * Config.CANVAS_WIDTH),
    
      //BorderOffset Y
      this.yLvlOffset = 0,
      this.topBorder = (0.5 * Config.CANVAS_HEIGHT),
      this.bottomBorder = (0.5 * Config.CANVAS_HEIGHT),
    
  
      this.initializeControls();
    }
  
    initializeControls() {
        window.addEventListener("keydown", (e) => {
          this.keys[e.key] = true;
        });
      
        window.addEventListener("keyup", (e) => {
          this.keys[e.key] = false;
          
        });
      }
      
  
      update() {

        this.isMoving = false;
    
        if (this.keys["ArrowUp"] || this.keys["w"]) {
            this.hitBox.y -= this.speed;
            this.isMoving = true;
        }
        if (this.keys["ArrowDown"] || this.keys["s"]) {
            this.hitBox.y += this.speed;
            this.isMoving = true;
        }
        if (this.keys["ArrowLeft"] || this.keys["a"]) {
            this.hitBox.x -= this.speed;
            this.isMoving = true;
        }
        if (this.keys["ArrowRight"] || this.keys["d"]) {
            this.hitBox.x += this.speed;
            this.isMoving = true;
        }

        this.checkCloseToBorder();
    }
    

      render() {
        this.c.fillStyle = "green";
        this.c.fillRect(this.hitBox.x - this.xLvlOffset, this.hitBox.y - this.yLvlOffset, 100, 100);
        this.c.fillStyle = "white";
        this.c.font = "40px 'Comic Sans MS', sans-serif";
        this.c.fillText(this.playerName, this.hitBox.x - this.xLvlOffset, this.hitBox.y - this.yLvlOffset + 60);
      }
    

      checkCloseToBorder() {
        let playerX = this.hitBox.x;
        let diff = playerX - this.xLvlOffset;
    
        if (diff > this.rightBorder)
          this.xLvlOffset += diff - this.rightBorder;
        else if (diff < this.leftBorder)
          this.xLvlOffset += diff - this.leftBorder;
    
    
        //yLvlOffset
        let playerY = this.hitBox.y;
        let diffY = playerY - this.yLvlOffset;
    
        if (diffY > this.topBorder)
          this.yLvlOffset += diffY - this.topBorder;
        else if (diffY < this.bottomBorder)
          this.yLvlOffset += diffY - this.bottomBorder;
    
      }
      
  }
  
  export default Player;
  