import React, { useState } from 'react';
import styles from './Game.module.scss';
import { useSelector } from 'react-redux';
import Table from '../Table/Table';
import Player from '../Player/Player';

const Game = () => {
  const player = useSelector((state) => state.player);
  console.log(player);

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
