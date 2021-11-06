import React, { useEffect } from 'react';
import styles from './Card.module.scss';
import { selectCard, unselectCard, tryToTake } from '../../store/player';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const Card = ({ card, onMove, isTable, isPlayer }) => {
  let playerSelectedCards = useSelector((state) => state.player.cards.selected);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(false);
  const toggleSelect = () => {
    setSelected(!selected);
  };

  useEffect(() => {
    if (isTable && !onMove) {
      setSelected(false);
    }
  }, [onMove]);

  return (
    <div className={styles.cardWrap}>
      <div
        onClick={
          onMove && isTable
            ? selected
              ? () => {
                  dispatch(unselectCard(card));
                  toggleSelect();
                }
              : () => {
                  dispatch(selectCard(card));
                  toggleSelect();
                }
            : onMove && isPlayer
            ? () => {
                dispatch(tryToTake(card));
                console.log('selected card', playerSelectedCards);
              }
            : null
        }
        className={selected ? `${styles.card} ${styles.active}` : styles.card}
        style={{ backgroundImage: `url(${card.image})` }}
      ></div>
    </div>
  );
};

export default Card;
