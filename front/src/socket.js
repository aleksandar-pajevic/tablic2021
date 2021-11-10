import io from 'socket.io-client';

let PORT = 'https://tablic-back.herokuapp.com/';
// let PORT = 'http://127.0.0.1:5000';

let socket = io(PORT, { transports: ['websocket', 'polling', 'flashsocket'] });

export { socket };
