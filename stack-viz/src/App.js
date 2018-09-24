import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Canvas } from './components';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Canvas>
          Hello world
        </Canvas>
      </div>
    );
  }
}

export default App;
