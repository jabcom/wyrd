
import './App.css';
import { useEffect, useState } from 'react';
import '@fontsource/roboto/400.css';
import { Container} from '@mui/material';
import NotInGame from './NotInGame';
import Lobby from './Lobby';
import PeerJS from "peerjs";
import ErrorBox from './ErrorBox';
import TopBar from './TopBar';

function App() {

  const [gameStage, setGameStage] = useState(0)
  const [runningWordList, setRunningWordList] = useState([]) //[{peerID, word}]
  const [currentWordList, setCurrentWordList] = useState({}) //{peerID, word}
  const [username, setUsername] = useState("")
  const [gloablPeerJS, setGlobalPeerJS] = useState(null)
  const [peers, setPeers] = useState({})
  const [players, setPlayers] = useState({}) //id: {username, state}
  const [inGame, setInGame] = useState(false)
  const [playerState, setPlayerState] = useState(0) // 0:idle, 1:writing, 2:ready to reveal, 3: ready for next round
  const [word, setWord] = useState(null)
  const [gameWon, setGameWon] = useState(false)
  const [errorList, setErrorList] = useState([])
  const [initialPeer, setInitialPeer] = useState(null)
  const [myPeerID, setMyPeerID] = useState("")

  //Checks if user is in game based of player count
  useEffect(() => {
    if (Object.keys(players).length === 0) {
      setInGame(false)
    } else {
      setInGame(true)
    }
  }, [players])

function setupPeerJS() {
  console.log("Running peer init")
    if (gloablPeerJS === null || gloablPeerJS === undefined) {
      const peerJS = new PeerJS()
      //peerJS connected to server
      peerJS.on('open', peerID => {
        setMyPeerID(peerID)
        console.log("Started PeerJS with ID:", peerID)
        //if peer supplied by URL try to connect
        const searchParams = new URLSearchParams(document.location.search)
        let initialPeerID = searchParams.get('peer')
        if (initialPeerID !== "" && initialPeerID !== undefined && initialPeerID !== null) {
          //try to connect to peer, and send result to peer handleer
          console.log("Trying to connect to peer from URL", initialPeerID)
          handlePeerConnection(peerJS.connect(initialPeerID))
        }
      })
      //new data connection - i.e. connection from other peer
      peerJS.on('connection', (dataConnection => handlePeerConnection(dataConnection)))
      //handle error connecting to server
      peerJS.on('error', error => showError(error))

      peerJS.on('close', () => showError("Peer instance closed"))
      //save peer instance to state
      setGlobalPeerJS(peerJS)
    } else {
      showError("PeerJS tried to start when already started")
    }
}

/*
  //run on startup to init PeerJS
  useEffect(() => {
    console.log("Running peer init")
    if (gloablPeerJS === null || gloablPeerJS === undefined) {
      const peerJS = new PeerJS()
      //peerJS connected to server
      peerJS.on('open', peerID => {
        setMyPeerID(peerID)
        console.log("Started PeerJS with ID:", peerID)
        //if peer supplied by URL try to connect
        const searchParams = new URLSearchParams(document.location.search)
        let initialPeerID = searchParams.get('peer')
        if (initialPeerID !== "" && initialPeerID !== undefined && initialPeerID !== null) {
          //try to connect to peer, and send result to peer handleer
          console.log("Trying to connect to peer from URL", initialPeerID)
          handlePeerConnection(peerJS.connect(initialPeerID))
        }
      })
      //new data connection - i.e. connection from other peer
      peerJS.on('connection', (dataConnection => handlePeerConnection(dataConnection)))
      //handle error connecting to server
      peerJS.on('error', error => showError(error))

      peerJS.on('close', () => showError("Peer instance closed"))
      //save peer instance to state
      setGlobalPeerJS(peerJS)
    } else {
      showError("PeerJS tried to start when already started")
    }
    return ((peerJS) => {
      try {setGlobalPeerJS.destroy()} catch (e) {
        showError("Failed to destroy old peerJS instance ")
        console.error(e)
      }
    })
  }, [])
*/
  //Show error
  function showError(msg) {
    console.error(msg)
    setErrorList(currentErrors => {
      let newList = [...currentErrors, JSON.stringify(msg)]
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
  }

  //connected to peer
  function handlePeerConnection(peerConnection) {
    let peerID = peerConnection.peer
    if (!(peerConnection.reliable)) {
      showError("Peer connected, but with an unreliable connection", peerID)
    }
    peerConnection.on('error', error => showError(error))
    peerConnection.on('data', data => handleRecievedData(data, peerID))
    peerConnection.on('open', () => peerConnection.send({request: "requestState"}))
    peerConnection.on('close', () => handlePeerDisconnect(peerID))
    //update object of peer connections 
    setPeers(currentPeers => {
      let peerList = {...currentPeers}
      peerList[peerID] = peerConnection
      return peerList
    })
  }

  //ask peer for state
  function requestState(peerID) {
    peers[peerID].send({request: "requestState"})
  }
  //disconnected
  function handlePeerDisconnect(peerID) {
    showError("Peer disconnected", peerID)
    setPeers(currentPeers => {
      let newPeers = currentPeers.filter(p => p.id !== peerID)
      return newPeers
    })
    setPlayers(currentPlayers => {
      let newPlayers = currentPlayers.filter(p => p.id !== peerID)
      return newPlayers
    })
  }

  //got data from peer
  function handleRecievedData(data, peerID) {
    console.log("Received data from + " + peerID + "\n" + data)
      switch(data.request) {
        case "requestState":
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
    setPlayers(currentPlayers => {
      currentPlayers[peerID] = stateData
      return currentPlayers
    })
    //check for new peer connections
    for (let index = 0; index < stateData.peers; index++) {
      if (!((stateData.peers[index]) in players)) {
        connectToPeer(stateData.peers[index])
      }
    }
    processStateUpdate()
  }

  //send state to peer
  function sendState(peerID) {
    let peerIDs = []
    players.forEach((player, peerID) => {
      peerIDs.push(peerID)
    })
    let myState = {
      state: playerState,
      username: username,
      word: word,
      peers: peerIDs
    }
    peers[peerID].send({request: "stateUpdate", myState: myState})
  }

  //send state to all peers
  function sendAllState () {
    players.forEach((player, peerID) => {
      sendState(peerID)
    })
  }

  //game logic
  function processStateUpdate() {
    let playersAtSameState = true
    players.forEach(player => {
      if (player.state !== playerState) {
        playersAtSameState = false
        return
      }
    })
    if (playersAtSameState) {
      switch(playerState) {
        case 0:
          // idle
          setGameStage(0)
          break
        case 1:
          //writing - no need to take action
           break
        case 2:
          //ready to reveal
          setGameStage(2)
          break
        case 3:
          //ready for next round
          restartGame()
          break
        default:
          console.error("Opps, players aggreed on unknown state")
      }
    }
  }


  //restart the game
  function restartGame() {
    //add current word list to saved word list array
    setRunningWordList(currentRunningWordList => {
      let newRunningWordList = [...currentRunningWordList]
      newRunningWordList.push(currentWordList)
      return newRunningWordList
    })
    setCurrentWordList({})
    setPlayerState(0)
    setGameStage(0)
    sendAllState()
    processStateUpdate() //if player is last to update
  }

  return (
    <>
    <TopBar 
      myPeerID={myPeerID}
    ></TopBar>
    <Container maxWidth="sm">
    <ErrorBox
      errorList={errorList}
    >
    </ErrorBox>
    {inGame === false && 
    <NotInGame
      setInitialPeer={setInitialPeer}
      setUsername={setUsername}
      setupPeerJS={setupPeerJS}
      showError={showError}
    ></NotInGame>
    }
    {inGame === true &&
    <>
    <h1>Connected</h1>
    </>
    }
    </Container>
    </>
  );
}

export default App;
