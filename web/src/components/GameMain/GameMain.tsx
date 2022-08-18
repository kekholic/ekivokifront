/* eslint-disable no-restricted-syntax */
/* eslint-disable no-empty */
/* eslint-disable operator-linebreak */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import React, {
  ReactElement,
  useEffect,
  useState,
  //  useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GAME_STATUS from '../../actions/gameStatus';
import ACTIONS from '../../actions/wsActions';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import checkStatusGame from '../../hooks/useCheckStatusGame';
import {
  BoardVisibleMessage,
  modalAnswer,
  // sendMessageGameState,
  sendNewGameState,
  // tryAnswer,
  // updateQuestionState,
  // updateVisibleState,
} from '../../lib/game/gameUpdate';
import socket from '../../socket';
import { updateCanSendStatus } from '../../store/reducers/authSlice';
// import { getCard } from '../../store/reducers/actionCreators';
import {
  hostLeaveUpdate,
  playerJoinedUpdateState,
  playersLeaveUpdate,
  reconnect,
  setVideoComponents,
  updateGameState,
} from '../../store/reducers/gameSlice';
import Canvas from '../Canvas/Canvas';
import ModalAnswerCard from '../ModalAnswerCard/ModalAnswerCard';
import ModalBoard from '../ModalBoard/ModalBoard';
import ModalEnd from '../ModalEnd/ModalEnd';
// import { updateGameState } from '../../store/reducers/gameSlice';
// import { newQuestionState } from '../../store/reducers/questionSlice';
// import ModalAnswerCard from '../ModalAnswerCard/ModalAnswerCard';
// import QuestionCard from '../QuestionCard/QuestionCard';
import VideoComponent from '../WebChat/VideoComponent';
import CardForHost from './CardForHost/CardForHost';
import CardForPlayer from './CardForPlayer/CardForPlayer';
import style from './GameMain.module.css';

const users = {};

export default function GameMain() {
  const navigate = useNavigate();
  const [modal, setModal] = useState({
    visible: false,
    username: '',
    userId: 0,
  });
  const [winner, setWinner] = useState({
    name: '',
    score: 0,
    win: false,
  });
  const user = useAppSelector((store) => store.user);
  const allGames = useAppSelector((store) => store.allGame);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user.canSendMessage) {
      dispatch(setVideoComponents({ [socket.id]: user.user.id }));
    }
  }, []);
  const [boardVisible, setBoardVisible] = useState(false);
  const { game } = useAppSelector((store) => store);
  // const question = useAppSelector((store) => store.question);
  const { id } = useParams();
  const statusGame = checkStatusGame(Number(id));

  const findIndex = (): number => {
    let ind = 0;
    for (let i = 0; i < game.questions.list.length; i++) {
      if (game.questions.list[i].id === game.questions.current) {
        ind = i;
        break;
      }
    }
    return ind;
  };

  useEffect(() => {
    // sendMessageGameState(game, id, user);

    socket.on('playerJoined', (player) => {
      // users = { ...users, player };
      // // console.log('PLAYER JOINED BEFORE DISPATCH', player);
      if (user.canSendMessage) {
        dispatch(playerJoinedUpdateState(player));
      }
    });

    socket.on('sendNewGameStateBack', (msg) => {
      // // console.log('what a fuck?');
      dispatch(updateGameState(msg.game));
    });

    socket.on('modalAnswerOpen', (msg) => {
      setModal({
        visible: true,
        username: msg.username,
        userId: msg.userId,
      });
    });

    socket.on('modalCloseFromBack', (msg) => {
      setModal({
        visible: false,
        username: '',
        userId: 0,
      });
    });

    socket.on('OpenBoard', (msg) => {
      setBoardVisible(true);
    });
    socket.on('EndGame', (msg) => {
      try {
        setWinner(msg.winner);
        socket.emit(ACTIONS.LEAVE);
      } catch (error) {
        navigate('../');
      }
    });

    // socket.on('exit_game_host', (msg) => {
    //   if (user.user.id === msg.isHost) {
    //     dispatch(hostLeaveUpdate(msg));
    //   }
    // });
    // socket.on('exit_game', (msg) => {
    //   if (user.canSendMessage) {
    //     dispatch(playersLeaveUpdate(msg));
    //   }
    // });
  }, [socket]);

  useEffect(() => {
    if (user.canSendMessage && game.playersPriority.length > 1) {
      sendNewGameState(game, String(game.game.id));
      if (user.user.id !== game.isHost) {
        if (
          game.game.status === GAME_STATUS.IN_PROGRESS &&
          Object.keys(game.progress).length
        ) {
          BoardVisibleMessage(id);
          setBoardVisible(true);
        }
        dispatch(updateCanSendStatus(false));
      }
    }
    if (user.user.id === game.isHost) {
      dispatch(updateCanSendStatus(true));
    }

    // // console.log('socket.id', socket.id);
    if (game.game.id === 0 && allGames.games.length === 0 && user.user.id) {
      // // console.log('Стэйт слетел !', game.game.id, 'soketID', socket.id);
      socket.timeout(3000).emit('f5', {
        roomID: id,
        user: user.user,
      });
    }

    socket.on('f5', (msg) => {
      // // console.log('принял сообщение об слете игры с сервера');
      // // console.log('****************', msg.user.id, game.isHost);
      if (msg.user.id === game.isHost) {
        // // console.log('зашел в условие смены');
        const users = game.playersPriority.filter(
          (user) => user.userId !== game.isHost,
        );
        // // console.log('users: ', users);
        const tempHost = users.sort((a, b) => a.userId - b.userId).pop();
        // // console.log('tempHost: ', tempHost);

        if (user.user.id === tempHost?.userId) {
          // // console.log('tempHost?.userId: ', tempHost?.userId);
          // // console.log('user.user.id: ', user.user.id);
          // // console.log('Поменял могу отправлять сообщения');
          dispatch(updateCanSendStatus(true));
        }
      }
      dispatch(reconnect(msg));
      // if (game.game.id !== 0) {
      //   // console.log('Отправил сообщениес новым стейтом');
      //   socket.emit('updatef5', {
      //     roomID: id,
      //     game,
      //   });
      // }
    });

    // i += 1;
    // // console.log(i);
  }, [game, user]);

  const giveAnswer = () => {
    modalAnswer(String(game.game.id), user.user.username, user.user.id);
    setModal({
      visible: true,
      username: user.user.username || 'username',
      userId: user.user.id,
    });
  };

  useEffect(() => {
    if (boardVisible) {
      setTimeout(() => {
        setBoardVisible(false);
      }, 5000);
    }
  }, [boardVisible]);

  useEffect(() => {
    if (winner.win && user.canSendMessage) {
      socket.emit('endGame', {
        winner,
        roomID: id,
        users: game.playersPriority,
      });
      dispatch(updateCanSendStatus(false));
    }
    if (winner.win) {
      // navigate(0);
      // setTimeout(() => window.location.reload(), 1000);
    }
  }, [winner]);

  if (statusGame === GAME_STATUS.END) {
    return (
      <>
        <h1>Эта игра закончена</h1>
        <div>перейдите в список игр</div>
      </>
    );
  }

  if (statusGame === GAME_STATUS.IN_PROGRESS) {
    return (
      <>
        <h1>Эта игра уже стартовала</h1>
        <div>перейдите в список игр</div>
      </>
    );
  }

  return (
    <div className={style.gameContainer}>
      <div className={style.gameVideos}>
        {id && <VideoComponent roomID={id} />}
      </div>
      <div className={style.gameSpace}>
        {modal.visible && (
          <ModalAnswerCard
            setModal={setModal}
            modal={modal}
            findIndex={findIndex}
            setWinner={setWinner}
          />
        )}
        {game.game.status === GAME_STATUS.IN_PROGRESS &&
          (user.canSendMessage ? (
            <CardForHost findIndex={findIndex} id={id} />
          ) : (
            <CardForPlayer
              id={id}
              findIndex={findIndex}
              giveAnswer={giveAnswer}
            />
          ))}

        {/*    {game.questions.list[findIndex()].type === 3 && (
          <Canvas roomID={id} canSendMessage={user.canSendMessage} />
        )} */}
        {boardVisible && <ModalBoard boardVisible={boardVisible} />}
        {/* <ModalBoard boardVisible={boardVisible} /> */}
        {winner.win && <ModalEnd winner={winner} />}
      </div>
    </div>
  );
}
