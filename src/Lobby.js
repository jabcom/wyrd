import { Typography, Stack, Button, List, Table, TableHead, TableBody, TableRow, Chip, TableCell } from '@mui/material'
import React from 'react'
function Lobby({players, myPeerID, setPlayerState}) {

  function readyToStartText() {
    if (players[myPeerID].state === 0) {
      return "Ready to start?"
    }
    if (players[myPeerID].state === 1) {
      return "Wait for more players"
    }
    return "Player state error"
  }

  function toggleReadyState() {
    if (players[myPeerID].state === 0) {
      setPlayerState(1)
    }
    if (players[myPeerID].state === 1) {
      setPlayerState(0)
    }

  }

  return (
    <>
    <Stack spacing={2}>
    <Table sx={{}}>
    <TableHead>
      <TableRow>
        <TableCell>Player</TableCell>
        <TableCell align="right">Ready</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
    {Object.keys(players).map((peerID) => {
      return(
        <TableRow key={peerID}>
          <TableCell>{players[peerID].username}</TableCell>
          <TableCell align="right">
            {players[peerID].state === 0 && <Chip label="No" />}
            {players[peerID].state === 1 && <Chip label="Yes" color="success" />}
          </TableCell>
        </TableRow>
      )
    })}
    </TableBody>
    </Table>
    <Button variant="contained" onClick={(toggleReadyState)}>{readyToStartText()}</Button>
    </Stack>
    
    </>
  )
}

export default Lobby