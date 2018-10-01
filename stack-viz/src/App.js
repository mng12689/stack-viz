import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Stack } from './pages';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Stack>
          Hello world
        </Stack>
      </div>
    );
  }
}

export default App;
