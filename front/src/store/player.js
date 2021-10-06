import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  opponent: null,
  cards: {
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
  },
});

export const {
  addPlayerName,
  addPlayerOpponent,
  addPlayerCards,
  addTableCards,
} = playerSlice.actions;

export default playerSlice.reducer;
