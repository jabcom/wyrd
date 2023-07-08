import React from 'react'
import NoPlayers from './NoPlayers'
import Lobby from './Lobby'
import Writing from './Writing'
import Reveal from './Reveal'
import { Typography, Stack } from '@mui/material'


function Game({players, myPeerID, gameStage,  showSharePopup, setShowSharePopup}) {

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
            ></Lobby>
        }
        if (gameStage === 'writing') {
            return <Writing></Writing>
        }
        if (gameStage === 'reveal') {
            return <Reveal></Reveal>
        }
        return <Typography>An error occured - no gameStage found</Typography>


    }

    let pageToShow = <NoPlayers myPeerID={myPeerID}></NoPlayers>

  return (
    getPageToShow()
  )
}

export default Game