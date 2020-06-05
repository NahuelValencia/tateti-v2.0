import React from 'react';
import './App.css';
import FormPlayer from './FormPlayer';
import Title from './Title';
import ButtonGet from './ButtonGet';
import ButtonPlay from './ButtonPlay';

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
  }

  handlerGame(data) {
    console.log("Game created")
    this.setState({
      game: data,
      gameReady: true
    })
  }

  render() {
    if (!this.state.hasJoined) {
      return (
        <div className="">
          <Title />
          <br />
          {!this.state.player.playerId ?
            <FormPlayer action={this.handler} /> :
            <ButtonGet player={this.state.player} callback={this.handlerRoom} />
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
        <p>juego creado. TABLERO</p>
      </div>
    );
  }
}

export default App;

