/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGame } from '../../models/IGame';
import { getGame } from './actionCreators';

interface GameState {
  games: Array<IGame>;
  isLoading: boolean;
  error: string;
}

const initialState: GameState = {
  games: [],
  isLoading: false,
  error: '',
};

export const allGamesSlice = createSlice({
  name: 'allGame',
  initialState,
  reducers: {},
  extraReducers: {
    // search all game
    [getGame.fulfilled.type]: (state, action: PayloadAction<IGame[]>) => {
      state.isLoading = false;
      state.error = '';
      state.games = action.payload;
    },
    [getGame.pending.type]: (state) => {
      state.isLoading = true;
    },
    [getGame.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default allGamesSlice.reducer;
