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
    <div className={winner.win ? `${style.modal} ${style.modalActive}` : `${style.modal}`}>
      <div className={style.modalContent}>
        <p className={style.modalText}>
          <p>Поздравляем !!!</p>
          <p>
            <span style={{ fontWeight: '700' }}>
              {winner.name}
            </span>
            {' '}
            выиграл со счетом
            {' '}
            {winner.score}
            !
          </p>
        </p>
        <button className={style.modalExitButton} onClick={exitHandler} type="submit">
          Выйти
        </button>
      </div>
    </div>
  );
}

export default ModalEnd;
