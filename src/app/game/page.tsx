"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

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
    if (!isGameStarted || typeof window === "undefined") return;

    import("./GameController").then(({ default: GameController }) => {
      const socket = io("http://localhost:5000", {
        query: { playerName },
      });

      const gameController = new GameController(socket, playerName);

      return () => {
        socket.disconnect();
      };
    });
  }, [isGameStarted]);

  if (!isGameStarted) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <h1>Enter your name to start the game</h1>
        <form onSubmit={handleNameSubmit}>
          <input
            className="text-sm text-blue-700"
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
    <div
      id="phaser-game"
      className="flex items-center justify-center h-screen"
    ></div>
  );
};

export default GamePage;
