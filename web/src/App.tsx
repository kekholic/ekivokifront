import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

import NavBar from './components/NavBar/NavBar';
import { useAppDispatch } from './hooks/redux';

import MainRoutes from './Routes';
import { checkAuth } from './store/reducers/actionCreators';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(checkAuth());
    }
  }, []);

  return (
    <BrowserRouter>
      <header className="header">
        <NavBar />
      </header>
      <main className="main">
        <div className="container">
          <MainRoutes />
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
