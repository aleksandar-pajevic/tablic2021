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
      hand: [],
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
    addPlayerCards: (state, action) => {
      state.cards.hand = action.payload;
    },
    addTableCards: (state, action) => {
      state.cards.table = action.payload;
    },
    addPlayerOpponent: (state, action) => {
      state.opponent.name = action.payload.name;
      state.opponent.cards.hand = [
        {
          image: `images/${action.payload.color}.svg`,
        },
        {
          image: `images/${action.payload.color}.svg`,
        },
        {
          image: `images/${action.payload.color}.svg`,
        },
        {
          image: `images/${action.payload.color}.svg`,
        },
        {
          image: `images/${action.payload.color}.svg`,
        },
        {
          image: `images/${action.payload.color}.svg`,
        },
      ];
    },
    setPlayerMove: (state, action) => {
      state.onMove = action.payload;
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
  addPlayerOpponent,
  addPlayerCards,
  addTableCards,
  setPlayerMove,
  selectCard,
  unselectCard,
  tryTake,
} = playerSlice.actions;

export default playerSlice.reducer;

// state.cards.selected = state.cards.selected.filter(
//   (card) => card.code !== action.payload
// );
// state.cards.selected.push(action.payload);
