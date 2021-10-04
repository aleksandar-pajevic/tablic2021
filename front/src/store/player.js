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
    addPlayer: (state, action) => {
      state.name = action.payload;
    },
  },
});

export const { addPlayer } = playerSlice.actions;

export default playerSlice.reducer;
