/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../models/IUser';
import { checkAuth, getAuth, getLogout } from './actionCreators';

interface UserState {
  user: IUser;
  isAuth: boolean;
  isLoading: boolean;
  error: string;
  canSendMessage: boolean;
}

const initialState: UserState = {
  user: {
    appruvedMail: false,
    email: '',
    id: 0,
    username: '',
  },
  canSendMessage: false,
  isAuth: false,
  isLoading: false,
  error: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getInit(state, action: PayloadAction<IUser>) {
      state.isLoading = false;
      state.isAuth = true;
      state.error = '';
      state.user = { ...action.payload };
    },
    updateCanSendStatus(state, action: PayloadAction<boolean>) {
      state.canSendMessage = action.payload;
    },
  },
  extraReducers: {
    // register and login reducers
    [getAuth.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
      state.isLoading = false;
      state.error = '';
      state.user = action.payload;
      state.isAuth = true;
    },
    [getAuth.pending.type]: (state) => {
      state.isLoading = true;
    },
    [getAuth.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // logout reducers
    [getLogout.fulfilled.type]: (state) => {
      state.isLoading = false;
      state.user = initialState.user;
      state.error = '';
      state.isAuth = initialState.isAuth;
    },
    [getLogout.pending.type]: (state) => {
      state.isLoading = true;
    },
    [getLogout.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // refresh logic
    [checkAuth.fulfilled.type]: (state, action: PayloadAction<IUser>) => {
      state.isLoading = false;
      state.error = '';
      state.user = action.payload;
      state.isAuth = true;
    },
    [checkAuth.pending.type]: (state) => {
      state.isLoading = true;
    },
    [checkAuth.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { getInit, updateCanSendStatus } = authSlice.actions;
