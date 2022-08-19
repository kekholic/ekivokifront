/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { getLogout } from '../../store/reducers/actionCreators';
import style from './NavBar.module.css';

export default function NavBar() {
  const { isAuth } = useAppSelector((store) => store.user);
  const { game } = useAppSelector((store) => store.game);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const logoutHendler = () => {
    dispatch(getLogout());
  };

  return (
    <div className={style.header__container}>
      <div className={style.header__row}>
        <Link to="/" className={style.header_logo}>
          ЭКИВОКИ
        </Link>
        <div className={style.haeder_menu}>
          {isAuth ? (
            game.id ? (
              <>
                <button
                  type="submit"
                  onClick={() => {
                    navigate('/');
                    navigate(0);
                  }}
                  className={style.link}
                >
                  Выйти из игры
                </button>
                <Link className={style.link} to="/rules">
                  Правила
                </Link>
                <Link className={style.link} to="/game/start">
                  Начать
                </Link>
                <button
                  type="submit"
                  className={style.link}
                  onClick={() => logoutHendler()}
                >
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link className={style.link} to="/rules">
                  Правила
                </Link>
                <Link className={style.link} to="/game/start">
                  Начать
                </Link>
                <button
                  type="submit"
                  className={style.link}
                  onClick={() => logoutHendler()}
                >
                  Выйти
                </button>
              </>
            )
          ) : (
            <>
              <Link className={style.link} to="/register">
                Зарегистрироваться
              </Link>
              <Link className={style.link} to="/login">
                Войти
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
