import React from 'react'
import InviteBox from './InviteBox'
import { Typography, Stack } from '@mui/material'

function NoPlayers({myPeerID ,showSharePopup, setShowSharePopup}) {
  return (
    <>
    <Stack spacing={2}>
        <Typography align="center" variant="h4">Invite others to start playing</Typography>
        <InviteBox
          myPeerID={myPeerID}
          showSharePopup={showSharePopup}
          setShowSharePopup={setShowSharePopup}
        ></InviteBox>
    </Stack>
    </>
  )
}

export default NoPlayers