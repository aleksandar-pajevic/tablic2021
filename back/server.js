const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 5000;

const candidates = [];
const pairs = [];

io.on('connect', (socket) => {
  console.log('new client connected!');
  socket.on('join', ({ playerName, playerId }, callback) => {
    console.log(`Player name is ${playerName} and id: ${playerId}`);
    console.log('socket id:', socket.id);
    if (candidates.length === 0) {
      candidates.push({
        name: playerName,
        id: playerId,
        socket,
      });
      console.log('we have a blue player:', candidates[0].name);
      console.log('candidates lenght:', candidates.length);
    } else {
      pairs.push({
        blue: candidates.pop(),
        red: {
          name: playerName,
          id: playerId,
          socket,
        },
      });
      console.log('pairs lenght:', pairs.length);
      const lastPairIndex = pairs.length - 1;
      console.log('we have red candidate', pairs[lastPairIndex].red.name);
    }
  });
});

io.on('disconnection', (socket) => {
  console.log('new client disconnected!', new Date());
  console.log('Clients disconnected', socket.id);
});

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});
