// src/algorithms/minimax.js

import { alphaBeta } from './alphaBeta';

// Minimax algorithm integrated with Alpha-Beta pruning
const minimax = (board, depth, isMaximizingPlayer, alpha, beta) => {
  if (depth === 0 || gameOver(board)) {
    return evaluateBoard(board);
  }

  let bestMove = null;

  if (isMaximizingPlayer) {
    let best = -Infinity;
    for (let move of getPossibleMoves(board)) {
      const newBoard = makeMove(board, move);
      const moveValue = alphaBeta(newBoard, depth - 1, alpha, beta, false);  // Using Alpha-Beta Pruning here
      if (moveValue > best) {
        best = moveValue;
        bestMove = move;
      }
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;  // Pruning
    }
    return bestMove;
  } else {
    let best = Infinity;
    for (let move of getPossibleMoves(board)) {
      const newBoard = makeMove(board, move);
      const moveValue = alphaBeta(newBoard, depth - 1, alpha, beta, true);  // Using Alpha-Beta Pruning here
      if (moveValue < best) {
        best = moveValue;
        bestMove = move;
      }
      beta = Math.min(beta, best);
      if (beta <= alpha) break;  // Pruning
    }
    return bestMove;
  }
};

const evaluateBoard = (board) => {
  // A simple evaluation function to score the board
  let score = 0;
  for (let row of board) {
    for (let cell of row) {
      if (cell === 'AI') score += 1;
      if (cell === 'Player') score -= 1;
    }
  }
  return score;
};

const getPossibleMoves = (board) => {
  const moves = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 'empty') {
        moves.push({ x: col, y: row });
      }
    }
  }
  return moves;
};

const makeMove = (board, move) => {
  const newBoard = board.map(row => [...row]);  // Deep copy
  newBoard[move.y][move.x] = 'AI';  // AI places a wall
  return newBoard;
};

const gameOver = (board) => {
  // Check if the game is over (e.g., check if the player has reached the exit)
  return false;  // For now, a placeholder for actual game logic
};

export default minimax;
