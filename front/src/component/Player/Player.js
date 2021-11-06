import React from 'react';
import styles from './Player.module.scss';
import Card from '../Card/Card';
import { useSelector } from 'react-redux';

const Player = ({ player, activeClass, tabla }) => {
  console.log('tabla:', tabla);
  return (
    <div className={styles.player}>
      <div className={styles.playerInfo}>
        <h3>{player.name}</h3>
        <h5>Tabla: {tabla}</h5>
      </div>

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
