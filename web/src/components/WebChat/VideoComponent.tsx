/* eslint-disable max-len */
import React, { ReactElement, useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks/redux';
import useWebRTC, { LOCAL_VIDEO } from '../../hooks/useWebRTC';
import { IplayersPriority } from '../../store/reducers/gameSlice';
import { IvcProps } from '../../types/webRTC';
import style from './VideoComponent.module.css';
import ava1 from '../../img/chip10-d4136a1019ee0e95.png';
import ava2 from '../../img/chip7-e82ee8f9e57c466e.png';
import ava3 from '../../img/chip8-9d9e969a7a91713e.png';
import ava4 from '../../img/png-transparent-emoticon-wearing-sunglasses-sticker-smiley-emoticon-emoji-sunglasses-emoji-s-orange-sticker-glasses.png';

const avaarr = [ava1, ava2, ava3, ava4];

export default function VideoComponent(props: IvcProps): ReactElement {
  const { roomID } = props;
  const { clients, provideMediaRef } = useWebRTC(roomID);
  const { game } = useAppSelector((store) => store);

  const findUserName = (id: number): string => {
    const userName = game.playersPriority.find((el) => el.userId === id)?.username || '';
    return userName;
  };

  const findUserAva = (id:number, arr: Array<IPlayersNava>): string => {
    if (arr.length) {
      const avatar = arr.filter((el) => el.id === id);
      return avatar[0].pic;
    }
    return '';
  };

  interface IPlayersNava {
    pic: string;
    id: number;
  }

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

  return (
    clients?.map((clientID: string) => (
      (game.videoComponents[clientID] === game.isHost)
        ? (
          <div className={`${style.videoContainer} ${style.videoContainerHost}`}>
            <video
              className={(game.videoComponents[clientID] === game.isHost) ? style.videoHost : style.videoPlayer}
              key={clientID}
              ref={(instance: HTMLVideoElement) => { provideMediaRef(clientID, instance); }}
              playsInline
              autoPlay
              muted={clientID === LOCAL_VIDEO}
            >
              <track kind="captions" />
            </video>
            <span className={style.videoHostTitle}>Ведущий</span>
            <div className={style.videoUserContainer}>
              {game.videoComponents[clientID]
              && <span className={style.videoUserName}>{findUserName(game.videoComponents[clientID])}</span>}
              {game.videoComponents[clientID]
              && <img className={style.videoUserAvatar} src={findUserAva(game.videoComponents[clientID], plaNava)} alt="ikonka" />}
            </div>
          </div>
        )
        : (
          <div className={`${style.videoContainer} ${style.videoContainerPlayer}`}>
            <video
              className={(game.videoComponents[clientID] === game.isHost) ? style.videoHost : style.videoPlayer}
              key={clientID}
              ref={(instance: HTMLVideoElement) => { provideMediaRef(clientID, instance); }}
              playsInline
              autoPlay
              muted={clientID === LOCAL_VIDEO}
            >
              <track kind="captions" />
            </video>
            <div className={style.videoUserContainer}>
              {game.videoComponents[clientID]
              && <span className={style.videoUserName}>{findUserName(game.videoComponents[clientID])}</span>}
              {game.videoComponents[clientID]
              && <img className={style.videoUserAvatar} src={findUserAva(game.videoComponents[clientID], plaNava)} alt="ikonka" />}
            </div>
          </div>
        )
    ))
  );
}
