
import './App.css';
import { useEffect, useState } from 'react';
import '@fontsource/roboto/400.css';
import { Container } from '@mui/material';
import NotInGame from './NotInGame';
import Lobby from './Lobby';
import PeerJS from "peerjs";
import ErrorBox from './ErrorBox';

function App() {

  const [gameStage, setGameStage] = useState(0)
  const [runningWordList, setRunningWordList] = useState({})
  const [currentWordList, setCurrentWordList] = useState({})
  const [username, setusername] = useState("")
  const [peerJS, setPeerJS] = useState()
  const [peers, setPeers] = useState({})
  const [players, setPlayers] = useState({})
  const [inGame, setInGame] = useState(false)
  /*
    id: {username, state}
  */
  const [playerState, setPlayerState] = useState(0)
  /*
    0 idle
    1 writing
    2 ready to reveal
    3 ready for next round
  */
  const [word, setWord] = useState(null)
  const [gameWon, setGameWon] = useState(false)
  const [errorList, setErrorList] = useState([])

  //Checks if user is in game based of player count
  useEffect(() => {
    if (Object.keys(players).length === 0) {
      setInGame(false)
    } else {
      setInGame(true)
    }
  }, [players])

  //Show error
  function showError(msg) {
    setErrorList(currentErrors => {
      let newList = [...currentErrors, msg]
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

  //peer functions

  function connectToPeer(id) {
    //need to check for errors
    const peerConnection = peerJS.connect(id)
    setPeers(currnetPeers => {
      currnetPeers.id = peerConnection
      return currnetPeers
    })
    //note player table gets updated once game state is recieved
    //setup peer callbacks
    peers.id.on("open", () => {
      console.log("Connecting to " + id)
    })
    peers.id.on("data", (data) => {
      console.log("Received data from + " + id + "\n" + data)
      switch(data.request) {
        case "requestState":
          sendState(id)
          break
        case "stateUpdate":
          handleRecievedState(id, data.myState)
          break
        default:
          console.error("Unknown request type", id, data)
      }
    })
    //get state from peer
    peerConnection.send({request: "requestState"})
  }

  //Peer handle functions

  function handleDisconnect(peer) {
    setPeers(peers.filter(p => p !== peer))
    let peerID = peer.peer
    //not sure about this one
    setPeers(players.filter(p => p.id !== peerID))
  }

  function handleRecievedState(peerID, stateData) {
    setPlayers(currentPlayers => {
      currentPlayers[peerID] = stateData
      return currentPlayers
    })
    //check for new peer connections
    for (let index = 0; index < stateData.peers; index++) {
      if (!(stateData.peers[index]) in players) {
        connectToPeer(stateData.peers[index])
      }
    }
    processStateUpdate()
  }

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

  function sendAllState () {
    players.forEach((player, peerID) => {
      sendState(peerID)
    })
  }

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


function restartGame() {
  setRunningWordList(currentWordList)
  setCurrentWordList({})
  setPlayerState(0)
  setGameStage(0)
  sendAllState()
}

  return (
    <Container maxWidth="sm">
    <ErrorBox errorList={errorList}>
    </ErrorBox>
 
    {inGame === false && 
    <NotInGame
      username={username}
      setusername={setusername}
      peerJS={peerJS}
      setPeerJS={setPeerJS}
    ></NotInGame>
    }
    </Container>
  );
}

export default App;
