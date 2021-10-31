import React, { useEffect } from 'react';
import styles from './Game.module.scss';
import Table from '../Table/Table';
import Player from '../Player/Player';
import { socket } from '../../socket';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTable,
  setHand,
  newRound,
  changeOnMove,
  findWinner,
  removeOpponentCard,
} from '../../store/player';

const Game = () => {
  const player = useSelector((state) => state.player);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('can take cards', ({ newHand }) => {
      dispatch(setHand(newHand));
    });
  }, []);
  useEffect(() => {
    socket.on('can not take cards', ({ newHand }) => {
      dispatch(setHand(newHand));
    });
  }, []);
  useEffect(() => {
    socket.on('change move', ({ newTable }) => {
      console.log('change move emmited');
      dispatch(setTable(newTable));
      dispatch(changeOnMove());
    });
  }, []);
  useEffect(() => {
    socket.on('opponent made move', () => {
      dispatch(removeOpponentCard());
    });
  }, []);

  useEffect(() => {
    socket.on('new round', ({ newHand, opponentCards }) => {
      console.log('New Round Started, hand:', newHand);
      dispatch(newRound({ newHand, opponentCards }));
    });
  }, []);

  useEffect(() => {
    socket.on('game over', () => {
      dispatch(setTable([]));
      dispatch(findWinner());
    });
  }, []);

  return (
    <div className={styles.outterContainer}>
      <h1>Game</h1>
      <Player player={player.opponent} />

      <Table player={player} />

      <Player player={player} />
    </div>
  );
};

export default Game;
