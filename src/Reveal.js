/*
  Show the words from the other players.
  If two or more match show a winning page
  have a time to continue or button for game won

*/
import {React, useState, useEffect} from 'react'
import { TableCell, Table, TableBody, TableContainer, TableHead, TableRow, Paper, Typography, Stack, Button, Box, LinearProgress } from '@mui/material'
import PlayerStatus from './PlayerStatus'

function Reveal({players, currentWordList, setPlayerState}) {

  const [countDownValue, setCountDownValue] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountDownValue((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 1
        } else {
          nextRound()
        }
        clearInterval(timer)
        return prevProgress
      })
    }, 200)
    return () => {
      clearInterval(timer)
    }
  },[])

  function nextRound() {
    setPlayerState(3)
    setReady(true)
  }

  return (
    <>
    <Stack spacing={2}>
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {currentWordList.map(wordObj => (
            <TableRow
              key={wordObj.playerID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="right">
                <Typography variant='h5'>{wordObj.word}</Typography>
              </TableCell>
              <TableCell align="left">
                {players[wordObj.playerID].username}
              </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={countDownValue} />
    </Box>
    <Box sx={{ width: '100%', mr: 1 }}>
      <PlayerStatus players={players} state={3}></PlayerStatus>
    </Box>
      <Typography>Next round will start in {20 - Math.round(countDownValue / 5)}s</Typography>
      <Button onClick={nextRound} variant='contained'>{
    ready? "Waiting for Others" : "Ready for Next Round"}</Button>
    </Stack>
    </>
  )
}

export default Reveal