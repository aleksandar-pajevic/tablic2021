import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './Loby.module.scss';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { initializeGame } from '../../store/player';
import { useHistory } from 'react-router-dom';

let socket;
let PORT = 'http://127.0.0.1:5000';

const Loby = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let playerName = useSelector((state) => state.player.name);

  useEffect(() => {
    console.log('player name:', playerName);
    socket = io(PORT, { transports: ['websocket', 'polling', 'flashsocket'] });
    socket.on('connect', () => {
      console.log('client connected:', socket.connected);
      console.log('client socket:', socket);
    });
    socket.emit('join', { playerName }, (error) => {
      if (error) {
        alert(error);
      }
    });

    socket.on('first round', ({ cards, table, onMove, opponent }) => {
      console.log('first round trigered');
      dispatch(initializeGame({ cards, table, opponent, onMove, socket }));
      history.push('/game');
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
