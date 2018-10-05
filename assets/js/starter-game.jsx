import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

// Code inspired by lecture code from Nat Tuck
// From github.com/NatTuck/hangman

export default function game_init(root, channel) {
  ReactDOM.render(<MatchGame channel={channel} />, root);
}


// App state for Match Game is:
// {
    //board: Array of letters

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

    this.channel = props.channel;
    this.state = {
      board: [],
      firstGuess: "",
      secondGuess: "",
      score: 0,
      revealed: [],
    };

    this.channel.join()
      .receive("ok", this.haveView.bind(this))
      .receive("error", resp => { console.log("Could not connect", resp)});



  }

  haveView(view) {
    console.log("New view!")
    console.log(view)
    this.setState(view.game);
  }


  restartGame(ev) {
    this.channel.push("restart", {})
      .receive("ok", this.haveView.bind(this));
  }




  //Renders a single board cell
  renderBoardCell(row, col) {
    var cell = this.state.board[row][col];
    var displayVal = "?"

    if (cell[1] == true) {
      displayVal = cell[0];

      if (this.state.firstGuess == displayVal ||
        this.state.secondGuess == displayVal) {
          return <td className="guessLetter"> {displayVal}</td>
        }

      else {
        return <td> {displayVal} </td>
        }
    }

    return <td>
      <button onClick={((e) => this.guess(row, col))}> {displayVal} </button>
    </td>
  }

  renderBoardCell(pos) {
    var displayVal = "?"

    if (this.state.revealed.contains(pos)) {
      var cellVal = this.state.board[pos]
      if (this.state.firstGuess == cellVal
        || this.state.secondGuess == cellVal) {
          return <td className="guessLetter"> {displayVal}</td>
        }
      else {
        return <td> {displayVal} </td>
      }
    }
    return <td>
      <button onClick={((e) => this.guess(row, col))}> {displayVal} </button>
    </td>
  }

  //Renders a board row
  renderBoardRow(row) {
    return

     <tr>
       {this.renderBoardCell((row * 4) + 0) }
       {this.renderBoardCell((row * 4) + 1) }
       {this.renderBoardCell((row * 4) + 2) }
       {this.renderBoardCell((row * 4) + 3) }
    </tr>

  }

  //Will return elements when the game has been won
  haveWon() {
    var winner = this.state.revealed.length == 16

    if (winner) {
      return <h1>You Win!!! Press the Restart Button To Play Again!</h1>
    }
  }

  //Renders the app
  render() {

    return <div>
      <p>Your score is: {this.state.score}</p>

      <p>{this.haveWon()}</p>


      <table>
        <tbody>
          {this.renderBoardRow(0)}
          {this.renderBoardRow(1)}
          {this.renderBoardRow(2)}
          {this.renderBoardRow(3)}
        </tbody>
      </table>

    <button onClick={this.restartGame.bind(this)}>Restart</button>

    </div>
  }
}
