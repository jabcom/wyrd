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
        <Stack
        justifyContent="center"
        alignItems="center"
        spacing={2}
        >
            <Typography align='center'>
                A project to test React and PeerJS for P2P game networking
            </Typography>
            <Typography align='center'>
                <Button onClick={() => setShowNewGameBox(true)} variant="contained">Create New Game</Button>
            </Typography>
        <Typography align='center'>
            To join a game ask the host to send an invite link
        </Typography>
        <Typography>ver 0.1</Typography>
    </Stack>

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