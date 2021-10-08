import React from 'react';
import styles from './Card.module.scss';
import { selectCard, unselectCard, tryTake } from '../../store/player';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

const Card = ({ card, onMove, table, player, i }) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(false);
  const toggleSelect = () => {
    setSelected(!selected);
  };
  console.log('onMove from card:', onMove);
  return (
    <div
      onClick={
        onMove && table
          ? selected
            ? () => {
                dispatch(unselectCard(card));
                toggleSelect();
              }
            : () => {
                dispatch(selectCard(card));
                toggleSelect();
              }
          : onMove && player
          ? () => {
              dispatch(tryTake(card));
            }
          : null
      }
      key={i}
      className={selected ? `${styles.card} ${styles.active}` : styles.card}
      style={{ backgroundImage: `url(${card.image})` }}
    ></div>
  );
};

export default Card;
