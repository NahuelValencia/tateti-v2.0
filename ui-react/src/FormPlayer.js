import React from "react";
import axios from 'axios';

class FormPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      player: {}
    };
  }

  handleChange = (event) => {
    let newState = {}
    newState[event.target.id] = event.target.value
    this.setState(newState);
  }

  handleSubmit = event => {
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
        if (res.status === 200) {
          console.log("Status OK")
          console.log(res.data.response.name)
          this.setState({
            name: res.data.response.name,
            player: res.data,
          })
        }
        console.log(res.data.response)
        this.props.action(res.data.response)
      })
      .catch((error) => {
        console.log(error)
      })
    console.log('Name: ' + this.state.name)
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
        {/* <br />
        <Welcome state={this.state} /> */}
      </div>
    )
  }
}

export default FormPlayer;