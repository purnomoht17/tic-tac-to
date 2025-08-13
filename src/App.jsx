import { useState } from 'react'
import confetti from "canvas-confetti";
import { useEffect } from "react";

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`square ${value || ''} ${isWinning ? 'winning-square' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}


function Board({ xIsNext, squares, onPlay }) {
  const { winner, line } = calculateWinner(squares);

    useEffect(() => {
    if (winner) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [winner]);

  function handleClick(i) {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  let status = '';
  if (winner) {
    status = '🎉 Winner: ' + winner + ' 🎉';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((value, i) => (
          <Square
            key={i}
            value={value}
            onSquareClick={() => handleClick(i)}
            isWinning={line.includes(i)}
          />
        ))}
      </div>
    </>
  );
}

export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [winner, setWinner] = useState(null);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handlePlay(nextSquares){
    const nextHistory  = [...history.slice(0,  currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    // Cek pemenang setiap kali main
    const result = calculateWinner(nextSquares);
    if (result.winner) {
      setWinner(result.winner);
    }
  };

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setWinner(null);
  }

  const moves = history.map((squares, move) => {
    let description = '';
    if(move > 0){
      description = 'Go to move # ' + move;
    } else {
      description = 'Go to game start'
    }
    
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>

      {winner && (
        <>
          <div className="overlay" onClick={resetGame}></div>
          <div className="winner-popup">
            <h2>🎉 Selamat! {winner} Menang 🎉</h2>
            <button onClick={resetGame}>Main Lagi</button>
          </div>
        </>
      )}
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

