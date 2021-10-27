const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const takeCards = require('./gameLogic');
const gameLogic = require('./gameLogic');
const filterPairs = require('./gameLogic');
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
        moves: 0,
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
          pair.deckId = deckId;
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
      let pair = gameLogic.filterPairs(playing, playerSocket)[0];

      pair.moves++;

      if (canTakeCards) {
        console.log('can Take Cards emited');
        let newTable = gameLogic.filterTable(tableCards, selectedCards);
        let newHand = handCards.filter(
          (handCard) => handCard.code !== card.code
        );

        //player take cards
        io.to(playerSocket.id).emit('can take cards', {
          newTable,
          newHand,
          selectedCards,
          card,
        });

        // round over and have tabla

        if (
          newTable.length === 0 &&
          (pair.moves === 12 || pair.moves === 24 || pair.moves === 36)
        ) {
          //get cards for new round
          let url = `https://deckofcardsapi.com/api/deck/${pair.deckId}/draw/?count=12`;
          axios.get(url).then((resp) => {
            let newCards = resp.data.cards;
            const blueCards = newCards.slice(0, 6);
            const redCards = newCards.slice(6, 12);
            io.to(pair.blue.socket.id).emit('new round', {
              newHand: blueCards,
            });
            io.to(pair.red.socket.id).emit('new round', { newHand: redCards });
          });

          //add tabla to player
          io.to(playerSocket.id).emit('tabla');
        }

        // round over and don't have tabla
        if (
          newTable.length > 0 &&
          (pair.moves === 12 || pair.moves === 24 || pair.moves === 36)
        ) {
          //get cards for new round
          let url = `https://deckofcardsapi.com/api/deck/${pair.deckId}/draw/?count=12`;
          axios.get(url).then((resp) => {
            let newCards = resp.data.cards;
            const blueCards = newCards.slice(0, 6);
            const redCards = newCards.slice(6, 12);
            io.to(pair.blue.socket.id).emit('new round', {
              newHand: blueCards,
            });
            io.to(pair.red.socket.id).emit('new round', { newHand: redCards });
          });
        }
        // game over and have tabla
        if (newTable.length === 0 && pair.moves === 48) {
          //add tabla to player
          io.to(playerSocket.id).emit('tabla');
          io.to(playerSocket.room).emit('game over');
        }
        // game over and don't have tabla
        if (newTable.length > 0 && pair.moves === 48) {
          io.to(playerSocket.room).emit('game over');
        }
        // not round end and have tabla
        if (
          newTable.length === 0 &&
          (pair.moves !== 12 || pair.moves !== 24 || pair.moves !== 36)
        ) {
          //add tabla to player
          io.to(playerSocket.id).emit('tabla');
        }
        // not round over and dont't have tabla
        if (
          newTable.length > 0 &&
          (pair.moves !== 12 || pair.moves !== 24 || pair.moves !== 36)
        ) {
        }
        io.in(playerSocket.room).emit('change move', { newTable });
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
        io.in(playerSocket.room).emit('change move', { newTable });

        //if this was 12th move in round
        if (pair.moves === 12 || pair.moves === 24 || pair.moves === 36) {
          //get cards for new round
          let url = `https://deckofcardsapi.com/api/deck/${pair.deckId}/draw/?count=12`;
          axios.get(url).then((resp) => {
            let newCards = resp.data.cards;
            const blueCards = newCards.slice(0, 6);
            const redCards = newCards.slice(6, 12);
            io.to(pair.blue.socket.id).emit('new round', {
              newHand: blueCards,
            });
            io.to(pair.red.socket.id).emit('new round', { newHand: redCards });
          });
          //if this was 48th move in game(game over)
        } else if (pair.moves === 48) {
          io.to(playerSocket.room).emit('game over');
        }
      }
    }
  );

  socket.on('last card', () => {});
}

//new roud cards
function newRound(pair) {
  let url = `https://deckofcardsapi.com/api/deck/${pair.deckId}/draw/?count=12`;
  axios.get(url).then((resp) => {
    return resp.data.cards;
  });
}

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`);
});
