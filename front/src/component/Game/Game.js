import React, { useEffect } from 'react';
import styles from './Game.module.scss';
import { useSelector } from 'react-redux';
import Table from '../Table/Table';
import Player from '../Player/Player';
import { socket } from '../../socket';
import { useDispatch } from 'react-redux';
import { takeCards, setTable, setHand, changeOnMove } from '../../store/player';

const Game = () => {
  const player = useSelector((state) => state.player);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on(
      'can take cards',
      ({ newTable, newHand, selectedCards, card }) => {
        console.log(
          'log from Game, ~can take cards~ socket event',
          selectedCards
        );
        dispatch(takeCards({ selectedCards, card }));
        dispatch(setTable(newTable));
        dispatch(setHand(newHand));
        dispatch(changeOnMove());
      }
    );
  }, []);
  useEffect(() => {
    socket.on('can not take cards', ({ newTable, newHand }) => {
      console.log("log from can't take cards", newHand);
      dispatch(setTable(newTable));
      dispatch(setHand(newHand));
      dispatch(changeOnMove());
    });
  }, []);
  useEffect(() => {
    socket.on('change move', ({ newTable }) => {
      console.log('change move emmited');
      dispatch(setTable(newTable));
      dispatch(changeOnMove());
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
