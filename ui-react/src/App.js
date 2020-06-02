import React from 'react';
import './App.css';
import FormPlayer from './FormPlayer';
import Title from './Title';
import Welcome from './Welcome';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      player: {},
      isLoading: true,
      error: null
    }

    this.handler = this.handler.bind(this);
  }

  // This method will be sent to the child component
  handler(data) {
    this.setState({
      player: data,
    });
  }

  render() {
    return (
      <div className="">
        <Title />
        <br />
        {!this.state.player.playerId ?
          <FormPlayer action={this.handler} /> :
          <Welcome player={this.state.player} />
        }

      </div>
    );
  }
}

export default App;

