import React from 'react'
import NoPlayers from './NoPlayers'
import Lobby from './Lobby'
import Writing from './Writing'
import Reveal from './Reveal'
import { Typography, Stack, Box, LinearProgress } from '@mui/material'


function Game({
    players,
    myPeerID,
    gameStage, 
    showSharePopup,
    setShowSharePopup,
    setPlayerState,
    setWord,
    currentWordList,
    runningWordList
    }) {

    function getPageToShow() {
        //No Players
        if (Object.keys(players).length === 1) {
            return <NoPlayers
                myPeerID={myPeerID}
                showSharePopup={showSharePopup}
                setShowSharePopup={setShowSharePopup}
                ></NoPlayers>
        }
        if (gameStage === 'lobby') {
            return <Lobby
                players={players}
                myPeerID={myPeerID}
                setPlayerState={setPlayerState}
            ></Lobby>
        }
        if (gameStage === 'writing') {
            return <Writing
                setWord={setWord}
                currentWordList={currentWordList}
                runningWordList={runningWordList}
            ></Writing>
        }
        if (gameStage === 'reveal') {
            return <Reveal></Reveal>
        }
        return <LinearProgress />



    }

    let pageToShow = <NoPlayers myPeerID={myPeerID}></NoPlayers>

  return (
    getPageToShow()
  )
}

export default Game