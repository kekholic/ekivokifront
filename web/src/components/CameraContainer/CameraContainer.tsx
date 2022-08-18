/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
// import { useAppSelector } from '../../hooks/redux';
import Camera from '../Camera/Camera';

interface IUser {
  id: number,
  name: string
}

// FIX ANY PLS!!!!
export default function CameraContainer(): any {
  const [users, setUsers] = useState([{ id: 0, name: '' }]);
  const [show, setShow] = useState(false);

  // здесь поднимаем сокет конекшен с айди игры из стейта
  // добавляем в редакс в стор в массив playersPriority игроков
  // сортируем по айди.

  // ГОТОВЫЙ КОД КОГДА БУДЕТ СТЕЙТ НЕ УДАЛЯТЬ!
  // const usersConnected = useAppSelector((store) => store.game.playersPriority);
  // if (usersConnected.length) {
  //   usersConnected.sort((current, next) => {
  //     if (current.id > next.id) return 1;
  //     return -1;
  //   });
  // }

  useEffect(() => {
    // сверху usersConnected это мои allUsers, заменить когда будут
    const allUsers: IUser[] = [{ id: 24, name: 'vasya' },
    { id: 1, name: 'petya' },
    { id: 28, name: 'clown' },
    { id: 6, name: 'dolbaeb' },
    { id: 100, name: 'huesos' },
    ];

    allUsers.sort((current, next) => {
      if (current.id > next.id) return 1;
      return -1;
    });
    setUsers(allUsers);
    setShow(true);
    return () => {

    };
  }, []);

  return (
    show
      ? (users.map((user) => (
        <Camera
          key={user.id}
        >
          {user.name}
        </Camera>
      )))
      : (<div>ne show</div>)

  );
}
