/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/require-default-props */
import React, { Dispatch, ReactElement, useEffect } from 'react';
import style from './ModalAnswerCard.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { modalCloseNo } from '../../lib/game/gameUpdate';
import { correctAnswer } from '../../store/reducers/gameSlice';

interface IProps {
  modal: IModal;
  setModal: Dispatch<IModal>;
  findIndex: Function;
  setWinner: Dispatch<Iwinner>;
}
interface IModal {
  visible: boolean;
  username: string;
  userId: number;
}

interface Iwinner {
  name: string;
  score: number;
  win: boolean;
}

export default function ModalAnswerCard(props: IProps): ReactElement {
  const {
    setModal, modal, findIndex, setWinner,
  } = props;

  const dispatch = useAppDispatch();

  const { game } = useAppSelector((store) => store);
  const user = useAppSelector((store) => store.user);

  const noHandler = () => {
    setModal({
      visible: false,
      username: '',
      userId: 0,
    });
    modalCloseNo(String(game.game.id));
  };
  const yesHandler = () => {
    let current = 0;
    for (let i = 0; i < game.questions.list.length; i++) {
      if (game.questions.list[i].id === game.questions.current) {
        current = game.questions.list[i + 1]?.id || game.questions.list[0].id;
      }
    }

    let isHost = 0;

    for (let i = 0; i < game.playersPriority.length; i++) {
      if (game.playersPriority[i].userId === game.isHost) {
        isHost = game.playersPriority[i + 1]?.userId
          || game.playersPriority[0]?.userId;
      }
    }
    const progress = {
      userId: modal.userId,
      score: game.progress[modal.userId] ? game.progress[modal.userId] : 0,
    };

    const progressHost = {
      userId: user.user.id,
      score: game.progress[user.user.id] ? game.progress[user.user.id] : 0,
    };
    progressHost.score += game.questions.list[findIndex()].type;
    progress.score += game.questions.list[findIndex()].type;

    if (progressHost.score >= 44) {
      // console.log('progressHost.score : ', progressHost.score);
      setWinner({
        name: user.user.username || '',
        score: progressHost.score + game.questions.list[findIndex()].type,
        win: true,
      });
    } else if (progress.score >= 44) {
      // console.log('progress.score: ', progress.score);
      setWinner({
        name: modal.username,
        score: progress.score + game.questions.list[findIndex()].type,
        win: true,
      });
    }
    // game.questions.list[findIndex()].type;
    // game.questions.list[findIndex()].type;

    dispatch(
      correctAnswer({
        progress,
        progressHost,
        isHost,
        current,
      }),
    );

    setModal({
      visible: false,
      username: '',
      userId: 0,
    });
    modalCloseNo(String(game.game.id));
  };

  useEffect(() => {
    // console.log('rerender!!!');
  }, [modal.visible]);

  return (
    <div
      className={
        modal.visible ? `${style.modal} ${style.modalActive}` : `${style.modal}`
      }
    >
      <div
        className={
          modal.visible
            ? `${style.modalContent} ${style.modalContentActive}`
            : `${style.modalContent}`
        }
        onClick={(e) => e.stopPropagation()}
      >
        {user.canSendMessage ? (
          <div className={style.answerContainer}>
            <p className={style.answerText}>
              <span className={style.answerUserName}>{modal.username}</span>
              {' '}
              верно ответил на вопрос?
            </p>
            <button
              className={style.answerButton}
              type="submit"
              onClick={yesHandler}
            >
              Да
            </button>
            <button
              className={style.answerButton}
              type="submit"
              onClick={noHandler}
            >
              Нет
            </button>
          </div>
        ) : (
          <div className={style.answerContainer}>
            <p className={style.answerText}>
              На вопрос отвечает
              {' '}
              <span className={style.answerUserName}>{modal.username}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
