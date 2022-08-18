/* eslint-disable consistent-return */
import { useEffect, useState } from 'react';
import $api from '../http';

export default function checkStatusGame(id: number) {
  const [statusGame, setStatusGame] = useState('');

  async function getStatusGame() {
    try {
      const { data } = await $api.post(
        `${process.env.REACT_APP_API_URL}/game/checkStatusGame`,
        { id },
      );
      return data;
    } catch (error) {
      // console.log(error);
    }
  }

  useEffect(() => {
    getStatusGame().then((data) => {
      // // console.log(data);

      setStatusGame(data);
    });
  }, [id]);

  return statusGame;
}
