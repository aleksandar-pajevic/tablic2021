import './App.css';
import io from 'socket.io-client';
import React, { PureComponent } from 'react';

class App extends PureComponent {
  componentDidMount() {
    const SERVER = 'http://127.0.0.1:8000';
    let socket = io(SERVER, {
      transports: ['websocket', 'polling', 'flashsocket'],
    });
    socket.on('connection', () => {
      console.log('I am connected with back-end!');
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Hello from tablic</h1>
      </div>
    );
  }
}
export default App;
