import React, { useState, useEffect, useRef } from "react";
import "../components/styles/GameBoard.css";
import { aStar } from "../algorithms/astar";
import minimax from '../algorithms/minimax';

import MazeBackground from '../assets/images/maze-bg.jpg';
import WallTexture from '../assets/images/wall-texture.jpg';
import PlayerIcon from '../assets/images/player-icon.png';
import PortalIcon from '../assets/images/portal.png';

import BackgroundMusic from '../assets/sounds/background-music.mp3';
import PortalSound from '../assets/sounds/portal-sound.mp3';
import MoveSound from '../assets/sounds/move-sound.mp3';
import WallPlaceSound from '../assets/sounds/wall-place-sound.mp3';

const GRID_SIZE = 10;
const CELL_SIZE = 50;

const exitPos = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 };

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
  const [isLoading, setIsLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [victory, setVictory] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);  // State to track music start

  const backgroundMusic = useRef(new Audio(BackgroundMusic));
  const moveSound = useRef(new Audio(MoveSound));
  const portalSound = useRef(new Audio(PortalSound));
  const wallPlaceSound = useRef(new Audio(WallPlaceSound));

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
        moveSound.current.currentTime = 0;
        moveSound.current.play().catch((err) => console.warn("Move sound blocked:", err));
        setAiTurn(true);
      }

      return { x: newX, y: newY };
    });
  };

  useEffect(() => {
    const music = backgroundMusic.current;
    music.loop = true;
    music.volume = 0.5;

    // Play music only after user interaction
    if (musicStarted) {
      music.play().catch((err) => console.warn("Background music autoplay blocked:", err));
    }

    portalSound.current.volume = 0.4;
    moveSound.current.volume = 0.6;
    wallPlaceSound.current.volume = 0.7;

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      music.pause();
      music.currentTime = 0;
    };
  }, [musicStarted]);  // Trigger music when interaction occurs

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
            wallPlaceSound.current.currentTime = 0;
            wallPlaceSound.current.play().catch((err) => console.warn("Wall sound blocked:", err));
          }
        }
        setAiTurn(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [aiTurn, board, walls]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    if (playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
      portalSound.current.currentTime = 0;
      portalSound.current.play().catch((err) => console.warn("Portal sound blocked:", err));
      setTimeout(() => setVictory(true), 800);
    }
  }, [playerPos]);

  return (
    <div className="game-container" style={{ backgroundImage: `url(${MazeBackground})` }}>
      {isLoading ? (
        <div className="loading">Loading Maze...</div>
      ) : !gameStarted ? (
        <div className="start-screen">
          <h1>Strategic Maze Runner</h1>
          <button onClick={() => { setGameStarted(true); setMusicStarted(true); }}>Start Game</button>
        </div>
      ) : victory ? (
        <div className="victory-screen">
          <h1>🎉 Congratulations! You Escaped the Maze!</h1>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      ) : (
        <>
          <div className="grid">
            {[...Array(GRID_SIZE)].map((_, row) => (
              <div key={row} className="row">
                {[...Array(GRID_SIZE)].map((_, col) => {
                  let cellClass = "cell";
                  const inPath = path.some((p) => p.x === col && p.y === row);
                  const key = `${col},${row}`;

                  if (inPath) cellClass += " path";

                  return (
                    <div
                      key={col}
                      className={cellClass}
                      style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        position: "relative",
                      }}
                    >
                      {playerPos.x === col && playerPos.y === row && (
                        <img src={PlayerIcon} alt="Player" className="cell-image" />
                      )}
                      {exitPos.x === col && exitPos.y === row && (
                        <img src={PortalIcon} alt="Portal" className="cell-image" />
                      )}
                      {walls.has(key) && (
                        <img src={WallTexture} alt="Wall" className="cell-image" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GameBoard;
