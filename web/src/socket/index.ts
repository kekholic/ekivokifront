import { io } from 'socket.io-client';

const options = {
  'force new connection': true,
  reconnecctionAttempts: 'infinity',
  timeout: 10000,
  transport: ['websocket'],
};

const socket = io(`${process.env.REACT_APP_API_URL}`, options);

export default socket;
