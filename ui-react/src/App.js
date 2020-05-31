import React from 'react';
import './App.css';
import FormPlayer from './FormPlayer';
import Title from './Title';

class App extends React.Component {
  render() {
    return (
      <div className="">
        <Title />
        <br />
        <FormPlayer />

      </div>
    );
  }
}

export default App;

