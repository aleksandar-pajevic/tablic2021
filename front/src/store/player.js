import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  id: '',
  cards: {
    hand: [],
    taken: [],
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
    addPlayerId: (state, action) => {
      state.id = action.payload;
    },
    addPlayerCards: (state, action) => {
      state.cards.hand.push(action.payload);
    },
    addTableCards: (state, action) => {
      state.cards.table.push(action.payload);
    },
  },
});

export const { addPlayerName, addPlayerId, addPlayerCards, addTableCards } =
  playerSlice.actions;

export default playerSlice.reducer;
