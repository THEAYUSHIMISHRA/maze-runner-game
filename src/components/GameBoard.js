// src/components/GameBoard.js
import React, { useState, useEffect } from "react";
import "../components/styles/GameBoard.css";
import { aStar } from "../algorithms/astar";
import minimax from '../algorithms/minimax';

const GRID_SIZE = 10;
const CELL_SIZE = 50;

const generateWalls = () => {
  const walls = new Set();
  while (walls.size < 15) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    if (!(x === 0 && y === 0) && !(x === GRID_SIZE - 1 && y === GRID_SIZE - 1)) {
      walls.add(`${x},${y}`);
    }
  }
  return walls;
};

const GameBoard = () => {
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [walls, setWalls] = useState(generateWalls());
  const [path, setPath] = useState([]);
  const [board, setBoard] = useState(createBoard({ x: 0, y: 0 }, generateWalls()));
  const [aiTurn, setAiTurn] = useState(false);
  const exitPos = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 };

  function createBoard(player, wallsSet) {
    const board = Array.from({ length: GRID_SIZE }, () =>
      Array(GRID_SIZE).fill("empty")
    );
    board[player.y][player.x] = "Player";
    board[exitPos.y][exitPos.x] = "Exit";
    wallsSet.forEach((w) => {
      const [x, y] = w.split(",").map(Number);
      board[y][x] = "Wall";
    });
    return board;
  }

  const handleKeyPress = (event) => {
    setPlayerPos((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      if (event.key === "ArrowUp" && prev.y > 0 && !walls.has(`${prev.x},${prev.y - 1}`)) newY--;
      if (event.key === "ArrowDown" && prev.y < GRID_SIZE - 1 && !walls.has(`${prev.x},${prev.y + 1}`)) newY++;
      if (event.key === "ArrowLeft" && prev.x > 0 && !walls.has(`${prev.x - 1},${prev.y}`)) newX--;
      if (event.key === "ArrowRight" && prev.x < GRID_SIZE - 1 && !walls.has(`${prev.x + 1},${prev.y}`)) newX++;

      if (newX !== prev.x || newY !== prev.y) {
        setAiTurn(true);  // AI will move after player
      }

      return { x: newX, y: newY };
    });
  };

  useEffect(() => {
    const foundPath = aStar(playerPos, exitPos, walls, GRID_SIZE);
    setPath(foundPath);

    const updatedBoard = createBoard(playerPos, walls);
    setBoard(updatedBoard);
  }, [playerPos, walls]);

  useEffect(() => {
    if (aiTurn) {
      const timer = setTimeout(() => {
        const move = minimax(board, 2, true, -Infinity, Infinity);
        if (move) {
          const wallStr = `${move.x},${move.y}`;
          if (!walls.has(wallStr)) {
            const newWalls = new Set(walls);
            newWalls.add(wallStr);
            setWalls(newWalls);
          }
        }
        setAiTurn(false);
      }, 500); // Delay for AI move
      return () => clearTimeout(timer);
    }
  }, [aiTurn, board, walls]);

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
              const inPath = path.some((p) => p.x === col && p.y === row);
              const key = `${col},${row}`;

              if (playerPos.x === col && playerPos.y === row) cellClass += " player";
              else if (exitPos.x === col && exitPos.y === row) cellClass += " exit";
              else if (walls.has(key)) cellClass += " wall";
              else if (inPath) cellClass += " path";

              return <div key={col} className={cellClass}></div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
