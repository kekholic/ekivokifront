import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

function PublicRoutes() {
  const { isAuth } = useAppSelector((store) => store.user);

  return isAuth ? <Navigate to="/game/start" /> : <Outlet />;
}

export default PublicRoutes;
