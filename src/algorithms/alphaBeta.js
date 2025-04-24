// src/algorithms/alphabeta.js

const alphaBeta = (board, depth, alpha, beta, isMaximizingPlayer) => {
    if (depth === 0 || gameOver(board)) {
      return evaluateBoard(board);
    }
  
    let bestMove = null;
    if (isMaximizingPlayer) {
      let best = -Infinity;
      for (let move of getPossibleMoves(board)) {
        const newBoard = makeMove(board, move);
        const moveValue = alphaBeta(newBoard, depth - 1, alpha, beta, false);
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
        const moveValue = alphaBeta(newBoard, depth - 1, alpha, beta, true);
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
    // A heuristic function to evaluate the board's state (example: prefers more AI walls).
    let score = 0;
    for (let row of board) {
      for (let cell of row) {
        if (cell === 'AI') {
          score += 1;
        } else if (cell === 'Player') {
          score -= 1;
        }
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
    const newBoard = board.map(row => [...row]);  // Deep copy of the board
    newBoard[move.y][move.x] = 'AI';  // Place an AI wall at the chosen position
    return newBoard;
  };
  
  const gameOver = (board) => {
    // Placeholder for the actual game-over logic (e.g., check if the player has reached the exit).
    return false;
  };
  
  export default alphaBeta;
  