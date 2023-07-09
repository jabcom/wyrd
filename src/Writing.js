import { Typography, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'

function Writing({setWord, currentWordList, runningWordList}) {

  const [localWord, setLocalWord] = useState("")

  useEffect(() => {
    //check local word not in both word lists, and not empty
  }, [localWord])

  function setWord() {
    //do the checks, then send to app
    setWord(localWord)
  }

  return (
    <>
    <Typography>Write a word that links the following words:</Typography>
    <Stack direction="row" spacing={2}>

    </Stack>

    </>
  )
}

export default Writing