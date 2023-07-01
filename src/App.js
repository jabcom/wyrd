
import './App.css';
import { useEffect, useState } from 'react';
import MainGame from './MainGame';
import NotInGame from './NotInGame';
import PeerJS from "peerjs";

function App() {

  const [gameState, setGameState] = useState(0)
  /*
    0 lobby/revealed
    1 writing
  */
  const [oldWordList, setOldWordList] = useState({})
  const [currentWordList, setCurrentWordList] = useState({})
  const [username, setusername] = useState("")
  const [peerJS, setPeerJS] = useState(new PeerJS())
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

  //Checks if user is in game based of player count
  useEffect(() => {
    if (Object.keys(players).length === 0) {
      setInGame(false)
    } else {
      setInGame(true)
    }
  }, [players])

  //peer functions

  const connectToPeer = (id) => {
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
          break
        case 1:
          //writing
           break
        case 2:
          //ready to reveal
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
  setOldWordList(currentWordList)
  setCurrentWordList({})
  setPlayerState({})
  setPlayerState(0)
  setGameState(0)
  sendAllState()
}

//check if user is in game

  return (
    <>
    {inGame === false && 
    <NotInGame
      username={username}
      setusername={setusername}
    ></NotInGame>
    }
    {inGame === true && 
    <MainGame
      username={username}
      gameState={gameState}
      oldWordList={oldWordList}
      currentWordList={currentWordList}
      players={players}
    ></MainGame>}
    </>
  );
}

export default App;
