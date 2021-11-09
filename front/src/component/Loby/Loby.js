import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './Loby.module.scss'
import { socket } from '../../socket'
import { useDispatch } from 'react-redux'
import {
  initializeGame,
  challengeOpponent,
  acceptChallenge,
  refuseChallenge,
  joinLoby
} from '../../store/player'
import { candidatesSlice, updateCandidates } from '../../store/candidates'
import { useHistory } from 'react-router-dom'
import Modal from 'react-modal'
import { Socket } from 'socket.io-client'

const Loby = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [challengerModal, setChallengerModal] = useState(false)
  const [challengedModal, setChallengedModal] = useState(false)
  const [challenger, setChallenger] = useState('')
  let playerName = useSelector(state => state.player.name)
  let candidates = useSelector(state => state.candidates.onlinePlayers)
  let onlinePlayers = candidates.filter(
    candidate => candidate.socketId !== socket.id
  )

  const modalStyle = {
    content: {
      backgroundColor: 'cadetblue',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column'
    }
  }
  console.log('filtered candidates', onlinePlayers)

  socket.on('first round', ({ cards, table, onMove, opponent, socket }) => {
    console.log('first round trigered')
    dispatch(initializeGame({ cards, table, opponent, onMove, socket }))
    history.push('/game')
  })

  socket.on('candidates', ({ candidates }) => {
    console.log('candidates event emited', candidates)
    dispatch(updateCandidates(candidates))
  })
  socket.on('challenged', ({ challenger }) => {
    console.log('you been challenged')
    setChallenger(challenger)
    openChallenngedModal()
  })

  socket.on('challenge refused', () => {
    closeChallenngerModal()
  })

  function openChallenngerModal (winner) {
    // setNewWinner(winner);
    setChallengerModal(true)
  }
  function openChallenngedModal (winner) {
    // setNewWinner(winner);
    setChallengedModal(true)
  }

  function afterOpenModal () {
    // references are now sync'd and can be accessed.
  }

  function closeChallenngerModal () {
    setChallengerModal(false)
  }
  function closeChallenngedModal () {
    setChallengedModal(false)
  }

  return (
    <div className={styles.outterContainer}>
      <Modal
        isOpen={challengerModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeChallenngerModal}
        contentLabel='challenger modal'
        style={modalStyle}
        ariaHideApp={false}
      >
        <div id='modal'>
          <p>waiting opponent to accept invite</p>
        </div>
      </Modal>
      <Modal
        isOpen={challengedModal}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeChallenngedModal}
        contentLabel='challenged modal'
        style={modalStyle}
        ariaHideApp={false}
      >
        <div id='modal'>
          <p>{challenger.name} want to play against you</p>
          <div className={styles.modalBtns}>
            <div
              className={styles.acceptBtn}
              onClick={() => {
                dispatch(
                  acceptChallenge({
                    challenger: {
                      name: challenger.name,
                      socketId: challenger.socketId
                    },
                    challenged: {
                      name: playerName,
                      socketId: socket.id
                    }
                  })
                )
                closeChallenngedModal()
                setChallenger('')
              }}
            >
              <span>accept</span>
            </div>
            <div
              className={styles.refuseBtn}
              onClick={() => {
                dispatch(refuseChallenge(challenger))
                closeChallenngedModal()
                setChallenger('')
              }}
            >
              <span>refuse</span>
            </div>
          </div>
        </div>
      </Modal>
      <h1 className={styles.heading}>Loby</h1>
      <h2>Online players</h2>
      <h3>Player name: {playerName}</h3>
      <div className={styles.randomMatch}>
        <span>start random game</span>
      </div>
      <ul>
        {onlinePlayers.map(player => (
          <li className={styles.onlinePlayer}>
            <span>{player.name}</span>
            <span
              className={styles.challengeBtn}
              onClick={() => {
                openChallenngerModal()
                dispatch(
                  challengeOpponent({
                    challenger: { name: playerName, socketId: socket.id },
                    challenged: { name: player.name, socketId: player.socketId }
                  })
                )
              }}
            >
              challenge
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Loby
