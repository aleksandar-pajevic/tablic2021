import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  opponent: null,
  onMove: null,
  cards: {
    selected: [],
    hand: null,
    taken: null,
    table: [],
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
      state.opponent = action.payload;
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
} = playerSlice.actions;

export default playerSlice.reducer;

// state.cards.selected = state.cards.selected.filter(
//   (card) => card.code !== action.payload
// );
// state.cards.selected.push(action.payload);
