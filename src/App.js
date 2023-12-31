
import './App.css';
import { useEffect, useState } from 'react';
import '@fontsource/roboto/400.css';
import { Container, TextField, Dialog, DialogActions, Button, DialogTitle, DialogContent, DialogContentText, Box} from '@mui/material';
import NotInGame from './NotInGame';
import PeerJS from "peerjs";
import ErrorBox from './ErrorBox';
import TopBar from './TopBar';
import Game from './Game';

function App() {

  const [gameStage, setGameStage] = useState(null)
  const [runningWordList, setRunningWordList] = useState([]) //[{peerID: word}]
  const [currentWordList, setCurrentWordList] = useState([]) //{peerID, word}
  const [username, setUsername] = useState("")
  const [gloablPeerJS, setGlobalPeerJS] = useState(null)
  const [peers, setPeers] = useState({})
  const [players, setPlayers] = useState({}) //id: {username, state}
  const [playerState, setPlayerState] = useState(0) // 0:idle, 1:writing, 2:ready to reveal, 3: ready for next round
  const [word, setWord] = useState(null)
  const [gameWon, setGameWon] = useState(false)
  const [errorList, setErrorList] = useState([])
  const [initialPeer, setInitialPeer] = useState(null)
  const [myPeerID, setMyPeerID] = useState("")
  const [showJoinPopup, setShowJoinPopup] = useState(false)
  const [tmpUsername, setTmpUsername] = useState("")
  const [showSharePopup, setShowSharePopup] = useState(false)

  //check if user is joining a game
  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search)
    let peerFromURL = searchParams.get('peer')
    if (peerFromURL !== "" && peerFromURL !== undefined && peerFromURL !== null && gloablPeerJS === null) {
      console.log("peerID found in URL", peerFromURL)
      setInitialPeer(peerFromURL)
      setShowJoinPopup(true)
    }
  },[])

  //connect once username is set
  useEffect(() => {
    if (gloablPeerJS === null && username !== "") {
      setupPeerJS()
    }
  },[username])

  //update players state in the players list
  useEffect(() => {
    if (gloablPeerJS !== null) {
      if (players[myPeerID].state !== playerState) {
        setPlayers(currentPlayers => {
          let newPlayers = {...currentPlayers}
          newPlayers[myPeerID].state = playerState
          return newPlayers
          //send update after players state updated
        })
        //hack to wait till players are updated before sending state
        setPlayers((currentPlayers) => {
          sendAllState()
          return currentPlayers
        })
      }
    }
  },[playerState])

  useEffect(() => {
    console.log("Updating peer callback functions")
    Object.keys(peers).forEach(peerID => {
      peers[peerID].on('error', (error) => {
        handlePeerError(error)
      })
      peers[peerID].on('data', (data) => {
        console.log("Got data", peerID, JSON.stringify(data))
        handleRecievedData(data, peerID)
      })
      peers[peerID].on('open', () => {
        console.log("Connection opened with", peerID)
        peers[peerID].send({request: "requestState"})
      })
      peers[peerID].on('close', () => {
        console.log("connection lost to", peerID)
        handlePeerDisconnect(peerID)
      })
    })
  },[peers])

  //process state update if players changes
  useEffect(() => {
    if (gloablPeerJS !== null) {
    processStateUpdate()
    }
  }, [players])

  //check for word changes
  useEffect(() => {
    if (word !== null) {
      setPlayers(currentPlayers => {
        let newPlayers = {...currentPlayers}
        newPlayers[myPeerID].word = word
        return newPlayers
      })
      //hack to wait till players are updated before sending state
      setPlayers((currentPlayers) => {
        setPlayerState(2)
        return currentPlayers
      })
    }
  }, [word])


  function getListOfOtherPlayers() {
    let tmpPlayerObj = players
    delete tmpPlayerObj[myPeerID]
    return Object.keys(tmpPlayerObj)
  }

function joinGame() {
  setShowJoinPopup(false)
  setUsername(tmpUsername)
}

function setupPeerJS() {
  console.log("Running peer init")
  //check if username is set
  if (username === "") {
    showError("Username not set")
    return
  }
    if (gloablPeerJS === null || gloablPeerJS === undefined) {
      const peerJS = new PeerJS()
      //peerJS connected to server
      peerJS.on('open', peerID => {
        setMyPeerID(peerID)
        //set local user to players list
        let playersObj = {}
        playersObj[peerID] = {
          state: 0,
          username: username,
          word: null,
          peers: []
        }
        setPlayers(playersObj)
        console.log("Started PeerJS with ID:", peerID)
        if (initialPeer !== "" && initialPeer !== undefined && initialPeer !== null) {
          //try to connect to peer, and send result to peer handleer
          console.log("Trying to connect to peer from URL", initialPeer)
          handlePeerConnection(peerJS.connect(initialPeer))
        }
      })
      //new data connection - i.e. connection from other peer
      peerJS.on('connection', (dataConnection => handlePeerConnection(dataConnection)))
      //handle error connecting to server
      peerJS.on('error', error => handlePeerError(error))

      peerJS.on('close', () => showError("Peer instance closed"))
      //save peer instance to state
      setGlobalPeerJS(peerJS)
    } else {
      showError("PeerJS tried to start when already started")
    }
}


  //Show error
  function showError(msg) {
    console.error(msg)
    //check if error already exists
    //TODO Fix this
    //setErrorList(currentList => {return currentList})
    let errorString = JSON.stringify(msg)
    if (!errorList.includes(errorString)) {
      setErrorList(currentErrors => {
        let newList = [...currentErrors, errorString]
        return newList
      })
      setTimeout(() => {
        setErrorList(currentErrors => {
          //remove first element
          let newList = [...currentErrors]
          newList.shift()
          return newList
        })
      }, 3000)
    } else {
      console.error("Duplicate error, not showing in UI")
    }
  }

  //connected to peer
  function handlePeerConnection(peerConnection) {
    let peerID = peerConnection.peer
    console.log("connected to peer", peerID)
    setPeers(currentPeers => {
      let peerList = {...currentPeers}
      peerList[peerID] = peerConnection
      return peerList
    })
  }

  function handlePeerError(error) {
    if (error.type === "disconnected") {
      showError("A player has disconnected")
      return
    }
    if (error.type === "network") {
      showError("Your connection to the network has failed")
      return
    }
    if (error.type === "peer-unavailable") {
      showError("Unable to connect to player")
      return
    }
    if (error.type === "server-error") {
      showError("the signaling server is unavailable")
      return
    }
    showError("An unknown error with a peer has been detected " + error)
  }

  //ask peer for state
  function requestState(peerID) {
    peers[peerID].send({request: "requestState"})
  }
  //disconnected
  //TODO - if last player, reset the game
  function handlePeerDisconnect(peerID) {
    showError("Peer disconnected")
    setPeers(currentPeers => {
      let newPeers = {...currentPeers}
      delete newPeers[peerID]
      return newPeers
    })
    setPlayers(currentPlayers => {
      let newPlayers = {...currentPlayers}
      delete newPlayers[peerID]
      return newPlayers
    })
  }

  //got data from peer
  function handleRecievedData(data, peerID) {
    console.log("Processing data", peerID, JSON.stringify(data))
      switch(data.request) {
        case "requestState":
          console.log("player requested my state", peerID)
          sendState(peerID)
          break
        case "stateUpdate":
          handleRecievedState(peerID, data.myState)
          break
        default:
          console.error("Unknown request type", peerID, data)
      }
  }

  //connect to a peer
  function connectToPeer(id) {
    const peerConnection = gloablPeerJS.connect(id)
    handlePeerConnection(peerConnection)
  }

  //recieved state from a peer
  function handleRecievedState(peerID, stateData) {
    console.log("got state data", peerID, stateData)
    setPlayers(currentPlayers => {
      let tmpPlayers = {...currentPlayers}
      tmpPlayers[peerID] = stateData
      return tmpPlayers
    })
    //check for new peer connections
    stateData.peers.forEach(remotePeerID => {
      //if peer is not player, or already in list
      if (remotePeerID !== myPeerID && (!(Object.keys(peers).includes(remotePeerID)))) {
        console.log("trying to connect to", remotePeerID)
        connectToPeer(remotePeerID)
      }
    })
  }

  //send state to peer
  function sendState(peerID) {
    console.log("Sending state to", peerID)
    let myState = {
      state: playerState,
      username: username,
      word: word,
      peers: Object.keys(players)
    }
    peers[peerID].send({request: "stateUpdate", myState: myState})
  }

  //send state to all peers
  function sendAllState () {
    getListOfOtherPlayers().forEach((peerID) => {
      sendState(peerID)
    })
  }

  //game logic
  function processStateUpdate() {
    console.log("processing state update")
    let playersAtSameState = true
    Object.keys(players).forEach(peerID => {
      if (players[peerID].state !== playerState) {
        playersAtSameState = false
        return
      }
    })
    if (playersAtSameState) {
      console.log("players at same state", playerState)
      switch(playerState) {
        case 0:
          // idle
          setGameStage('lobby')
          break
        case 1:
          //ready to write
          setGameStage('writing')
           break
        case 2:
          //update word lists
          let newWordList = []
          Object.keys(players).forEach(playerID => {
            newWordList.push({playerID: playerID, word: players[playerID].word})
           })
           setRunningWordList(cval => {
            return [...cval, newWordList]
           })
           setCurrentWordList(newWordList)
          //ready to reveal
          setGameStage('reveal')
          break
        case 3:
          //ready for next round
          setRunningWordList(cval => {
            let newRunningWordList = [...cval]
            newRunningWordList.push(currentWordList)
            return newRunningWordList
          })
          setWord(null)
          setPlayerState(0)
          //processStateUpdate()
          break
        default:
          console.error("Opps, players aggreed on unknown state")
      }
    }
  }


  return (
    <>
    <TopBar 
      myPeerID={myPeerID}
      showSharePopup={showSharePopup}
      setShowSharePopup={setShowSharePopup}
    ></TopBar>
    <ErrorBox
      errorList={errorList}
    >
    </ErrorBox>
    <Box sx={{ display: 'flex', alignItems: 'center', m: 2 }}>
    <Container maxWidth="sm">
    {gloablPeerJS === null && 
    <NotInGame
      setInitialPeer={setInitialPeer}
      setUsername={setUsername}
      setupPeerJS={setupPeerJS}
      showError={showError}
    ></NotInGame>
    }
    {gloablPeerJS !== null &&
    <Game
      showError={showError}
      gameStage={gameStage}
      setGameStage={setGameStage}
      players={players}
      myPeerID={myPeerID}
      showSharePopup={showSharePopup}
      setShowSharePopup={setShowSharePopup}
      setPlayerState={setPlayerState}
      setWord={setWord}
      currentWordList={currentWordList}
      runningWordList={runningWordList}
    >
    </Game>
    }
    <Dialog open={showJoinPopup} onClose={() => setShowJoinPopup(false)}>
        <DialogTitle>
            Joining Existing Game
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
                value={tmpUsername}
                onChange={(e) => setTmpUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    joinGame()
                  }
                }}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowJoinPopup(false)}>Cancel</Button>
          <Button 
           onClick={joinGame}>Join Game</Button>
        </DialogActions>
    </Dialog>
    </Container>
    </Box>
    </>
  );
}

export default App;
