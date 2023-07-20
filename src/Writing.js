import { Typography, Stack, Box, LinearProgress, TextField, Button, Chip } from '@mui/material'
import React, { useEffect, useState } from 'react'
import PlayerStatus from './PlayerStatus'

function Writing({setWord, currentWordList, players}) {

  const [localWord, setLocalWord] = useState("")
  const [countDownValue, setCountDownValue] = useState(0)
  const randomWords = ["too lazy to think of a word", "i am an idiot", "help, i can't do this", "?"]
  const [submittedWord, setSubmittedWord] = useState(false)


  useEffect(() => {
    const timer = setInterval(() => {
      setCountDownValue((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 1
        } else {
          submitWord()
          setSubmittedWord(true)
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
    if (localWord === "") {
      setWord(randomWords[Math.round(Math.random() * randomWords.length)])
    } else {
      setWord(localWord)

    }
  }

  return (
    <>
    <Stack spacing={2}>
    <PlayerStatus players={players} state={2}></PlayerStatus>
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
        <Stack direction="row" spacing={2} justifyContent="center"
        alignItems="center">{
        currentWordList.map(wordObj => {
          return <Chip key={wordObj.playerID} label={wordObj.word}></Chip>
        })
        }</Stack>
      </>
    }
    <TextField
      autoFocus
      autoComplete='off'
      id="localword"
      label="Enter a word"
      variant="outlined"
      value={localWord}
      onChange={(e) => setLocalWord(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          submitWord()
        }
      }}
    />
    <Button variant="contained" onClick={submitWord}>{
    submittedWord ? "Waiting for Others" : "Submit" }</Button>
      </Stack>
    </>
  )
}

export default Writing