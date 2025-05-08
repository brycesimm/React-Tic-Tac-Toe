import { useState } from "react";
//run npm start in cmd to run
//X goes first, determined by xIsNext based on current move number
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isMoveListReversed, setIsMoveListReversed] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  /*
    Keeps track of each turn through history array, each time a move is made
    the board state gets added to the history array and the current move number is updated
  */
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  /*
    Simply sets the current move number to the one provided;
    currentMove is then used to determine which player's turn 
    it is, as well as which board in the history array to display
  */
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  /*
    moves is an array that is created by mapping the board history array to move numbers
    for each move in moves[], a button description is set to be displayed
  */
  let moves;
  moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if(isMoveListReversed) {
    moves = moves.reverse();
  }

  return (
    <>
      <div className="game">
        <div className="game-board">
          {/*
             xIsNext and currentSquares are determined by currentMove state number and passed down 
          */}
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <div className="curr-move-info">{"You are at move #" + currentMove}</div>
          <ol>{moves}</ol>
        </div>
      </div>
      {/*
         This button reverses the move list by setting the isMoveListReversed state to its 
         opposite value which then determines whether the moves <li> array is reversed or not 
      */}
      <div><button className="reverse-button" onClick={() => setIsMoveListReversed(!isMoveListReversed)}>Reverse Move List</button></div>
    </>
  );
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    /*
      winner is an array where winner[0] holds the winner if there is one, and 
      winner[1] through winner[3] hold the winning squares if there is a winner
    */
    const winner = calculateWinner(squares);
    /*
      If square already has a value, don't do anything
    */
    if(squares[i]) {
      return;
    }
    /*
      If there is a winner, don't do anything
    */
    if(winner != null){
      if(winner[0] != null){
        return;
      }
    }
    /*
      Update nextSquares board array with corresponding player's symbol and 
      send to Game component's onPlay to update the board
    */
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    }
    else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winnerArr = calculateWinner(squares);
  let winner;

  /*
    Check winnerArray isn't null and if there is a winner
  */
  if(winnerArr != null){
    winner = winnerArr[0];
  }
  /*
    If there is a winner, take not of which squares won so they can be highlighted
  */
  let winningSquares;
  if(winner){
    winningSquares = [winnerArr[1], winnerArr[2], winnerArr[3]];
  } else {
    winningSquares = [null, null, null];
  }
  /*
    Update status message based on the presence of a winner, a tie, or an unfinished game
  */
  let status;
  if(winner != "nobody" && winner != null) {
    status = "Winner: " + winner;
  } else if (winner == "nobody") {
    status = "It's a tie!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
    /*
      Populate the 9x9 board procedurally
    */
    let rows = [];
    for(let i = 0; i < 3; i++) {
      let rowSquares = [];
      for(let j = 0; j < 3; j++) {
        /*
          squareNum is the square's index in the board
        */
        let squareNum = (i * 3) + j;
        let squareToPush;
        /*
          Check if the current square is part of a winning combo, if so push a square with
          isWinner = true so that it is highlighted; otherwise isWinner = false
        */
        if(winningSquares.includes(squareNum)) {
          squareToPush = 
          <Square 
          key={squareNum} 
          value={squares[squareNum]} 
          onSquareClick={() => handleClick(squareNum)} 
          isWinner={true}
          />
        }else{
          squareToPush = 
          <Square 
          key={squareNum} 
          value={squares[squareNum]} 
          onSquareClick={() => handleClick(squareNum)} 
          isWinner={false}
          />
        }
        rowSquares.push(
          squareToPush
        );
      }
      rows.push(
        <div key={i} className="board-row">{rowSquares}</div>
      );
    }
  /*
    return board with status message above
  */
  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

/*
  Calculates winner based on horizontal, vertical, or diagonal combinations
*/
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
  ]

  /*
    Loops through lines array and checks the squares in each spot. If they all match, it's 3 in a row
    and a winner is determined. squares[a] holds an X or O, and the next 3 spots hold the square indices
    that won and are to be highlighted
  */
  for(let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] == squares[b] && squares[b] == squares[c]) {
      return [squares[a], a, b, c];
    }
  }
  /*
    If the board does not have any null values then it is full and a winner has not been determined
    by the above loop so it must be a tie
  */
  if(!squares.some(element => element === null)) {
    return ["nobody", null, null, null];
  }

  /*
    Game is not over yet
  */
  return null;
}

/*
  Winning squares are highlighted, regualar squares are not. Displays an X or O when clicked
  depending on the player's turn
*/
function Square({ value, onSquareClick , isWinner}) {
  if(isWinner){
    return <button className="winner" onClick={onSquareClick}>{value}</button>;
  }else{
    return <button className="square" onClick={onSquareClick}>{value}</button>;
  }
}