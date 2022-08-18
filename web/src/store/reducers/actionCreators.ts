/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import $api from '../../http';
import { IData } from '../../models/IData';
import { IDataCreateGame } from '../../models/IDataCreateGame';
import { IDataGame } from '../../models/IDataGame';
import { IInput } from '../../models/IInout';

export const getAuth = createAsyncThunk(
  'auth/getAuth',
  async (data: IInput, thunkAPI) => {
    try {
      const res = await $api.post<IData>(
        `/auth/${data.username ? 'registration' : 'login'}`,
        data,
      );
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка');
    }
  },
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get<IData>(
        `${process.env.REACT_APP_API_URL}/auth/refresh`,
        {
          withCredentials: true,
        },
      );
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка');
    }
  },
);

export const getLogout = createAsyncThunk(
  'auth/getLogOut',
  async (_, thunkAPI) => {
    try {
      const res = await $api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return res.status;
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка');
    }
  },
);

export const createGame = createAsyncThunk(
  'game/createGame',
  async (data: IDataCreateGame, thunkAPI) => {
    try {
      const res = await $api.post<IDataGame>('/game', data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const getGame = createAsyncThunk(
  'allGame/getGame',
  async (_, thunkAPI) => {
    try {
      const res = await $api.get('/game/search');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка');
    }
  },
);

export const incrementCountPlayers = createAsyncThunk(
  'game/incrementCountPlayers',
  async (data, thunkAPI) => {
    try {
      const res = await $api.patch('/game/add', data); // подготовить к отправке обьект с данными { gameId, userData add:true}
      return res.data; // с бэка обьект типа{username:xxx, userId:x}
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка');
    }
  },
);

export const decrementCountPlayers = createAsyncThunk(
  'game/decrementCountPlayers',
  async (data, thunkAPI) => {
    try {
      const res = await $api.patch('/game/del', data); // подготовить к отправке обьект с данными { gameId, userData add:true}
      return res.data; // с бэка статус
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка');
    }
  },
);

export const startGame = createAsyncThunk(
  'game/startGame',
  async (data, thunkAPI) => {
    try {
      const res = await $api.patch('/game/start', data); // подготовить к отправке обьект с данными { gameId,ipanding: false}
      return res.data; // с бэка статус
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка');
    }
  },
);

export const endGame = createAsyncThunk(
  'game/endGame',
  async (data, thunkAPI) => {
    try {
      const res = await $api.patch('/game/end', data); // подготовить к отправке обьект с данными { gameId, ipanding: false}
      return res.data; // с бэка статус
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка');
    }
  },
);

export const playersConnection = createAsyncThunk(
  'game/playersConnection',
  async (data, thunkAPI) => {
    try {
      const res = await $api.post('/game/connections', data); // подготовить к отправке обьект с данными { gameId, user}
      return res.data; // с бэка {new game}
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка');
    }
  },
);

export const getCard = createAsyncThunk(
  'question/getCard',
  async (data, thunkAPI) => {
    try {
      const res = await $api.post('/question', data); // подготовить к отправке обьект с данными { question.id }
      // console.log(res.data, 'getCard****************************');
      return res.data; // {question} из бд
    } catch (err) {
      return thunkAPI.rejectWithValue('Ошибка');
    }
  },
);
