import React from "react"

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerName: '',
      pieceSelected: ''
    };
  }

  handleChange = (event) => {
    let newState = {}
    newState[event.target.id] = event.target.value
    this.setState(newState);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log('Player: ' + this.state.playerName);
    console.log('Piece selected: ' + this.state.pieceSelected);
  }

  handleSubmit(event) {
    console.log('Player name: ' + this.state.playerName);
    console.log('Piece selecteed: ' + this.state.pieceSelected);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input id="playerName" type="text" value={this.state.playerName} onChange={this.handleChange} />
        </label>
        <br />

        <label>
          Piece:
          <select id="pieceSelected" value={this.state.pieceSelected} onChange={this.handleChange}>
            <option value="default"></option>
            <option value="x">X</option>
            <option value="o">O</option>
          </select>
        </label>
        <br />

        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export { Home }