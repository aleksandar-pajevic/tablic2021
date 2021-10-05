const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 5000;

io.on('connect', (socket) => {
  console.log('new client connected!');
  socket.on('join', ({ playerName }, callback) => {
    console.log(`Player name is ${playerName}`);
    console.log('socket id:', socket.id);
  });
});

io.on('disconnection', (socket) => {
  console.log('new client disconnected!', new Date());
  console.log('Clients disconnected', socket.id);
});

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});
