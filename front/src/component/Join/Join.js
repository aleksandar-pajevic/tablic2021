import React, { useState } from 'react';
import styles from './Join.module.scss';
import { Link } from 'react-router-dom';

const Join = () => {
  const [name, setName] = useState('');
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
        <Link onClick={(e) => (!name ? e.preventDefault() : null)} to={`/loby`}>
          <button className={styles.btn} type="submit">
            ENTER
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
