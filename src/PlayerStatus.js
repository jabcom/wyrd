import React from 'react'
import { Stack, Chip } from '@mui/material'

function PlayerStatus({players, state}) {

  return (
        <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        >
            {
                Object.keys(players).map(peerID => {
                    if (players[peerID].state !== state) {
                        return(<Chip
                            key={peerID}
                            label={players[peerID].username}
                            color="info"
                            variant="outlined"
                        />)
                    } else {
                        return(<Chip
                            key={peerID}
                            label={players[peerID].username}
                            color="info"
                        />)
                    }
                })
            }
        </Stack>
  )
}

export default PlayerStatus