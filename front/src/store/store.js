import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './player';
import candidatesReducer from './candidates';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    candidates: candidatesReducer,
  },
});
