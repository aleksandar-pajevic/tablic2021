const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
port = 8000;
const io = require('socket.io')(server);

server.listen(port, () => {
  console.log(`listening on *: ${port}`);
});

io.on('connection', (socket) => {
  console.log('new client connected!');
  socket.emit('connection', null);
});
