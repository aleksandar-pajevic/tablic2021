import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  id: '',
  cards: {
    hand: [],
    taken: [],
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
  },
});

export const { addPlayerName, addPlayerId } = playerSlice.actions;

export default playerSlice.reducer;
