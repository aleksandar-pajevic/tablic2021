import React, { useState } from 'react';
import styles from './Join.module.scss';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPlayer } from '../../store/player';

const Join = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  console.log(name);
  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <h1 className={styles.heading}>Join</h1>
        <input
          type="text"
          placeholder="your name"
          className={styles.input}
          onChange={(e) => {
            setName(e.target.value.trim());
          }}
        />
        <Link onClick={() => dispatch(addPlayer(name))} to={`/loby`}>
          <button className={styles.btn} type="submit">
            ENTER
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
