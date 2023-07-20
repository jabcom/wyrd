import {useState} from 'react'
import { AppBar, Toolbar, IconButton, Typography, Button, Backdrop,  } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import InviteBox from './InviteBox'
import logoImage from './images/logo-no-background.svg'

function TopBar({myPeerID, showSharePopup, setShowSharePopup}) {


  return (
    <AppBar position="static">
        <Toolbar>
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align="center">
          <img 
            src={logoImage}
            alt="w y r d"
            width="80%"
            height="50px"
            //sx={{margin: "5px"}}
          />
          </Typography>
            {myPeerID !== "" && 
                <Button 
                  variant= 'outlined'
                  sx={{color:'white', borderColor:'white'}}
                  onClick={() => setShowSharePopup(true)}
                >Invite Others</Button>
            }
        </Toolbar>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={showSharePopup}
        >
          <InviteBox
            setShowSharePopup={setShowSharePopup}
            myPeerID={myPeerID}
          ></InviteBox>
      </Backdrop>
    </AppBar>
  )
}

export default TopBar