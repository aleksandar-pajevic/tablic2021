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
  let playerId = useSelector((state) => state.player.id);

  useEffect(() => {
    console.log('player name:', playerName);
    socket = io(PORT, { transports: ['websocket', 'polling', 'flashsocket'] });
    socket.on('connect', () => {
      dispatch(addPlayerId(socket.id));
      console.log('client connected:', socket.connected);
      console.log('client socket:', socket);
      console.log('client socketId:', playerId);
    });
    socket.emit('join', { playerName, playerId }, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [playerName]);

  return (
    <div className={styles.outterContainer}>
      <h1 className={styles.heading}>Loby</h1>
      <h2>Waiting for opponent</h2>
    </div>
  );
};

export default Loby;
