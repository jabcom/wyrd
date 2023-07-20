import React from 'react'

import {Typography, Button, Card, CardContent, Backdrop, CardActions, Stack, CircularProgress } from '@mui/material'
import { RWebShare } from "react-web-share";
import QRCode from 'react-qr-code';

function InviteBox({setShowSharePopup, myPeerID}) {
  const inviteURL = "https://wyrd.server.pizza/?peer=" + myPeerID
  return (
    <>
    <Card sx={{ minWidth: 275 }}>
            <CardContent>
              {myPeerID === "" && 
              <CircularProgress />
              }
              {
                myPeerID !== "" && 
                <Stack spacing={2}>
                  <RWebShare
                      data={{
                      text: "W Y R D invite",
                      url: inviteURL,
                      title: "W Y R D",
                      }}
                      onClick={() => setShowSharePopup(false)}
                  >
                  <Button
                      size="large"
                      variant='outlined'
                  >Share Invite link</Button>
              </RWebShare>
              <Typography align='center'>
                Or scan this code:
              </Typography>
              <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={inviteURL}
                viewBox={`0 0 256 256`}
              />
              </Stack>
            }
            </CardContent>
            <CardActions>
              <Button onClick={() => setShowSharePopup(false)}size="small">Close</Button>
            </CardActions>
        </Card>
    </>
  )
}

export default InviteBox