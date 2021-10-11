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
      pairs.forEach((pair) => {
        const lastPairIndex = pairs.length - 1;
        const blue = pairs[lastPairIndex].blue;
        const red = pairs[lastPairIndex].red;

        axios.get(deckUrl).then((resp) => {
          deckId = resp.data.deck_id;
          firstRoundCards = resp.data.cards;
          const blueCards = firstRoundCards.slice(0, 6);
          const redCards = firstRoundCards.slice(6, 12);
          const table = firstRoundCards.slice(12);

          blue.socket.emit('first round', {
            cards: blueCards,
            table,
            onMove: true,
            opponent: { name: red.name, color: 'red' },
          });

          red.socket.emit('first round', {
            cards: redCards,
            table,
            onMove: false,
            opponent: { name: blue.name, color: 'blue' },
          });
        });
        blue.socket.on('try to take', ({ ...args }) => {
          console.log(
            'Blues selected cards from server',
            args.playerSelectedCards
          );
          console.log('Blues hand card from server', args.card);
        });
        red.socket.on('try to take', ({ cards, card }) => {
          console.log('Reds selected cards from server', cards);
          console.log('Reds hand card from server', card);
        });
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});
