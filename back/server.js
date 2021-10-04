const express = require('express');
const io = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});

for (socket of sockets) {
  console.log('socket id', socket.id);
  console.log('socket id', socket.data);
  console.log('socket id', socket.handshake);
}

io.on('connection', (socket) => {
  console.log('new client connected!', new Date());
  console.log('Clients connected', socket.id);
  socket.emit('connection', null);
});

io.on('disconnection', (socket) => {
  console.log('new client disconnected!', new Date());
  console.log('Clients disconnected', socket.id);
});
