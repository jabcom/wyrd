import React from 'react'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { Typography, Button } from '@mui/material'

function NotInGame() {
  return (
    <>
        <Grid container spacing={2}>
        <Grid item xs={12}>
            <Typography variant="h1" align="center">wyrd</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography align='center'>
                <Button variant="contained">Create New Game</Button>
            </Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography align='center'>
                <Button variant="contained">Join Existing Game</Button>
            </Typography>
        </Grid>
    </Grid>
    </>
  )
}

export default NotInGame