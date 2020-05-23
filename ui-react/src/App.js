import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

export default class NetworkCall extends React.Component {
  constructor() {
      super()
      this.state = {
        apiResponse:""
      }
  }

  async componentDidMount() {
      try {
          const response = await axios.get('http://localhost:9000/users')
          this.setState({ apiResponse: response.data })
      } catch (e) {
          console.log(e)
      }
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <p>{this.state.apiResponse}</p>

      </div>
    );
  }
}
