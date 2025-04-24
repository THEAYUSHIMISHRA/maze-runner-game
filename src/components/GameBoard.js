// src/components/GameBoard.js
import React, { useState, useEffect } from "react";
import "./components/styles/GameBoard.css"; 
import astar from "./algorithms/astar";
import alphaBeta from "./algorithms/alphaBeta";

const GRID_SIZE = 10; // 10x10 Grid
const CELL_SIZE = 50; // Size of each cell in pixels

// Initialize walls (random placement for now)
const generateWalls = () => {
  const walls = new Set();
  while (walls.size < 15) { // Limit number of walls
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (!(x === 0 && y === 0) && !(x === GRID_SIZE - 1 && y === GRID_SIZE - 1)) {
      walls.add(`${x},${y}`);
    }
  }
  return walls;
};

const GameBoard = () => {
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 }); // Player starts at (0,0)
  const [walls, setWalls] = useState(generateWalls());
  const exitPos = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 }; // Exit at bottom-right corner

  // Handle player movement
  const handleKeyPress = (event) => {
    setPlayerPos((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      if (event.key === "ArrowUp" && prev.y > 0 && !walls.has(`${prev.x},${prev.y - 1}`)) newY--;
      if (event.key === "ArrowDown" && prev.y < GRID_SIZE - 1 && !walls.has(`${prev.x},${prev.y + 1}`)) newY++;
      if (event.key === "ArrowLeft" && prev.x > 0 && !walls.has(`${prev.x - 1},${prev.y}`)) newX--;
      if (event.key === "ArrowRight" && prev.x < GRID_SIZE - 1 && !walls.has(`${prev.x + 1},${prev.y}`)) newX++;

      return { x: newX, y: newY };
    });
  };

  // Set up event listener for player movement
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="game-container">
      <div className="grid">
        {[...Array(GRID_SIZE)].map((_, row) => (
          <div key={row} className="row">
            {[...Array(GRID_SIZE)].map((_, col) => {
              let cellClass = "cell";
              if (playerPos.x === col && playerPos.y === row) cellClass += " player";
              if (exitPos.x === col && exitPos.y === row) cellClass += " exit";
              if (walls.has(`${col},${row}`)) cellClass += " wall";
              return <div key={col} className={cellClass}></div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
