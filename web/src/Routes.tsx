import React, { useEffect } from 'react';
import {
  Navigate, Route, Routes,
} from 'react-router-dom';
import Activate from './components/Auth/Activate/Activate';
import Login from './components/Auth/Login/Login';
import Registration from './components/Auth/Registration/Registration';
import Canvas from './components/Canvas/Canvas';
import GameInit from './components/GameInit/GameInit';
import GameMain from './components/GameMain/GameMain';
import GameList from './components/GameStart/GameList/GameList';
import GameStart from './components/GameStart/GameStart';
import InnerContent from './components/InnerContent/InnerContent';
import PersonalPage from './components/PersonalPage/PersonalPage';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes';
import PublicRoutes from './components/PublicRoutes/PublicRoutes';
import { useAppDispatch } from './hooks/redux';
import { getInit } from './store/reducers/authSlice';

function MainRoutes() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      const user = localStorage.getItem('user') || `{
        "appruvedMail": false,
        "email": '',
        "id": 0,
        "username": '',
      }`;
      dispatch(getInit(JSON.parse(user)));
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoutes />}>
        <Route path="/" element={<InnerContent />}>
          <Route path="/" element={<Navigate replace to="/game/start" />} />
          <Route path="/game/start" element={<GameStart />}>
            <Route path="/game/start/new" element={<GameInit />} />
            <Route path="/game/start/list" element={<GameList />} />
          </Route>
          <Route path="/personal" element={<PersonalPage />} />
          <Route path="/canvas" element={<Canvas roomID={undefined} canSendMessage={false} />} />
          <Route path="/game/:id" element={<GameMain />} />
        </Route>
      </Route>
      <Route path="/register" element={<PublicRoutes />}>
        <Route path="/register" element={<Registration />} />
      </Route>
      <Route path="/login" element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/logout" />
      <Route path="/activate/:link" element={<Activate />} />
    </Routes>
  );
}

export default MainRoutes;
