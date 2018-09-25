import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<MatchGame/>, root);
}


// App state for Match Game is:
// {
    //board : Array of Arrays
    // board[0][0] is the first square
    // board[0][1] is the second square

    //Each square is a tuple of [LETTER, IS REVEALED]
    // etc

    //activeGuess: string
    // The last letter guessed. If "", then no active guess
// }



class MatchGame extends React.Component {
  constructor(props) {
    super(props);
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

    this.state = {
      board: boardModel,
      activeGuess: "",
    };}


  guess(row, col) {
    if (this.state.activeGuess == "") {
      this.revealByIndices(row, col);
    }

    // There is already an active guess, compare
    else {
      var newGuess = this.state.board[row][col];
      var letter = newGuess[0];
      if (letter == this.state.activeGuess) {
        this.reveal(letter);
      }

      else {
        this.conceal(this.state.activeGuess)
        this.conceal(letter);
      }
    }
  }

  revealByIndices(row, col) {
    var guessLetter = this.state.board[row][col][0];
    this.state.board[row][col] = [guessLetter, true];
    var state1 = Object.assign(this.state, {
      board: this.state.board,
      activeGuess: guessLetter,
    } );
    this.setState(state1);
  }



  reveal(letter) {
    this.shouldReveal(letter, true);
  }

  conceal(letter) {
    this.shouldReveal(letter, false);
  }


  shouldReveal(letter, bool) {
    var newboard = this.state.board.slice(0)
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        var letter2 = this.state.board[i][j][0]
        if (letter == letter2) {
          newboard[i][j] = [letter, bool];
        }
      }
    }

    var state1 = _.extend(this.state, {
      board: newboard,
      activeGuess: ""
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
      return <td> {displayVal} </td>
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

    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        console.log(this.state.board[i][j]);
      }
    }

    return <table>
      <tbody>
      {this.renderBoardRow(0)}
      {this.renderBoardRow(1)}
      {this.renderBoardRow(2)}
      {this.renderBoardRow(3)}
      </tbody>
    </table>
  }
}
