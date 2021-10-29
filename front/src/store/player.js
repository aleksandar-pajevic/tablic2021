import { createSlice } from '@reduxjs/toolkit';
import { socket } from '../socket';

const initialState = {
  name: '',
  onMove: null,
  socket: null,
  tabla: 0,
  cards: {
    selected: [],

    hand: null,
    taken: [],
    table: [],
  },
  opponent: {
    name: null,
    cards: {
      hand: null,
    },
  },
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    addPlayerName: (state, action) => {
      state.name = action.payload;
    },
    initializeGame: (state, action) => {
      state.cards.hand = action.payload.cards;
      state.cards.table = action.payload.table;
      state.opponent.name = action.payload.opponent.name;
      state.opponent.cards.hand = Array(6).fill({
        image: `images/${action.payload.opponent.color}.svg`,
      });
      state.onMove = action.payload.onMove;
      state.socket = action.payload.socket;
    },
    changeOnMove: (state, action) => {
      state.onMove = !state.onMove;
    },
    selectCard: (state, action) => {
      //add card
      state.cards.selected.push(action.payload);
    },
    unselectCard: (state, action) => {
      //remove card
      console.log('removing card');
      state.cards.selected = state.cards.selected.filter(
        (card) => card.code !== action.payload.code
      );
    },
    trowToTable: (state, action) => {
      state.cards.table.push(action.payload);
      state.cards.selected = [];
    },
    takeCards: (state, action) => {
      // console.log('payload from take cards:', action.payload);
      state.cards.taken.push(...action.payload.selectedCards);
      state.cards.taken.push(action.payload.card);

      state.cards.selected = [];
    },
    setTable: (state, action) => {
      state.cards.table = action.payload;
    },
    setHand: (state, action) => {
      state.cards.hand = action.payload;
    },
    tryToTake: (state, action) => {
      socket.emit('try to take', {
        selectedCards: state.cards.selected,
        handCards: state.cards.hand,
        tableCards: state.cards.table,
        playerSocket: state.socket,
        card: action.payload,
      });
      state.cards.selected = [];
    },
    madeTabla: (state, action) => {
      state.tabla++;
    },
    lastTook: (state, action) => {
      state.cards.taken.push(...action.payload);
    },
    findWinner: (state, action) => {
      socket.emit('find winner', state);
    },
  },
});

export const {
  addPlayerName,
  selectCard,
  unselectCard,
  initializeGame,
  changeOnMove,
  trowToTable,
  takeCards,
  setTable,
  setHand,
  tryToTake,
  madeTabla,
  lastTook,
  findWinner,
} = playerSlice.actions;

export default playerSlice.reducer;

// state.cards.selected = state.cards.selected.filter(
//   (card) => card.code !== action.payload
// );
// state.cards.selected.push(action.payload);
