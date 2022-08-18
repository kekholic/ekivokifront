import { configureStore } from '@reduxjs/toolkit';

// import { useDispatch } from 'react-redux';
import allGamesSlice from './reducers/allGamesSlice';

// import authReducer from './reducers/authReducer';
import authSlice from './reducers/authSlice';
import gameSlice from './reducers/gameSlice';
import questionSlice from './reducers/questionSlice';

const store = configureStore({
  reducer: {
    user: authSlice,
    game: gameSlice,
    allGame: allGamesSlice,
    question: questionSlice,
  },
});

export default store;
