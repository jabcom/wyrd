import React from 'react'

import {Typography, Button, Card, CardContent, Backdrop, CardActions } from '@mui/material'
import { RWebShare } from "react-web-share";

function InviteBox({setShowSharePopup, myPeerID}) {
  return (
    <>
    <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                Invite Friends
              </Typography>
              <Typography variant="h5" component="div">
                <RWebShare
                    data={{
                    text: "W Y R D invite",
                    url: "https://wyrd.distantridge.com/peer=myPeerID",
                    title: "W Y R D",
                    }}
                    onClick={() => setShowSharePopup(false)}
                >
                <Button
                    size="large"
                    variant='outlined'
                >Share 🔗</Button>
            </RWebShare>
              </Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => setShowSharePopup(false)}size="small">Close</Button>
            </CardActions>
        </Card>
    </>
  )
}

export default InviteBox