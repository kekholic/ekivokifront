/* eslint-disable comma-dangle */
// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { connectedToTheGame } from '../../../lib/game/gameUpdate';
import { IGame } from '../../../models/IGame';
import socket from '../../../socket';
import ACTIONS from '../../../actions/wsActions';
import {
  getGame,
} from '../../../store/reducers/actionCreators';
import style from './GameList.module.css';
import GAME_STATUS from '../../../actions/gameStatus';

export default function GameList() {
  const { games } = useAppSelector((store) => store.allGame);
  const user = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // TODO:
  // запрос с базы данных активных игр!
  useEffect(() => {
    dispatch(getGame());
  }, []);

  const [activeLobby, setActiveLobby] = useState([]);

  useEffect(() => {
    socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] }) => {
      setActiveLobby(rooms);
    });
  }, []);

  useEffect(() => {
    socket.emit(ACTIONS.SHARE_ROOMS);
  }, []);

  const handleClick = (gameInner: IGame) => {
    connectedToTheGame(String(gameInner.id), user.user);
    navigate(`/game/${gameInner.id}`);
  };

  return (
    <div className={style.listContent}>
      {
      activeLobby
        ? activeLobby.map((gameInner: IGame) => (
          <div className={style.listItem} key={gameInner.id}>
            <span className={style.listTitle}>{gameInner.title}</span>
            <span className={style.listCount}>
              {gameInner.countPlayers}
              /
              {gameInner.maxPlayers}
            </span>
            <input className={style.listInput} type="text" name="password" placeholder="Введите пароль" />
            <button className={style.listSubmit} type="submit" onClick={() => handleClick(gameInner)}>Выбрать игру</button>
          </div>
        ))
        : (
          <span className={style.listError}>
            Нет открытых лобби,
            {' '}
            <Link className={style.listErrorLink} to="./../new">создайте</Link>
            {' '}
            лобби.
          </span>
        )
    }
      {
      games.length
        ? games.filter((game) => game.status === GAME_STATUS.CREATED).map((gameInner: IGame) => (
          <div className={style.listItem} key={gameInner.id}>
            <span className={style.listTitle}>{gameInner.title}</span>
            <span className={style.listCount}>
              {gameInner.countPlayers}
              /
              {gameInner.maxPlayers}

            </span>
            <input className={style.listInput} type="text" name="password" placeholder="Введите пароль" />
            <button className={style.listSubmit} type="submit" onClick={() => handleClick(gameInner)}>Выбрать игру</button>
          </div>
        ))
        : (
          <span className={style.listError}>
            Нет открытых лобби,
            {' '}
            <Link className={style.listErrorLink} to="./../new">создайте</Link>
            {' '}
            лобби.
          </span>
        )
    }
    </div>
  );
}
