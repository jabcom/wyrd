import React, { useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Typography, Button, TextField, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'

function NotInGame({setUsername, showError}) {

    const [showNewGameBox, setShowNewGameBox] = useState(false)
    const [localUsername, setLocalUsername] = useState("")

    function startNewGame() {
        if (localUsername === undefined || localUsername === "") {
            //username invalid
            showError("Username Invalid")
            return
        }
        setShowNewGameBox(false)
        setUsername(localUsername)
    }

  return (
    <>
        <Grid container spacing={2}>
        <Grid item xs={12}>
            Wyrd Description and rules
        </Grid>
        <Grid item xs={6}>
            <Typography align='center'>
                <Button onClick={() => setShowNewGameBox(true)} variant="contained">Create New Game</Button>
            </Typography>
        </Grid>
        <Typography align='center'>
            To join a game ask the host to send an invite link
        </Typography>
    </Grid>

    <Dialog open={showNewGameBox} onClose={() => setShowNewGameBox(false)}>
        <DialogTitle>
            New Game
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                Enter your username
            </DialogContentText>
            <TextField
                autoFocus
                autoComplete='off'
                id="username"
                label="Username"
                variant="outlined"
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value.replace(/[^a-z0-9]/gi, ''))}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      startNewGame()
                    }
                  }}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewGameBox(false)}>Cancel</Button>
          <Button 
           onClick={startNewGame}>Start Game</Button>
        </DialogActions>
    </Dialog>
    </>
  )
}

export default NotInGame