import { IUser } from '../../models/IUser';
import socket from '../../socket';
import { GameState } from '../../store/reducers/gameSlice';
import { QuestionState } from '../../store/reducers/questionSlice';

export function sendMessageGameState(
  game: GameState,
  id: string | undefined,
  user: IUser,
): void {
  socket.emit('game', {
    game,
    roomID: id,
    user,
    method: 'initState',
  });
}

interface Ivisible {
  start: boolean;
  waiting: boolean;
  questionCard: boolean;
  visibleHostButton: boolean;
  dontHost: boolean;
  count: boolean;
}

export function updateVisibleState(
  visible: Ivisible,
  id: string | undefined,
): void {
  socket.emit('game', {
    roomID: id,
    visible,
    method: 'visibleState',
  });
}

export function updateQuestionState(
  question: QuestionState,
  id: string | undefined,
): void {
  socket.emit('game', {
    roomID: id,
    question,
    method: 'questionState',
  });
}

export function tryAnswer(user: IUser, id: string | undefined): void {
  socket.emit('game', {
    roomID: id,
    user,
    method: 'tryAnswer',
  });
}

export function wrongAnswer(id: string | undefined): void {
  socket.emit('game', {
    roomID: id,
    method: 'wrongAnswer',
  });
}

export function connectedToTheGame(id: string | undefined, user: IUser): void {
  socket.emit('playerJoined', {
    roomID: id,
    user,
    socket: socket.id,
  });
}

export function sendNewGameState(
  game: GameState,
  id: string | undefined,
): void {
  socket.emit('sendNewGameState', {
    game,
    roomID: id,
  });
}

export function modalAnswer(
  id: string | undefined,
  username: string | undefined,
  userId: number | undefined,
): void {
  socket.emit('modalAnswer', {
    roomID: id,
    username,
    userId,
  });
}

export function modalCloseNo(id: string | undefined): void {
  socket.emit('modalClose', {
    roomID: id,
  });
}

export function BoardVisibleMessage(id: string | undefined): void {
  socket.emit('boardVisible', { roomID: id });
}
