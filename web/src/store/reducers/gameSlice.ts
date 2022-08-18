/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import GAME_STATUS from '../../actions/gameStatus';
import { IGame } from '../../models/IGame';
import { IQuestions } from '../../models/IQuestions';
import {
  createGame,
  decrementCountPlayers,
  endGame,
  incrementCountPlayers,
  playersConnection,
  startGame,
} from './actionCreators';

export interface GameState {
  game: IGame;
  questions: IQuestions;
  isCanvas: boolean;
  playersPriority: Array<IplayersPriority>;
  isHost: number;
  progress: Iprogress;
  isLoading: boolean;
  error: string;
  videoComponents: IVideoComponents;
}

interface IVideoComponents {
  [key: string]: number;
}
export interface IplayersPriority {
  userId: number;
  username: string;
}
interface Iprogress {
  [key: string]: number;
}
export const initialState: GameState = {
  game: {
    id: 0,
    title: '',
    password: '',
    countPlayers: 0,
    maxPlayers: 6,
    status: '',
  },
  questions: {
    list: [
      {
        questionForHost: '',
        questionForPlayers: '',
        theme: '',
        task: '',
        word: '',
        exceptions: '',
        id: 0,
        type: 0,
      },
    ],
    current: 1,
  },
  videoComponents: {},
  isCanvas: false,
  playersPriority: [],
  isHost: -1,
  progress: {},
  isLoading: false,
  error: '',
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    updateGameState(state, action: PayloadAction<GameState>) {
      // // console.log(action.payload, 'ACTION PAYLOAD');

      state.game = { ...action.payload.game };
      state.questions.list = [...action.payload.questions.list];
      state.questions.current = action.payload.questions.current;
      state.isCanvas = false;
      state.playersPriority = action.payload.playersPriority;
      state.progress = action.payload.progress;
      state.isHost = action.payload.isHost;
      state.isLoading = false;
      state.error = '';
      state.videoComponents = { ...action.payload.videoComponents };
    },
    hostLeaveUpdate(state, action: PayloadAction<any>) {
      // // console.log(action.payload, 'ACTION PAYLOAD');

      state.game = { ...action.payload.game.game };
      state.questions.list = [...action.payload.game.questions.list];
      state.questions.current = action.payload.game.questions.current;
      state.isCanvas = false;
      state.playersPriority = action.payload.game.playersPriority.filter(
        (el: IplayersPriority) => el.userId !== action.payload.userId,
      );
      state.progress = action.payload.game.progress;
      state.isHost = action.payload.isHost;
      state.isLoading = false;
      state.error = '';
    },
    playersLeaveUpdate(state, action: PayloadAction<any>) {
      // // console.log(action.payload, 'ACTION PAYLOAD');
      state.playersPriority = state.playersPriority.filter(
        (el) => el.userId !== action.payload.userId,
      );
      state.isLoading = false;
      state.error = '';
    },
    playerJoinedUpdateState(state, action: PayloadAction<any>) {
      state.game.countPlayers += 1;
      // // console.log('action: ', action.payload);
      const temp = {
        username: action.payload.username,
        userId: action.payload.id,
      };
      state.playersPriority.push(temp);
      state.isHost = state.isHost > action.payload.id ? action.payload.id : state.isHost;
      // eslint-disable-next-line max-len
      if (state.game.countPlayers === state.game.maxPlayers) {
        state.game.status = GAME_STATUS.IN_PROGRESS;
      }
      state.videoComponents = {
        ...state.videoComponents,
        [action.payload.socket]: action.payload.id,
      };
      // state.game.isPanding = state.game.countPlayers !== state.game.maxPlayers;
      // state.game.status = action.payload.status;
    },
    correctAnswer(state, action: PayloadAction<any>) {
      state.progress = {
        ...state.progress,
        [action.payload.progress.userId]: action.payload.progress.score,
        [action.payload.progressHost.userId]: action.payload.progressHost.score,
      };
      state.isHost = action.payload.isHost;
      state.questions.current = action.payload.current;
    },
    setVideoComponents(state, action: PayloadAction<any>) {
      state.videoComponents = { ...state.videoComponents, ...action.payload };
    },
    reconnect(state, action: PayloadAction<any>) {
      let objKey = '';
      for (const key in state.videoComponents) {
        if (state.videoComponents[key] === action.payload.user.id) {
          objKey = key;
          break;
        }
      }
      // console.log('ALLO VBLYAT', action.payload);
      delete state.videoComponents[objKey];
      state.videoComponents = {
        ...state.videoComponents,
        [action.payload.user.socket]: action.payload.user.id,
      };
    },
  },
  extraReducers: {
    // register new game
    [createGame.fulfilled.type]: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = '';
      state.game = action.payload.game;
      state.game.status = action.payload.status;
      state.isHost = action.payload.user.userId;
      state.questions.list = [...action.payload.questions];
      state.playersPriority.push(action.payload.user);
      state.game.countPlayers = 1;
    },
    [createGame.pending.type]: (state) => {
      state.isLoading = true;
    },
    [createGame.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [incrementCountPlayers.fulfilled.type]: (
      state,
      action: PayloadAction<IplayersPriority>,
    ) => {
      state.isLoading = false;
      state.error = '';
      state.game.countPlayers += 1;
      state.playersPriority.push(action.payload);
    },
    [incrementCountPlayers.pending.type]: (state) => {
      state.isLoading = true;
    },
    [incrementCountPlayers.rejected.type]: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [decrementCountPlayers.fulfilled.type]: (state) => {
      state.isLoading = false;
      state.error = '';
      state.game.countPlayers -= 1;
      state.playersPriority.pop();
    },
    [decrementCountPlayers.pending.type]: (state) => {
      state.isLoading = true;
    },
    [decrementCountPlayers.rejected.type]: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [startGame.fulfilled.type]: (state) => {
      state.isLoading = false;
      state.error = '';
      // state.game.isPanding = false;
    },
    [startGame.pending.type]: (state) => {
      state.isLoading = true;
    },
    [startGame.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [endGame.fulfilled.type]: (state) => {
      state.isLoading = false;
      state.error = '';
      // state.game.isdone = true;
    },
    [endGame.pending.type]: (state) => {
      state.isLoading = true;
    },
    [endGame.rejected.type]: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    [playersConnection.fulfilled.type]: (
      state,
      action: PayloadAction<GameState>,
    ) => {
      state.game = action.payload.game;
      state.playersPriority = action.payload.playersPriority;
      state.isHost = action.payload.isHost;
      state.error = '';
      state.isLoading = false;
    },
    [playersConnection.pending.type]: (state) => {
      state.isLoading = true;
    },
    [playersConnection.rejected.type]: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.isLoading = false;

      state.error = action.payload;
    },
    // 1 изменять поле игроков:done
    // 2 отбновлять данные в бд:done
    // 3 обновлять статус игры началась ждем игроков кончилась
    // нажал вступить в игру у тебя обновился стейт с игрой
  },
});
export const {
  updateGameState,
  playerJoinedUpdateState,
  correctAnswer,
  hostLeaveUpdate,
  playersLeaveUpdate,
  setVideoComponents,
  reconnect,
} = gameSlice.actions;

export default gameSlice.reducer;
