import React, { useState, useEffect } from "react";
import "./Game.css";

const initialBoard = Array(9).fill(null);

const Game = () => {
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [gameMode, setGameMode] = useState("AI"); // 'AI' or 'Human'
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [message, setMessage] = useState("");

  const handleClick = (index) => {
    if (board[index] || winner || isDraw) return;
    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  useEffect(() => {
    const gameWinner = calculateWinner(board);
    if (gameWinner) {
      setWinner(gameWinner);
      setMessage(`Winner: ${gameWinner}`);
      alert(`Winner: ${gameWinner}`);
    } else if (!board.includes(null)) {
      setIsDraw(true);
      setMessage("It's a Draw!");
      alert("It's a Draw!");
    }
  }, [board]);

  useEffect(() => {
    if (!isXNext && gameMode === "AI" && !winner && !isDraw) {
      const bestMove = getBestMove(board);
      if (bestMove !== -1) {
        const newBoard = board.slice();
        newBoard[bestMove] = "O";
        setBoard(newBoard);
        setIsXNext(true);
      }
    }
  }, [isXNext, gameMode, winner, isDraw, board]);

  const renderSquare = (index) => {
    return (
      <button className="square" onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsXNext(true);
    setWinner(null);
    setIsDraw(false);
    setMessage("");
  };

  const getBestMove = (board) => {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = "O";
        let moveVal = minimax(board, 0, false);
        board[i] = null;
        if (moveVal > bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }
    return bestMove;
  };

  const minimax = (board, depth, isMax) => {
    const gameWinner = calculateWinner(board);
    if (gameWinner === "O") return 10 - depth;
    if (gameWinner === "X") return depth - 10;
    if (!board.includes(null)) return 0;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          board[i] = "O";
          best = Math.max(best, minimax(board, depth + 1, !isMax));
          board[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          board[i] = "X";
          best = Math.min(best, minimax(board, depth + 1, !isMax));
          board[i] = null;
        }
      }
      return best;
    }
  };

  return (
    <div className="game">
      <div className="game-mode">
        <label>
          Choose Game Mode:
          <select
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
            disabled={winner || isDraw}
          >
            <option value="AI">Play against AI</option>
            <option value="Human">Play against Human</option>
          </select>
        </label>
      </div>
      <div className="game-board">
        {board.map((_, index) => renderSquare(index))}
      </div>
      <div className="game-info">
        <div>
          {winner || isDraw ? message : `Next player: ${isXNext ? "X" : "O"}`}
        </div>
        <button onClick={resetGame} className="reset-button">
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default Game;
