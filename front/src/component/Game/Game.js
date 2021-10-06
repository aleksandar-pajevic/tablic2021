import React, { useState } from 'react';
import styles from './Game.module.scss';

const Game = () => {
  const [opponentCards, setOpponentCards] = useState([1, 2, 3, 4, 5, 6]);
  return (
    <div className={styles.outterContainer}>
      <div className={styles.opponentCards}>
        <h3>Opponent Name</h3>
        {opponentCards.map((card, i) => (
          <div key={i} className={styles.card}>
            card
          </div>
        ))}
      </div>
      <h1>Game</h1>
      <div className={styles.playerCards}>
        <h3>Player Name</h3>
      </div>
    </div>
  );
};

export default Game;
