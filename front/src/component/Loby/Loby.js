import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './Loby.module.scss';
import { socket } from '../../socket';
import { useDispatch } from 'react-redux';
import { initializeGame } from '../../store/player';
import { updateCandidates } from '../../store/candidates';
import { useHistory } from 'react-router-dom';

const Loby = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  let playerName = useSelector((state) => state.player.name);
  let onlinePlayers = useSelector(state => state.candidates.onlinePlayers)
  // useEffect(() => {
  //   console.log('player name:', playerName);
  //   socket.emit('join', { playerName }, (error) => {
  //     if (error) {
  //       alert(error);
  //     }
  //   });


  //   socket.on('first round', ({ cards, table, onMove, opponent, socket }) => {
  //     console.log('first round trigered');
  //     dispatch(initializeGame({ cards, table, opponent, onMove, socket }));
  //     history.push('/game');
  //   });
  // }, []);
  useEffect(()=>{
    console.log("candidates use effecta");
  })
  
  socket.on('candidates', ({candidates})=>{
    console.log('candidates event emited', candidates);
    dispatch(updateCandidates(candidates))
  })
  return (
    <div className={styles.outterContainer}>
      <h1 className={styles.heading}>Loby</h1>
      <h2>Online players</h2>
      <ul>
      {
        onlinePlayers.map(player => (<li>{player.name}</li>))
      }
      </ul>

    </div>
  );
};

export default Loby;
