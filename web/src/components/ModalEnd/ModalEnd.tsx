/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-len */
/* eslint-disable no-empty-pattern */
import { useNavigate } from 'react-router';
import style from './ModalEnd.module.css';
import { useAppDispatch } from '../../hooks/redux';
import { initialState, updateGameState } from '../../store/reducers/gameSlice';

type Props = {
  winner: Iwinner;
};
interface Iwinner {
  name: string;
  score: number;
  win: boolean;
}

function ModalEnd({ winner }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const exitHandler = () => {
    dispatch(updateGameState(initialState));
    navigate('../');
    navigate(0);
  };
  return (
    <div
      className={
        winner.win ? `${style.modal} ${style.modalActive}` : `${style.modal}`
      }
    >
      <div
        className={
          winner.win
            ? `${style.modalContent} ${style.modalContentActive}`
            : `${style.modalContent}`
        }
      >
        <h1>
          {winner.name}
          {' '}
          выиграл со счетом
          {winner.score}
        </h1>
        <button onClick={exitHandler} type="submit">
          Выйти
        </button>
      </div>
    </div>
  );
}

export default ModalEnd;
