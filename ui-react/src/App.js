import React from 'react';
import './App.css';
import FormPlayer from './FormPlayer';
import Title from './Title';
import ButtonGet from './ButtonGet';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      player: {},
      game: {},
      isReady: false,
      isLoading: true,
      error: null
    }

    this.handler = this.handler.bind(this);
    this.handlerGame = this.handlerGame.bind(this);
  }

  // This method will be sent to the child component
  handler(data) {
    this.setState({
      player: data,
    });
  }

  handlerGame(data) {
    console.log("Game created")
    this.setState({
      game: data,
      isReady: true,
    })
  }

  render() {
    if (!this.state.isReady) {
      return (
        <div className="">
          <Title />
          <br />
          {!this.state.player.playerId ?
            <FormPlayer action={this.handler} /> :
            <ButtonGet player={this.state.player} callback={this.handlerGame} />
          }
        </div>
      );
    }

    return (
      <div className="">
        <Title />
        <br />

      </div>
    );
  }
}

export default App;

