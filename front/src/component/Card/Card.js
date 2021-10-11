import React from 'react';
import styles from './Card.module.scss';
import { selectCard, unselectCard, tryTake } from '../../store/player';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { socket } from '../../socket';

const Card = ({ card, onMove, isTable, isPlayer, i }) => {
  let playerSelectedCards = useSelector((state) => state.player.cards.selected);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(false);
  const toggleSelect = () => {
    setSelected(!selected);
  };

  console.log('player from card:', playerSelectedCards);
  return (
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
              dispatch(tryTake(card));
              socket.emit('try to take', { playerSelectedCards, card });
              console.log(playerSelectedCards);
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
