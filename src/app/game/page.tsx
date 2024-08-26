"use client";
import { useEffect } from "react";
import io from "socket.io-client";
import GameController from "./GameController";
import GameEngine from "./GameEngine";

const GamePage = () => {
  useEffect(() => {
    const socket = io("http://localhost:5000");
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");

    const gameController = new GameController(context, socket);

    const gameEngine = new GameEngine(context, gameController);
    gameEngine.start();

    return () => {
      gameEngine.stop();
      socket.disconnect();
    };
  }, []);

  return <canvas id="gameCanvas" width="800" height="600"></canvas>;
};

export default GamePage;
