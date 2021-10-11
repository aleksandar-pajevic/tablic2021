import React from 'react';
import styles from './Player.module.scss';
import Card from '../Card/Card';

const Player = ({ player }) => {
  return (
    <div className={styles.player}>
      <h3>{player.name}</h3>

      <div className={styles.playerCards}>
        {player.cards.hand.map((card, i) => (
          <Card
            card={card}
            onMove={player.onMove}
            isTable={false}
            isPlayer={true}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Player;
