import React, { useState } from 'react';
import styles from './Join.module.scss';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPlayerName, joinLoby } from '../../store/player';
import { useHistory } from 'react-router-dom';

const Join = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  let history = useHistory();
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      dispatch(addPlayerName(name));
      dispatch(joinLoby(name))
      history.push('/loby');
    }
  };

  // console.log(name);
  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <h1 className={styles.heading}>Join</h1>
        <input
          type="text"
          placeholder="your name"
          className={styles.input}
          onChange={({ target: { value } }) => {
            setName(value.trim());
          }}
          onKeyPress={handleKeyPress}
        />
      <Link onClick={() => {dispatch(addPlayerName(name)); dispatch(joinLoby(name)) }} to={`/loby`}>
          <button className={styles.btn} type="submit">
            ENTER
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
