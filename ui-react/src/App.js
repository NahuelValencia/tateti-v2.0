import React from 'react';
import './App.css';
import FormPlayer from './components/FormPlayer';
import Title from './components/Title';
import ButtonJoin from './components/ButtonJoin';
import ButtonPlay from './components/ButtonPlay';
import Game from './components/Game'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      player: {},
      room: {},
      game: {},
      hasJoined: false,
      gameReady: false,
    }

    this.handler = this.handler.bind(this);
    this.handlerRoom = this.handlerRoom.bind(this);
    this.handlerGame = this.handlerGame.bind(this);
  }

  // This method will be sent to the child component
  handler(data) {
    this.setState({
      player: data,
    });
  }

  handlerRoom(data) {
    console.log("Room ready")
    this.setState({
      room: data,
      hasJoined: true,
    })
    console.log(this.state)
  }

  handlerGame(data) {
    console.log("Game created")
    console.log(this.state)
    this.setState({
      game: data,
      hasJoined: true,
      gameReady: true
    })
  }

  render() {
    if (!this.state.hasJoined) {
      return (
        <div className="">
          <Title />
          {!this.state.player.playerId ?
            <FormPlayer action={this.handler} /> :
            <ButtonJoin player={this.state.player} callback={this.handlerRoom} callbackGame={this.handlerGame} />
          }
        </div>
      );
    }

    if (!this.state.gameReady && this.state.player.playerId === this.state.room.player2) {
      return (
        <div className="">
          <Title />
          <br />
          <ButtonPlay data={this.state} callback={this.handlerGame} />
        </div>
      );
    }

    return (
      <div className="">
        <Title />
        <br />
        <Game game={this.state.game} board={this.state.game.board} players={this.state.game.players} currentPlayer={this.state.player} />
      </div>
    );
  }
}

export default App;

