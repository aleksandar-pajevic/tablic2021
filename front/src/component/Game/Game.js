import React, { useEffect, useState } from 'react'
import styles from './Game.module.scss'
import Table from '../Table/Table'
import Player from '../Player/Player'
import Chat from '../Chat/Chat'
import Modal from 'react-modal'
import { Link, useHistory} from 'react-router-dom'
import { socket } from '../../socket'
import { useDispatch, useSelector } from 'react-redux'
import {
  setTable,
  setHand,
  newRound,
  changeOnMove,
  removeOpponentCard,
  setTablas,
  tryToTake,
  joinLoby,
  backToLoby
} from '../../store/player'

// Modal.setAppElement('#App');

const Game = () => {
  const player = useSelector(state => state.player)
  const [modalIsOpen, setIsOpen] = useState(false)
  const [newWinner, setNewWinner] = useState('')
  const [seconds, setSeconds] = useState(15)
  const dispatch = useDispatch()
  const history = useHistory();
  const modalStyle = {
    content: {
      backgroundColor: 'cadetblue',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column'
    }
  }
  function getRandomInt (max) {
    return Math.floor(Math.random() * max)
  }

  useEffect(() => {
    socket.on('can take cards', ({ newHand }) => {
      if (newHand.length === 0) {
      }
      dispatch(setHand(newHand))
    })
  }, [])

  useEffect(() => {
    socket.on('can not take cards', ({ newHand }) => {
      dispatch(setHand(newHand))
    })
  }, [])

  useEffect(() => {
    socket.on('change move', ({ newTable }) => {
      setSeconds(15)
      console.log('change move emmited')
      dispatch(setTable(newTable))
      dispatch(changeOnMove())
    })
  }, [])

  useEffect(() => {
    socket.on('opponent disconnected', () => {
      alert('opponent disconencted, redirecting to loby')
      dispatch(backToLoby({ name: player.name, room: player.socket.room }))
      setNewWinner('')
      setSeconds(15)
      history.push('/loby')
    })
  }, [])

  useEffect(() => {
    if (player.onMove && player.cards.hand.length > 0) {
      let randomCardIndex = getRandomInt(player.cards.hand.length)
      let myInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        }
        if (seconds === 0) {
          clearInterval(myInterval)
          setSeconds(15)
          dispatch(tryToTake(player.cards.hand[randomCardIndex]))
        }
      }, 1000)
      return () => {
        clearInterval(myInterval)
      }
    }
  }, [player.onMove, player.cards.hand, seconds])

  useEffect(() => {
    socket.on('tabla update', ({ curentTabla, opponentTabla }) => {
      console.log('tabla update', curentTabla, opponentTabla)
      dispatch(setTablas({ player: curentTabla, opponent: opponentTabla }))
    })
  }, [])

  useEffect(() => {
    socket.on('opponent made move', () => {
      dispatch(removeOpponentCard())
    })
  }, [])

  useEffect(() => {
    socket.on('new round', ({ newHand, opponentCards }) => {
      console.log('New Round Started, hand:', newHand)
      dispatch(newRound({ newHand, opponentCards }))
    })
  }, [])

  useEffect(() => {
    socket.on('game over', ({ winner }) => {
      dispatch(setTable([]))
      openModal(winner)
      console.log('winner', winner)
      // alert('winner is ' + winner + '!');
    })
  }, [])

  function openModal (winner) {
    setNewWinner(winner)
    setIsOpen(true)
  }

  function afterOpenModal () {
    // references are now sync'd and can be accessed.
  }

  function closeModal () {
    setIsOpen(false)
  }

  return (
    <div className={styles.outterContainer}>
      {/* <h1>Game</h1> */}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel='Game Over'
        ariaHideApp={false}
        style={modalStyle}
      >
        <div id='modal'>
          <h1>Game Over</h1>

          <h2>
            {newWinner === 'it was even!'
              ? newWinner
              : `new winner is ${newWinner}`}
          </h2>
          <Link
            className={styles.backToLobyBtn}
            onClick={() => {
              dispatch(
                backToLoby({ name: player.name, room: player.socket.room })
              )
              setNewWinner('')
              setSeconds(15)
            }}
            to={`/loby`}
          >
            <span className='backToLobyBtn'>back to loby</span>
          </Link>
        </div>
      </Modal>
      <div className={styles.gameCol}>
        <Player
          player={player.opponent}
          tabla={player.opponent.tabla}
          activeClass={player.onMove ? false : true}
          // moveTime={player.onMove ? '' : `you have ${seconds}s to make move`}
        />

        <Table player={player} />

        <Player
          player={player}
          tabla={player.tabla}
          activeClass={player.onMove ? true : false}
          moveTime={!player.onMove ? '' : `you have ${seconds}s to make move`}
        />
      </div>
      <div className={styles.chatCol}>
        <Chat player={player} />
      </div>
    </div>
  )
}

export default Game
