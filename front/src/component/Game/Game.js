import React, { useState } from 'react';
import styles from './Game.module.scss';
import { useSelector } from 'react-redux';

const Game = () => {
  const player = useSelector((state) => state.player);
  console.log(player);
  const [opponentCards, setOpponentCards] = useState([1, 2, 3, 4, 5, 6]);
  return (
    <div className={styles.outterContainer}>
      <h1>Game</h1>
      <div className={styles.opponent}>
        <h3>{player.opponent}</h3>

        <div className={styles.opponentCards}>
          {opponentCards.map((card, i) => (
            <div key={i} className={styles.card}>
              card
            </div>
          ))}
        </div>
      </div>

      <div className={styles.table}>
        {player.cards.table.map((card, i) => (
          <div
            key={i}
            className={styles.card}
            style={{ backgroundImage: `url(${card.image})` }}
          ></div>
        ))}
      </div>

      <div className={styles.player}>
        <h3>{player.name}</h3>

        <div className={styles.playerCards}>
          {player.cards.hand.map((card, i) => (
            <div
              key={i}
              className={styles.card}
              style={{ backgroundImage: `url(${card.image})` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
