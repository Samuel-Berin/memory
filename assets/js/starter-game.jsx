import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<MatchGame />, root);
}


// App state for Match Game is:
// {
    //board : Array of Arrays
    // board[0][0] is the first square
    // board[0][1] is the second square

    //Each square is a tuple of [LETTER, IS REVEALED]
    // etc

    //firstGuess: string
    // First guess in a pair. If "", then no guess

    //secondGuess: string
    // Second guess in a pair. If "", then no guess

    //Score: int
    // Number of times clicked on the page
// }



class MatchGame extends React.Component {
  constructor(props) {
    super(props);
    var boardModel = this.rollBoard();

    this.state = {
      board: boardModel,
      firstGuess: "",
      secondGuess: "",
      score: 0,
    };}


  rollBoard() {
    var availableLetters = ["A", "A", "B", "B", "C", "C",
     "D","D", "E", "E", "F", "F", "G", "G", "H", "H"];
    var boardModel = [];

    for (var i = 0; i < 4; i++) {
      var row = [];
      for (var j = 0; j < 4; j++){
        var index = Math.floor(Math.random() * availableLetters.length);
        var val = availableLetters.splice(index, 1)[0];
        row.push([val, false]);
      }
      boardModel.push(row);
    }
    return boardModel;
  }

  restart() {
    var newBoard = this.rollBoard();
    var state1 = {
      board: newBoard,
      firstGuess: "",
      secondGuess: "",
      score: 0,
    }
    this.setState(state1);
  }


  guess(row, col) {

    if (this.state.firstGuess != "" && this.state.secondGuess != "") {
      //Do Nothing
      //We're waiting on a timeout
    }

    else if (this.state.firstGuess == "") {
      var newScore = this.state.score + 1;
      var letter = this.state.board[row][col][0];
      var state1 = Object.assign(this.state, {
        firstGuess: letter,
        score: newScore,
      } );
      this.setState(state1);
      this.revealByIndices(row, col);
    }

    // There is already an first guess, compare
    else {
      var newGuess = this.state.board[row][col];
      var letter = newGuess[0];
      var newScore = this.state.score + 1;
      var state1 = Object.assign(this.state, {
        secondGuess: letter,
        score: newScore,
      } );
      this.setState(state1);

      this.revealByIndices(row, col);
      setTimeout(function () {
        this.updateConcealedValues();
      }.bind(this), 1000);

    }
  }

  revealByIndices(row, col) {
    var guessLetter = this.state.board[row][col][0];
    this.state.board[row][col] = [guessLetter, true];
    var newScore = this.state.score + 1;
    var state1 = Object.assign(this.state, {
      board: this.state.board,
    } );
    this.setState(state1);
  }




  updateConcealedValues() {
    var newboard = this.state.board.slice(0)
    var correctGuess = this.state.firstGuess == this.state.secondGuess;
    console.log(this.state.firstGuess);
    console.log(this.state.secondGuess);
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        var letter = this.state.board[i][j][0]

        // If this is the first guess and it's correct, display
        // If this is the first guess and it's wrong, reconceal
        if (this.state.firstGuess == letter) {
          newboard[i][j] = [letter, correctGuess];
        }
        //We know if we're here that the first guess doesn't match the second
        // So conceal
        else if (this.state.secondGuess == letter) {
          newboard[i][j] = [letter, false];
        }
      }
    }

    var state1 = _.extend(this.state, {
      board: newboard,
      firstGuess: "",
      secondGuess: "",
    });
    this.setState(state1);
  }



  swap(_ev) {
    let state1 = _.assign({}, this.state, { board: this.state.board });
    this.setState(state1);
  }

  hax(_ev) {
    alert("hax!");
  }

  renderBoardCell(row, col) {
    var cell = this.state.board[row][col];
    var displayVal = "?"

    if (cell[1] == true) {
      displayVal = cell[0];

      if (this.state.firstGuess == displayVal ||
        this.state.secondGuess == displayVal) {
          return <td class="guessLetter"> {displayVal}</td>
        }

      else {
        return <td> {displayVal} </td>
        }
    }

    return <td>
      <button onClick={((e) => this.guess(row, col))}> {displayVal} </button>
    </td>
  }

  renderBoardRow(row) {
    return <tr>
      {this.renderBoardCell(row, 0)}
      {this.renderBoardCell(row, 1)}
      {this.renderBoardCell(row, 2)}
      {this.renderBoardCell(row, 3)}
    </tr>
  }

  render() {
    let button = <div className="column" onMouseMove={this.swap.bind(this)}>
      <p><button onClick={this.hax.bind(this)}>Click Me</button></p>
    </div>;

    let blank = <div className="column">
      <p>Nothing here.</p>
    </div>;



    return <div>
      <p>Your score is: {this.state.score}</p>

      <table>
        <tbody>
          {this.renderBoardRow(0)}
          {this.renderBoardRow(1)}
          {this.renderBoardRow(2)}
          {this.renderBoardRow(3)}
        </tbody>
      </table>

    <button onClick={this.restart.bind(this)}>Restart</button>

    </div>
  }
}
