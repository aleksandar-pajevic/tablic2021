import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './Loby.module.scss';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addPlayerId } from '../../store/player';

let socket;
let PORT = 'http://127.0.0.1:5000';

const Loby = () => {
  const dispatch = useDispatch();

  let playerName = useSelector((state) => state.player.name);

  useEffect(() => {
    console.log('player name:', playerName);
    socket = io(PORT, { transports: ['websocket', 'polling', 'flashsocket'] });
    socket.on('connect', () => {
      dispatch(addPlayerId(socket.id));
      console.log('client connected:', socket.connected);
      console.log('client socket:', socket);
      console.log('client socketId:', socket.id);
    });
    socket.emit('join', { playerName }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [playerName]);

  return (
    <div>
      <h1 className={styles.heading}>Loby</h1>
    </div>
  );
};

export default Loby;
