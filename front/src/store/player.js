import { createSlice } from '@reduxjs/toolkit';
import { socket } from '../socket';

const initialState = {
  name: '',
  onMove: null,
  socket: null,
  cards: {
    selected: [],
    hand: null,
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
      state.opponent.cards.hand = action.payload.opponent.cards;
      state.onMove = action.payload.onMove;
      state.socket = action.payload.socket;
    },
    newRound: (state, action) => {
      state.cards.hand = action.payload.newHand;
      state.opponent.cards.hand = action.payload.opponentCards;
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
      state.cards.selected = state.cards.selected.filter(
        (card) => card.code !== action.payload.code
      );
    },
    trowToTable: (state, action) => {
      state.cards.table.push(action.payload);
      state.cards.selected = [];
    },
    setTable: (state, action) => {
      state.cards.table = action.payload;
    },
    setHand: (state, action) => {
      state.cards.hand = action.payload;
      state.cards.selected = [];
    },
    tryToTake: (state, action) => {
      socket.emit('try to take', {
        selectedCards: state.cards.selected,
        playerSocket: state.socket,
        card: action.payload,
      });
      state.cards.selected = [];
    },
    madeTabla: (state, action) => {
      state.tabla++;
    },
    removeOpponentCard: (state, action) => {
      state.opponent.cards.hand.splice(-1);
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
  removeOpponentCard,
  newRound,
} = playerSlice.actions;

export default playerSlice.reducer;

// state.cards.selected = state.cards.selected.filter(
//   (card) => card.code !== action.payload
// );
// state.cards.selected.push(action.payload);
