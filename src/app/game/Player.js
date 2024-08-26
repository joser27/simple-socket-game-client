class Player {
    constructor(context, x = 0, y = 0) {
      this.c = context;
      this.x = x;
      this.y = y;
      this.speed = 5;
  
      this.keys = {};
  
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
        if (this.keys["ArrowUp"] || this.keys["w"]) {
          this.y -= this.speed;
        }
        if (this.keys["ArrowDown"] || this.keys["s"]) {
          this.y += this.speed;
        }
        if (this.keys["ArrowLeft"] || this.keys["a"]) {
          this.x -= this.speed;
        }
        if (this.keys["ArrowRight"] || this.keys["d"]) {
          this.x += this.speed;
        }
      
        // Ensure the player stays within the canvas bounds
        this.x = Math.max(0, Math.min(this.c.canvas.width - 100, this.x));
        this.y = Math.max(0, Math.min(this.c.canvas.height - 100, this.y));
      }
      
      
  
      render() {
        this.c.fillStyle = "green";
        this.c.fillRect(this.x, this.y, 100, 100);
      }
      
  }
  
  export default Player;
  