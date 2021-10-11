import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  onMove: null,
  cards: {
    selected: [],
    hand: null,
    taken: null,
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
    // addPlayer: (state, action) => [...state, action.payload],
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
    },
    selectCard: (state, action) => {
      console.log('adding card');
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
    tryTake: (state, action) => {
      console.log('Try take with:', action.payload);
    },
  },
});

export const {
  addPlayerName,
  selectCard,
  unselectCard,
  tryTake,
  initializeGame,
} = playerSlice.actions;

export default playerSlice.reducer;

// state.cards.selected = state.cards.selected.filter(
//   (card) => card.code !== action.payload
// );
// state.cards.selected.push(action.payload);
