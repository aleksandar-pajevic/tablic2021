const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
const takeCards = require('./gameLogic')
const gameLogic = require('./gameLogic')
const filterPairs = require('./gameLogic')
const { v1: uuidv1, v4: uuidv4 } = require('uuid')

const axios = require('axios')
const { LOADIPHLPAPI } = require('dns')

const deckUrl = 'https://deckofcardsapi.com/api/deck/new/draw/?count=16'

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = socketio(server)
const PORT = process.env.PORT || 5000

const candidates = []
const onlinePlayers = []
const pairs = []
const playing = []

io.on('connect', conected)

function conected (socket) {
  socket.on('disconnect', () => {
    let disconectedPairIndex = playing.findIndex(pair =>
      pair.blue.socket.id === socket.id || pair.red.socket.id === socket.id )
      if (disconectedPairIndex < 0) {
        return
      } else {
        io.to(playing[disconectedPairIndex].room).emit('opponent disconnected');
        playing.splice(disconectedPairIndex, 1)
      }
    console.log('disconected pair:', disconectedPairIndex)
    console.log("reduced playing arr", playing);
    console.log('disconnected:', socket.id)
    const disconectedIndex = candidates.findIndex(
      player => player.socket.id === socket.id
    )
    if (disconectedIndex < 0) {
      return
    } else {
      candidates.splice(disconectedIndex, 1)
      onlinePlayers.splice(disconectedIndex, 1)
      io.emit('candidates', { candidates: onlinePlayers })
    }
  })

  console.log('new client connected!')

  //removing pair from playing array after game over
  socket.on('back to loby', ({ player }) => {
    const pairToRemove = playing.findIndex(pair => pair.room === player.room)
    console.log('room from client', player.room)
    console.log('back to loby should remove index', pairToRemove)
    if (pairToRemove > -1) {
      playing.splice(pairToRemove, 1)
    }
    // candidates.push({
    //   name: player.name,
    //   socket,
    //   tabla: 0,
    //   cards: {
    //     hand: [],
    //     taken: [],
    //     opponent: []
    //   }
    // })
    // onlinePlayers.push({
    //   name: player.name,
    //   socketId: socket.id
    // })

    console.log('reduced playing arr from back to loby:', playing)
    //update online players list
    // io.emit('candidates', { candidates: onlinePlayers })
  })

  //adding player to candidates and onlinePlayers array for loby
  socket.on('join', ({ playerName }, callback) => {
    console.log(`Player name is ${playerName}`, 'socket:', socket.id)

    candidates.push({
      name: playerName,
      socket,
      tabla: 0,
      cards: {
        hand: [],
        taken: [],
        opponent: []
      }
    })
    onlinePlayers.push({
      name: playerName,
      socketId: socket.id
    })

    io.emit('candidates', { candidates: onlinePlayers })
    // if (candidates.length === 0) {
    //   candidates.push({
    //     name: playerName,
    //     socket,
    //     tabla: 0,
    //     cards: {
    //       hand: [],
    //       taken: [],
    //       opponent: [],
    //     },
    //   });

    //   console.log('we have a blue player:', candidates[0].name);
    //   console.log('candidates lenght:', candidates.length);
    // } else {
    //   pairs.push({
    //     room: uuidv4(),
    //     moves: 0,
    //     table: [],
    //     blue: candidates.pop(),
    //     red: {
    //       name: playerName,
    //       socket,
    //       tabla: 0,
    //       cards: {
    //         hand: [],
    //         taken: [],
    //         opponent: [],
    //       },
    //     },
    //   });
    //   const lastPairIndex = pairs.length - 1;

    //   console.log('pairs lenght:', pairs.length);
    //   console.log('lastPair index:', lastPairIndex);
    //   console.log('we have red candidate', pairs[lastPairIndex].red.name);
    //   console.log(pairs);

    //   if (pairs.length > 0) {
    //     let pair = pairs.pop();
    //     const blue = pair.blue;
    //     const red = pair.red;
    //     const table = pair.table;
    //     // console.log('pair is this:', pair);
    //     // console.log('pairs are this:', pairs);

    //     // ADD PLAYERS TO ROOM
    //     blue.socket.join(pair.room);
    //     red.socket.join(pair.room);

    //     // GET CARDS FROM API
    //     axios.get(deckUrl).then((resp) => {
    //       deckId = resp.data.deck_id;
    //       pair.deckId = deckId;
    //       let firstRoundCards = resp.data.cards;
    //       const blueCards = firstRoundCards.slice(0, 6);
    //       const redCards = firstRoundCards.slice(6, 12);
    //       const tableCards = firstRoundCards.slice(12);
    //       blue.cards.hand.push(...blueCards);
    //       blue.cards.opponent = Array(6).fill({ image: `images/red.svg` });
    //       red.cards.hand.push(...redCards);
    //       red.cards.opponent = Array(6).fill({ image: `images/blue.svg` });
    //       table.push(...tableCards);

    //       // to individual socketid (private message)
    //       io.to(blue.socket.id).emit('first round', {
    //         cards: blue.cards.hand,
    //         table: table,
    //         onMove: true,
    //         opponent: { name: red.name, cards: blue.cards.opponent },
    //         socket: {
    //           room: pair.room,
    //           id: blue.socket.id,
    //         },
    //       });
    //       // to individual socketid (private message)
    //       io.to(red.socket.id).emit('first round', {
    //         cards: red.cards.hand,
    //         table: table,
    //         onMove: false,
    //         opponent: { name: blue.name, cards: red.cards.opponent },
    //         socket: {
    //           room: pair.room,
    //           id: red.socket.id,
    //         },
    //       });

    //       playing.push(pair);
    //     });
    //   }
    // }
  })

  //Someone clicked on player in loby to challenge him
  socket.on('challenge', ({ challenger, challenged }) => {
    //ask challenged if he wanna play
    io.to(challenged.socketId).emit('challenged', { challenger })
  })

  //if challenged wanna play
  socket.on('accept challenge', ({ challenger, challenged }) => {
    const bluePlayer = candidates.find(
      candidate => candidate.socket.id === challenger.socketId
    )
    const redPlayer = candidates.find(
      candidate => candidate.socket.id === challenged.socketId
    )

    pairs.push({
      room: uuidv4(),
      moves: 0,
      table: [],
      lastTookId: null,
      blue: bluePlayer,
      red: redPlayer
    })

    //removing players from candidates array
    const bluePlayerIndex = candidates.findIndex(
      candidate => candidate.socket.id === bluePlayer.socketId
    )
    candidates.splice(bluePlayerIndex, 1)
    onlinePlayers.splice(bluePlayerIndex, 1)
    const redPlayerIndex = candidates.findIndex(
      candidate => candidate.socket.id === redPlayer.socketId
    )
    candidates.splice(redPlayerIndex, 1)
    onlinePlayers.splice(redPlayerIndex, 1)

    //update online players in loby
    io.emit('candidates', { candidates: onlinePlayers })

    if (pairs.length > 0) {
      let pair = pairs.pop()
      const blue = pair.blue
      const red = pair.red
      const table = pair.table
      // console.log('pair is this:', pair);
      // console.log('pairs are this:', pairs);

      // ADD PLAYERS TO ROOM
      blue.socket.join(pair.room)
      red.socket.join(pair.room)

      // GET CARDS FROM API
      axios.get(deckUrl).then(resp => {
        deckId = resp.data.deck_id
        pair.deckId = deckId
        let firstRoundCards = resp.data.cards
        const blueCards = firstRoundCards.slice(0, 6)
        const redCards = firstRoundCards.slice(6, 12)
        const tableCards = firstRoundCards.slice(12)
        blue.cards.hand.push(...blueCards)
        blue.cards.opponent = Array(6).fill({ image: `images/red.svg` })
        red.cards.hand.push(...redCards)
        red.cards.opponent = Array(6).fill({ image: `images/blue.svg` })
        table.push(...tableCards)

        // to individual socketid (private message)
        io.to(blue.socket.id).emit('first round', {
          cards: blue.cards.hand,
          table: table,
          onMove: true,
          opponent: { name: red.name, cards: blue.cards.opponent },
          socket: {
            room: pair.room,
            id: blue.socket.id
          }
        })
        // to individual socketid (private message)
        io.to(red.socket.id).emit('first round', {
          cards: red.cards.hand,
          table: table,
          onMove: false,
          opponent: { name: blue.name, cards: red.cards.opponent },
          socket: {
            room: pair.room,
            id: red.socket.id
          }
        })

        playing.push(pair)
        console.log('plaing after frst round', playing)
      })
    }
  })
  //if challenged don't wanna play
  socket.on('refuse challenge', ({ challenger }) => {
    io.to(challenger.socketId).emit('challenge refused')
  })

  socket.on('try to take', ({ selectedCards, playerSocket, card }) => {
    let canTakeCards = gameLogic.takeCards(selectedCards, card)
    let pair = playing.find(pair => pair.room === playerSocket.room)
    let curentPlayer = gameLogic.findPlayer(pair, playerSocket.id)
    pair.moves++

    if (canTakeCards) {
      curentPlayer.cards.taken.push(...selectedCards, card)

      let newTable = gameLogic.filterTable(pair.table, selectedCards)
      let newHand = curentPlayer.cards.hand.filter(
        handCard => handCard.code !== card.code
      )
      pair.table = newTable
      curentPlayer.cards.hand = newHand

      //player take cards
      io.to(playerSocket.id).emit('can take cards', {
        newHand
      })
      pair.lastTookId = playerSocket.id

      //If round over and have tabla
      if (
        newTable.length === 0 &&
        (pair.moves === 12 || pair.moves === 24 || pair.moves === 36)
      ) {
        //get cards for new round
        let url = `https://deckofcardsapi.com/api/deck/${pair.deckId}/draw/?count=12`
        axios.get(url).then(resp => {
          let newCards = resp.data.cards
          const blueCards = newCards.slice(0, 6)
          const redCards = newCards.slice(6, 12)
          pair.blue.cards.hand.push(...blueCards)
          pair.blue.cards.opponent = Array(6).fill({ image: `images/red.svg` })
          pair.red.cards.hand.push(...redCards)
          pair.red.cards.opponent = Array(6).fill({ image: `images/blue.svg` })
          io.to(pair.blue.socket.id).emit('new round', {
            newHand: redCards,
            opponentCards: pair.red.cards.opponent
          })
          io.to(pair.red.socket.id).emit('new round', {
            newHand: redCards,
            opponentCards: pair.red.cards.opponent
          })
        })

        //add tabla to player
        curentPlayer.tabla++
      }

      //If round over and don't have tabla
      if (
        newTable.length > 0 &&
        (pair.moves === 12 || pair.moves === 24 || pair.moves === 36)
      ) {
        //get cards for new round
        let url = `https://deckofcardsapi.com/api/deck/${pair.deckId}/draw/?count=12`
        axios.get(url).then(resp => {
          let newCards = resp.data.cards
          const blueCards = newCards.slice(0, 6)
          const redCards = newCards.slice(6, 12)
          pair.blue.cards.hand.push(...blueCards)
          pair.blue.cards.opponent = Array(6).fill({ image: `images/red.svg` })
          pair.red.cards.hand.push(...redCards)
          pair.red.cards.opponent = Array(6).fill({ image: `images/blue.svg` })
          io.to(pair.blue.socket.id).emit('new round', {
            newHand: blueCards,
            opponentCards: pair.blue.cards.opponent
          })
          io.to(pair.red.socket.id).emit('new round', {
            newHand: redCards,
            opponentCards: pair.red.cards.opponent
          })
        })
      }
      // game over and have tabla
      if (newTable.length === 0 && pair.moves === 48) {
        //add tabla to player
        curentPlayer.tabla++
        pair.table = []
        const winner = gameLogic.findWinner(pair)
        if (winner === 0) {
          io.to(playerSocket.room).emit('game over', { winner: 'it was even!' })
        } else {
          io.to(playerSocket.room).emit('game over', { winner: winner })
        }
        io.to(playerSocket.room).emit('game over', { winner: winner })
      }
      // game over and don't have tabla
      if (newTable.length > 0 && pair.moves === 48) {
        curentPlayer.cards.taken.push(...pair.table)
        pair.table = []
        const winner = gameLogic.findWinner(pair)
        if (winner === 0) {
          io.to(playerSocket.room).emit('game over', { winner: 'it was even!' })
        } else {
          io.to(playerSocket.room).emit('game over', { winner: winner })
        }

        io.to(playerSocket.room).emit('game over', { winner: winner })
      }
      // not round end and have tabla
      if (
        newTable.length === 0 &&
        (pair.moves !== 12 || pair.moves !== 24 || pair.moves !== 36)
      ) {
        //add tabla to player
        curentPlayer.tabla++
      }
      // not round over and dont't have tabla
      if (
        newTable.length > 0 &&
        (pair.moves !== 12 || pair.moves !== 24 || pair.moves !== 36)
      ) {
      }
      console.log('pair.room:', pair.room)
      io.to(pair.blue.socket.id).emit('tabla update', {
        curentTabla: pair.blue.tabla,
        opponentTabla: pair.red.tabla
      })
      io.to(pair.red.socket.id).emit('tabla update', {
        curentTabla: pair.red.tabla,
        opponentTabla: pair.blue.tabla
      })
      io.in(pair.room).emit('change move', { newTable })
    } else {
      let newTable = [...pair.table, card]
      let newHand = curentPlayer.cards.hand.filter(
        handCard => handCard.code !== card.code
      )
      curentPlayer.cards.hand = newHand
      pair.table = newTable
      io.to(playerSocket.id).emit('can not take cards', {
        newHand
      })
      console.log('pair.room:', pair.room)

      //if this was 12th move in round
      if (pair.moves === 12 || pair.moves === 24 || pair.moves === 36) {
        //get cards for new round
        let url = `https://deckofcardsapi.com/api/deck/${pair.deckId}/draw/?count=12`
        axios.get(url).then(resp => {
          let newCards = resp.data.cards
          const blueCards = newCards.slice(0, 6)
          const redCards = newCards.slice(6, 12)
          pair.blue.cards.hand.push(...blueCards)
          pair.blue.cards.opponent = Array(6).fill({ image: `images/red.svg` })
          pair.red.cards.hand.push(...redCards)
          pair.red.cards.opponent = Array(6).fill({ image: `images/blue.svg` })
          io.to(pair.blue.socket.id).emit('new round', {
            newHand: blueCards,
            opponentCards: pair.blue.cards.opponent
          })
          io.to(pair.red.socket.id).emit('new round', {
            newHand: redCards,
            opponentCards: pair.red.cards.opponent
          })
        })
        //if this was 48th move in game(game over)
      } else if (pair.moves === 48) {
        if (pair.lastTookId) {
          lastTookPlayer = gameLogic.findPlayer(pair, pair.lastTookId)
          lastTookPlayer.cards.taken.push(...pair.table)
        }

        pair.table = []
        const winner = gameLogic.findWinner(pair)
        if (winner === 0) {
          io.to(playerSocket.room).emit('game over', { winner: 'it was even!' })
        } else {
          io.to(playerSocket.room).emit('game over', { winner: winner })
        }
      }

      io.in(pair.room).emit('change move', { newTable })
    }
    socket.to(playerSocket.room).emit('opponent made move')
  })

  socket.on('find winner', () => {
    // let pair = gameLogic.filterPairs(playing, player.socket)[0];
  })

  socket.on('sendMessage', ({ message, player }, callback) => {
    const pair = playing.find(pair => pair.room === player.roomId)

    io.to(pair.room).emit('message', { user: player.name, text: message })
  })
}

//new roud cards
function newRound (pair) {
  let url = `https://deckofcardsapi.com/api/deck/${pair.deckId}/draw/?count=12`
  axios.get(url).then(resp => {
    return resp.data.cards
  })
}

server.listen(PORT, () => {
  console.log(`listening on *: ${PORT}`)
})
