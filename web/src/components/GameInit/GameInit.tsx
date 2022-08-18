/* eslint-disable comma-dangle */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { createGame } from '../../store/reducers/actionCreators';
import { updateCanSendStatus } from '../../store/reducers/authSlice';
import style from './GameInit.module.css';

export default function GameInit() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const game = useAppSelector((store) => store.game);
  const user = useAppSelector((store) => store.user);

  const [input, setInput] = useState({
    title: '',
    password: '',
    maxPlayers: 6,
    countPlayers: 0,
  });

  const submitHandler = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      title: { value: string };
      password: { value: string };
      maxPlayers?: { value: number | undefined };
    };
    const title = target.title.value;
    const password = target.password.value;
    const maxPlayers = target.maxPlayers?.value || 6;
    setInput({
      title,
      password,
      maxPlayers,
      countPlayers: 1,
    });
    dispatch(updateCanSendStatus(true));
  };

  useEffect(() => {
    if (input.title) {
      dispatch(createGame({
        ...input, ...user.user,
      }));
    }
  }, [input]);

  useEffect(() => {
    if (game.game.id && !game.isLoading) {
      navigate(`/game/${game.game.id}`);
    }
  }, [game]);

  return (
    <form className={style.settingsForm} onSubmit={(e) => { submitHandler(e); }}>
      <h1 className={style.settingsTitle}>Создать лобби</h1>
      <ul className={style.settingsUl}>
        <li className={style.settingsLi}>1) Введите название игры</li>
        <li className={style.settingsLi}>2) Введите пароль игры</li>
        <li className={style.settingsLi}>3) Выберите количество участников</li>
        <li className={style.settingsLi}>4) Начинайте играть!</li>
      </ul>

      <div className={style.settingsFormDiv}>
        <input className={style.settingsInput} type="text" name="title" placeholder="Название лобби" />
        <input className={style.settingsInput} type="text" name="password" placeholder="Пароль лобби" />
        <div className={style.settingsSelect}>
          <select name="maxPlayers">
            <option selected disabled>Коль-во игроков</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
      </div>
      <button className={style.settingsSubmit} type="submit">создать игру</button>
    </form>
  );
}
