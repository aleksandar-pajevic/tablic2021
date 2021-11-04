import io from 'socket.io-client';

let PORT = 'https://tablic-back.herokuapp.com/';

let socket = io(PORT, { transports: ['websocket', 'polling', 'flashsocket'] });

export { socket };
