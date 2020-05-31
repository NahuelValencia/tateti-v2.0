import React from "react";
import axios from 'axios';

class FormPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  handleChange = (event) => {
    let newState = {}
    newState[event.target.id] = event.target.value
    this.setState(newState);
  }

  handleSubmit = async event => {
    event.preventDefault();
    console.log('Player: ' + this.state.name);

    const headers = {
      'Authorization': 'ProgAv2020'
    }

    const player = {
      name: this.state.name
    }

    axios
      .post(`http://localhost:9000/player`, player, {
        headers: headers
      })
      .then(res => {
        console.log(player);
        console.log(res);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Player Name:
          <input id="name" type="text" value={this.state.name} onChange={this.handleChange} />
          </label>

          <button type="submit" value="Submit">OK</button>
        </form>
      </div>
    )
  }
}

export default FormPlayer;