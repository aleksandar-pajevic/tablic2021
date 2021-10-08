import React from 'react';
import Card from '../Card/Card';
import styles from './Table.module.scss';

const Table = ({ player }) => {
  return (
    <div className={styles.table}>
      {player.cards.table.map((card, i) => (
        <Card
          card={card}
          onMove={player.onMove}
          table={true}
          player={false}
          i={i}
        />
      ))}
    </div>
  );
};

export default Table;
