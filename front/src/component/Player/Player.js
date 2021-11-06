import React from 'react';
import styles from './Player.module.scss';
import Card from '../Card/Card';

const Player = ({ player, activeClass }) => {
  return (
    <div className={styles.player}>
      <h3>{player.name}</h3>

      <div
        className={
          activeClass
            ? `${styles.playerCards} ${styles.onMove}`
            : styles.playerCards
        }
      >
        {player.cards.hand.map((card, i) => (
          <Card
            card={card}
            onMove={player.onMove}
            isTable={false}
            isPlayer={true}
            key={card.code}
          />
        ))}
      </div>
    </div>
  );
};

export default Player;
