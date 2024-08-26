class GameEngine {
  constructor(context, gameController) {
    this.context = context;
    this.gameController = gameController;
    this.desiredFPS = 60;
    this.previousFrameTime = 0;
    this.timeAccumulator = 0;
    this.frameTime = 1000 / this.desiredFPS;
    this.animationFrameId = null;
    this.updates = 0;
    this.frames = 0;
    this.previousFPSTime = performance.now();
  }

  start() {
    this.animationFrameId = window.requestAnimationFrame(this.gameLoop.bind(this));
  }

  stop() {
    window.cancelAnimationFrame(this.animationFrameId);
  }

  gameLoop(currentTime) {
    this.animationFrameId = window.requestAnimationFrame(this.gameLoop.bind(this));

    let deltaTime = currentTime - this.previousFrameTime;
    this.previousFrameTime = currentTime;
    this.timeAccumulator += deltaTime;

    // Cap the maximum accumulated time to prevent spiral of death
    if (this.timeAccumulator > 1000) {
      this.timeAccumulator = 1000;
    }

    while (this.timeAccumulator >= this.frameTime) {

      this.update(); // Update game logic
      this.timeAccumulator -= this.frameTime;
      this.updates++; // Increment updates counter
    }


    this.render(); // Render the game
    this.frames++; // Increment frames counter

    // Log updates per second (UPS) and frames per second (FPS) every second
    if (currentTime - this.previousFPSTime >= 1000) {
      console.log("UPS:", this.updates);
      console.log("FPS:", this.frames);
      this.updates = 0;
      this.frames = 0;
      this.previousFPSTime = currentTime;
    }
  }

  update() {

    this.gameController.update();
  }

  render() {

    this.gameController.render();
  }
}

export default GameEngine;
