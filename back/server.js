const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const takeCards = require('./gameLogic');
const gameLogic = require('./gameLogic');
const { v1: uuidv1, v4: uuidv4 } = require('uuid');

const axios = require('axios');

const deckUrl = 'https://deckofcardsapi.com/api/deck/new/draw/?count=16';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 5000;

const candidates = [];
const pairs = [];
const playing = [];

io.on('connect', conected);
function conected(socket) {
  console.log('new client connected!');
  socket.on('join', ({ playerName }, callback) => {
    console.log(`Player name is ${playerName}`);
    if (candidates.length === 0) {
      candidates.push({
        name: playerName,
        socket,
      });
      console.log('we have a blue player:', candidates[0].name);
      console.log('candidates lenght:', candidates.length);
    } else {
      pairs.push({
        room: uuidv4(),
        blue: candidates.pop(),
        red: {
          name: playerName,
          socket,
        },
      });
      const lastPairIndex = pairs.length - 1;

      console.log('pairs lenght:', pairs.length);
      console.log('lastPair index:', lastPairIndex);
      console.log('we have red candidate', pairs[lastPairIndex].red.name);
      console.log(pairs);

      if (pairs.length > 0) {
        let pair = pairs.pop();
        const blue = pair.blue;
        const red = pair.red;
        console.log('pair is this:', pair);
        console.log('pairs are this:', pairs);

        // ADD PLAYERS TO ROOM
        blue.socket.join(pair.room);
        red.socket.join(pair.room);

        // GET CARDS FROM API
        axios.get(deckUrl).then((resp) => {
          deckId = resp.data.deck_id;
          let firstRoundCards = resp.data.cards;
          const blueCards = firstRoundCards.slice(0, 6);
          const redCards = firstRoundCards.slice(6, 12);
          const table = firstRoundCards.slice(12);
          // to individual socketid (private message)
          io.to(blue.socket.id).emit('first round', {
            cards: blueCards,
            table,
            onMove: true,
            opponent: { name: red.name, color: 'red' },
            socket: {
              room: pair.room,
              id: pair.blue.socket.id,
            },
          });
          // to individual socketid (private message)
          io.to(red.socket.id).emit('first round', {
            cards: redCards,
            table,
            onMove: false,
            opponent: { name: blue.name, color: 'blue' },
            socket: {
              room: pair.room,
              id: pair.red.socket.id,
            },
          });

          playing.push(pair);
        });
      }
    }
  });
  socket.on(
    'try to take',
    ({ selectedCards, handCards, tableCards, playerSocket, card }) => {
      let canTakeCards = gameLogic.takeCards(selectedCards, card);
      if (canTakeCards) {
        console.log('can Take Cards emited');
        let newTable = gameLogic.filterTable(tableCards, selectedCards);
        let newHand = handCards.filter(
          (handCard) => handCard.code !== card.code
        );

        io.to(playerSocket.id).emit('can take cards', {
          newTable,
          newHand,
          selectedCards,
          card,
        });
        console.log('change move emited, room:');

        socket.to(playerSocket.room).emit('change move', { newTable });
      } else {
        console.log('can NOT Take Cards emited');
        let newTable = [...tableCards, card];
        let newHand = handCards.filter(
          (handCard) => handCard.code !== card.code
        );
        io.to(playerSocket.id).emit('can not take cards', {
          newTable,
          newHand,
          card,
        });
        socket.to(playerSocket.room).emit('change move', { newTable });
      }
    }
  );
}

let deckId;
let firstRoundCards;

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});
