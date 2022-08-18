/* eslint-disable eqeqeq */
/* eslint-disable max-len */
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react';
import board from '../../img/V3.png';
import style from './ModalBoard.module.css';
import ava1 from '../../img/chip10-d4136a1019ee0e95.png';
import ava2 from '../../img/chip7-e82ee8f9e57c466e.png';
import ava3 from '../../img/chip8-9d9e969a7a91713e.png';
import ava4 from '../../img/png-transparent-emoticon-wearing-sunglasses-sticker-smiley-emoticon-emoji-sunglasses-emoji-s-orange-sticker-glasses.png';
import { useAppSelector } from '../../hooks/redux';
import { IplayersPriority } from '../../store/reducers/gameSlice';

type Props = {
  boardVisible: boolean;
};

interface IObj {
  [key: string]: {
    y: string;
    x: string;
  };

}

const obj: IObj = {
  1: { y: '175px', x: '100px' },
  2: { y: '242px', x: '100px' },
  3: { y: '307px', x: '131px' },
  4: { y: '290px', x: '216px' },
  5: { y: '229px', x: '288px' },
  6: { y: '198px', x: '362px' },
  7: { y: '198px', x: '448px' },
  8: { y: '203px', x: '524px' },
  9: { y: '221px', x: '590px' },
  10: { y: '286px', x: '592px' },
  11: { y: '354px', x: '564px' },
  12: { y: '346px', x: '490px' },
  13: { y: '331px', x: '417px' },
  14: { y: '328px', x: '341px' },
  15: { y: '395px', x: '305px' },
  16: { y: '462px', x: '319px' },
  17: { y: '462px', x: '404px' },
  18: { y: '463px', x: '500px' },
  19: { y: '467px', x: '586px' },
  20: { y: '537px', x: '600px' },
  21: { y: '597px', x: '600px' },
  22: { y: '668px', x: '591px' },
  23: { y: '675px', x: '503px' },
  24: { y: '675px', x: '408px' },
  25: { y: '617px', x: '405px' },
  26: { y: '553px', x: '402px' },
  27: { y: '556px', x: '328px' },
  28: { y: '550px', x: '240px' },
  29: { y: '472px', x: '215px' },
  30: { y: '396px', x: '186px' },
  31: { y: '418px', x: '93px' },
  32: { y: '509px', x: '71px' },
  33: { y: '591px', x: '71px' },
  34: { y: '658px', x: '71px' },
  35: { y: '729px', x: '71px' },
  36: { y: '797px', x: '71px' },
  37: { y: '789px', x: '128px' },
  38: { y: '734px', x: '176px' },
  39: { y: '668px', x: '186px' },
  40: { y: '645px', x: '284px' },
  41: { y: '710px', x: '284px' },
  42: { y: '780px', x: '284px' },
  43: { y: '790px', x: '357px' },
  44: { y: '790px', x: '429px' },
};
const avaarr = [ava1, ava2, ava3, ava4];

interface IPlayersNava {
  pic: string;
  id: number;
}

function ModalBoard({ boardVisible }: Props) {
  const game = useAppSelector((store) => store.game);
  const [plaNava, setPlaNav] = useState(
    [{
      pic: '',
      id: -1,
    }],
  );
  let playersNava: IPlayersNava[] = [];

  useEffect(() => {
    playersNava = game.playersPriority.reduce(
      (acc: IPlayersNava[], el: IplayersPriority, ind: number) => {
        acc.push({
          pic: avaarr[ind],
          id: el.userId,
        });
        return acc;
      },
      [],
    );
    setPlaNav(playersNava);
  }, [game.playersPriority]);
  function range(start: number, end: number): Array<number> {
    return Array(end - start + 1)
      .fill(0)
      .map((_, idx) => start + idx);
  }
  return (
    <div
      className={
        boardVisible ? `${style.modal} ${style.modalActive}` : `${style.modal}`
      }
    >
      <div
        className={
          boardVisible
            ? `${style.modalContent} ${style.modalContentActive}`
            : `${style.modalContent}`
        }
      >
        <p>КАРТА!!</p>
        <img className={style.board} src={board} alt="board" />

        {range(1, 44).map((el) => (
          <div
            id={String(el)} // значение cell в progress
            key={el}
            className={style.cell}
            style={{ top: obj[el].y, left: obj[el].x }}
          >
            <div>
              {plaNava.map(
                (
                  elem, // {userId: cell}
                ) => (
                  <div>
                    {game.progress[elem.id] == el && (
                      <img
                        id={String(elem.id)}
                        className={style.ava}
                        src={elem.pic}
                        alt="ava"
                      />
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
        <div id="1" />
      </div>
    </div>
  );
}

export default ModalBoard;
