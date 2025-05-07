// src/algorithms/alphaBeta.js

// Alpha-Beta pruning implementation
export const alphaBeta = (board, depth, alpha, beta, isMaximizingPlayer) => {
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
    const newBoard = board.map(row => [...row]);
    newBoard[move.y][move.x] = 'AI';  // AI places a wall
    return newBoard;
  };
  
  const gameOver = (board) => {
    return false;  // Placeholder
  };
  