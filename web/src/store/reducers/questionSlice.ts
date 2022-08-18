/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCard } from './actionCreators';

export interface QuestionState {
  id: Number;
  collectionId: Number | null;
  questionForPlayers: String;
  questionForHost: String;
  type?: Number | null;
  isLoading: boolean;
  error: string;
}

const initialState: QuestionState = {
  id: 1,
  collectionId: null,
  questionForPlayers: '',
  questionForHost: '',
  type: null,
  isLoading: false,
  error: '',
};

export const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    newQuestionState(state, action: PayloadAction<QuestionState>) {
      state.id = action.payload.id;
      state.collectionId = action.payload.collectionId;
      state.questionForPlayers = action.payload.questionForPlayers;
      state.questionForHost = action.payload.questionForHost;
      state.type = action.payload.type;
      state.isLoading = false;
      state.error = '';
    },
  },
  extraReducers: {
    // register and login reducers
    [getCard.fulfilled.type]: (state, action: PayloadAction<any>) => {
      // console.log('action: ', action.payload);
      state.id = action.payload.id;
      state.collectionId = action.payload.collectionId;
      state.questionForPlayers = action.payload.questionForPlayers;
      state.questionForHost = action.payload.questionForHost;
      state.type = action.payload.type;
      state.isLoading = false;
      state.error = '';
    },
    [getCard.pending.type]: (state) => {
      state.isLoading = true;
    },
    [getCard.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { newQuestionState } = questionSlice.actions;

export default questionSlice.reducer;
