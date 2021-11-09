import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  onlinePlayers: []
};

export const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers:{
    updateCandidates: (state, action) =>{
      console.log('updating candidates', action.payload);
      state.onlinePlayers = action.payload;
    },


  }
})

export const{
  updateCandidates,
} = candidatesSlice.actions;

export default candidatesSlice.reducer;