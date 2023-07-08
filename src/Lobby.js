import { Typography, Stack } from '@mui/material'
import React from 'react'

function Lobby({players}) {
  return (
    <>
    <Typography>Lobby</Typography>
    {Object.keys(players).forEach(peerID => {
      <Typography key={peerID}> players[peerID].username </Typography>
    })}
    </>
  )
}

export default Lobby