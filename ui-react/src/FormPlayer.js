import React from "react";
import { createPlayer } from "./service/PlayerApi";

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

  handleSubmit = async event => {
    event.preventDefault();

    const headers = {
      'Authorization': 'ProgAv2020'
    }

    const player = {
      name: this.state.name
    }

    try {
      let res = await createPlayer(player, headers)

      if (res.status === 200) {
        console.log("Player Created")
        console.log(res.response)
        this.setState({
          name: res.response.name,
          player: res.response,
        })
      }
      if (res.status === 400) {
        alert("A name must be provided")
      }
      this.props.action(res.response)
    } catch (error) {
      console.log(error)
    }
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