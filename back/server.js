const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const axios = require('axios');
const deckUrl = 'https://deckofcardsapi.com/api/deck/new/draw/?count=16';

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
    console.log(`Player name is ${playerName}`);
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
      const lastPairIndex = pairs.length - 1;

      console.log('pairs lenght:', pairs.length);
      console.log('lastPair index:', lastPairIndex);
      console.log('we have red candidate', pairs[lastPairIndex].red.name);
    }
    let deckId;
    let firstRoundCards;
    if (pairs.length > 0) {
      axios.get(deckUrl).then((resp) => {
        const lastPairIndex = pairs.length - 1;

        console.log(resp.data);
        deckId = resp.data.deck_id;
        firstRoundCards = resp.data.cards;
        const blueCards = firstRoundCards.slice(0, 6);
        const redCards = firstRoundCards.slice(6, 12);
        const table = firstRoundCards.slice(12);

        const blue = pairs[lastPairIndex].blue;
        const red = pairs[lastPairIndex].red;

        blue.socket.emit('first round', {
          cards: blueCards,
          table,
          onMove: true,
        });
        red.socket.emit('first round', {
          cards: redCards,
          table,
          onMove: true,
        });
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});
