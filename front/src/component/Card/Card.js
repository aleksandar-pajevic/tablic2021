import React from 'react';
import styles from './Card.module.scss';
import { selectCard, unselectCard } from '../../store/player';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

const Card = ({ card, i }) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(false);
  const toggleSelect = () => {
    setSelected(!selected);
  };
  console.log(selected);
  return (
    <div
      // onClick={() => {
      //   dispatch(selectCard(card));
      // }}

      onClick={
        selected
          ? () => {
              dispatch(unselectCard(card));
              toggleSelect();
            }
          : () => {
              dispatch(selectCard(card));
              toggleSelect();
            }
      }
      key={i}
      className={styles.card}
      style={{ backgroundImage: `url(${card.image})` }}
    ></div>
  );
};

export default Card;
