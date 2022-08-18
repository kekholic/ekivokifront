/* eslint-disable no-nested-ternary */
import React from 'react';
import { useAppSelector } from '../../../hooks/redux';
import Canvas from '../../Canvas/Canvas';
import style from './CardForHost.module.css';

interface Props {
  findIndex: Function,
  id: string | undefined,
}

export default function CardForHost({ findIndex, id }: Props) {
  const { game } = useAppSelector((store) => store);
  const user = useAppSelector((store) => store.user);
  return (
    <div className={style.hostCardContainer}>
      <div className={style.hostCardItem}>
        <div className={style.hostCardHeader}>
          <p>Задание ведущему:</p>
          <p className={style.hostCardTask}>{game.questions.list[findIndex()].task}</p>
        </div>
        <div className={style.hostCardContent}>
          <p className={style.hostQuastion}>{game.questions.list[findIndex()].questionForHost}</p>
          <div className={style.hostCardTheme}>
            <p className={style.hostWord}>{game.questions.list[findIndex()].word}</p>
            <p>
              Тема:
              {' '}
              {game.questions.list[findIndex()].theme}
            </p>
          </div>
          {game.questions.list[findIndex()].exceptions
          && <p className={style.hostExceptions}>{game.questions.list[findIndex()].exceptions}</p>}
          {game.questions.list[findIndex()].type === 3 && (
            <Canvas roomID={id} canSendMessage={user.canSendMessage} />
          )}
        </div>
        <div className={style.hostCardFooter}>
          {game.questions.list[findIndex()].type === 6
            ? (
              <>
                <svg width="44" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="16" y="16" width="12" height="12" rx="3" fill="#549E95" />
                  <rect x="32" width="12" height="12" rx="3" fill="#549E95" />
                  <rect x="32" y="16" width="12" height="12" rx="3" fill="#549E95" />
                  <rect x="16" width="12" height="12" rx="3" fill="#549E95" />
                  <rect width="12" height="12" rx="3" fill="#549E95" />
                  <rect y="16" width="12" height="12" rx="3" fill="#549E95" />
                </svg>
                <p> На шесть клеток вперед за верный овтет</p>
              </>
            )
            : game.questions.list[findIndex()].type === 5
              ? (
                <>
                  <svg width="44" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="16" y="16" width="12" height="12" rx="3" fill="#549E95" />
                    <rect x="32" width="12" height="12" rx="3" fill="#549E95" />
                    <rect x="32" y="16" width="12" height="12" rx="3" fill="#549E95" />
                    <rect x="16" width="12" height="12" rx="3" fill="#549E95" />
                    <rect y="8" width="12" height="12" rx="3" fill="#549E95" />
                  </svg>
                  <p>На пять клеток вперед за верный ответ</p>
                </>
              )
              : game.questions.list[findIndex()].type === 4
                ? (
                  <>
                    <svg width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect y="16" width="12" height="12" rx="3" fill="#549E95" />
                      <rect x="16" width="12" height="12" rx="3" fill="#549E95" />
                      <rect x="16" y="16" width="12" height="12" rx="3" fill="#549E95" />
                      <rect width="12" height="12" rx="3" fill="#549E95" />
                    </svg>
                    <p>На четыре клетки вперед за верный ответ</p>
                  </>
                )
                : game.questions.list[findIndex()].type === 3
                  ? (
                    <>
                      <svg width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect y="16" width="12" height="12" rx="3" fill="#549E95" />
                        <rect x="8" width="12" height="12" rx="3" fill="#549E95" />
                        <rect x="16" y="16" width="12" height="12" rx="3" fill="#549E95" />
                      </svg>
                      <p>На три клетки вперед за верный ответ</p>
                    </>
                  )
                  : game.questions.list[findIndex()].type === 2
                    ? (
                      <>
                        <svg width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect y="16" width="12" height="12" rx="3" fill="#549E95" />
                          <rect x="16" width="12" height="12" rx="3" fill="#549E95" />
                        </svg>
                        <p>На две клетки вперед за верный ответ</p>
                      </>
                    )
                    : game.questions.list[findIndex()].type === 1
                      ? (
                        <>
                          <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="12" height="12" rx="3" fill="#549E95" /></svg>
                          <p>На одну клетку вперед за верный ответ</p>
                        </>
                      )
                      : <p>net logo</p>}
        </div>
      </div>
    </div>
  );
}
