import { Typography, Stack, Box, LinearProgress, TextField, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PlayerWritingStatus from './PlayerWritingStatus'

function Writing({setWord, currentWordList, runningWordList, players}) {

  const [localWord, setLocalWord] = useState("")
  const [countDownValue, setCountDownValue] = useState(0)


  useEffect(() => {
    const timer = setInterval(() => {
      setCountDownValue((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 1
        } else {
          submitWord()
        }
        clearInterval(timer)
        return prevProgress
      })
    }, 300)
    return () => {
      clearInterval(timer)
    }
  },[])


  useEffect(() => {
    //check local word not in both word lists, and not empty
  }, [localWord])

  function submitWord() {
    //do the checks, then send to app
    setWord(localWord)
  }

  return (
    <>
    <Stack spacing={2}>
    <PlayerWritingStatus players={players}></PlayerWritingStatus>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={countDownValue} />
      </Box>
    </Box>
    {currentWordList.length === 0 &&
    <Typography>Write a word, any word</Typography>
    }
    {
      currentWordList.length > 0 &&
      <>
        <Typography>Write a word that links the following words:</Typography>
        <Stack direction="row" spacing={2}></Stack>
      </>
    }
    <TextField
      autoFocus
      autoComplete='off'
      id="localword"
      label="Enter a word"
      variant="outlined"
      value={localWord}
      onChange={(e) => setLocalWord(e.target.value.replace(/[^a-z0-9]/gi, ''))}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          submitWord()
        }
      }}
    />
    <Button variant="contained" onClick={submitWord}>Submit</Button>
      </Stack>
    </>
  )
}

export default Writing