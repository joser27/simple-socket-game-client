"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import GameController from "./GameController";
import GameEngine from "./GameEngine";
import Config from "./config.js";

const GamePage = () => {
  const [playerName, setPlayerName] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      setIsGameStarted(true);
    }
  };

  useEffect(() => {
    if (!isGameStarted) return;

    const socket = io("http://localhost:5000", {
      query: { playerName }, // Send the player name to the server when connecting
    });
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");

    const gameController = new GameController(context, socket, playerName);
    const gameEngine = new GameEngine(context, gameController);
    gameEngine.start();

    return () => {
      gameEngine.stop();
      socket.disconnect();
    };
  }, [isGameStarted]);

  if (!isGameStarted) {
    return (
      <div>
        <h1>Enter your name to start the game</h1>
        <form onSubmit={handleNameSubmit}>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <button type="submit">Start Game</button>
        </form>
      </div>
    );
  }

  return (
    <canvas
      id="gameCanvas"
      width={Config.CANVAS_WIDTH}
      height={Config.CANVAS_HEIGHT}
    ></canvas>
  );
};

export default GamePage;
