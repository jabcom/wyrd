
import './App.css';
import { useEffect, useState } from 'react';
import MainGame from './MainGame';
import { Peer } from "peerjs";

function App() {

  const [gameState, setGameState] = useState(0)
  const [oldWordList, setOldWordList] = useState([])
  const [currentWordList, setCurrentWordList] = useState([])
  //const [playersState, setPlayersState] = useState()
  const [username, setusername] = useState("")
  const [peerID, setPeerID] = useState(null)
  const [peerList, setPeerList] = useState([])
  /*
    [{id: "string", username: "string", connected: false, lastPing: time, status: 0, word: null}]
  */
  const [state, setState] = useState(0)
  //status can be 
  //0 idle
  //1 writing
  //2 ready to reveal
  //3 ready for next round
  const [word, setWord] = useState(null)

  useEffect(() => {

    let peerConnections = {}
    
    //callbacks
    function gotPeerState(peerID, stateData) {
      setPeerList(tmp => {
        tmp[peerID].state = stateData.state
        tmp[peerID].username = stateData.username
        tmp[peerID].word = stateData.word
        return tmp
      })
    }

    function sendPeerState(peerID) {
      let myState = {
        state: state,
        username: username,
        word: word
      }
      //send
    }

    function sendAllState () {
      peerList.forEach(peer => {
        sendPeerState(peer.id)
      })
    }

    function connectToPeer(peerID) {

    }

    function gotPeerList(peerListData) {
      //for each data, if peerlist does not have set connected try to connect
    }

    function sendPeerList(peerID) {
      let sendingList = []
      peerList.forEach((peer) => {
        sendingList.push(peer.id)
      })
      //send List
    }

    //setup peerjs
    const peer = new Peer(peerID)
    setPeerID(peer.id)
    console.log(peerID)


    //setup recieveing functions
    peer.on("connection", (conn) => {
      let peerID = conn.peer
      peerConnections[peerID] = conn
      conn.on("getState", () => {
        //send state
      })
      conn.on("data", (data) => {
        if (data.message === "getStatus")
        {}
        if (data.message === "word")
        setCurrentWordList((current) => {
          //
        })
      })
    })
  }, []) //end of useEffect

  function restartGame() {
    setOldWordList(currentWordList)
    setCurrentWordList({})
    setPlayersState({})
    setStatus(0)
    setGameState(0)
    sendState()
  }

  function sendWord() {

  }

  function joinSession(sessionID) {
    //joins with the sessionID, if sessionID is blank, create new session
  }

  function sendState(userID){
    //Sends username, and status if no userID set sent to all
    //if in state 4 also send word
    let state = {
      peerID: peerID,
      username: username,
      status: status,
      peerList: peerList
    }

  }

  function askForState() {
    //ask other players to send you thier statuses
  }


  function recieveState(state) {
    //recieve a players state and updated local data
    let state = {
      playerName: "Dave",
      state: 4,
      word: "pinapple"
    }

    //update the player states
    setPlayersState(currentState => {
      currentState[state.playerName] = state
      return currentState
    })
    let playerCount = 0
    let playerState2 = 0
    let playerState3 = 0
    //check if all players are in state 2 or 3
    Object.entries(playersState).forEach((player, data) => {
      playerCount += 1
      data.status ? 2 : playerState2 += 1
      data.status ? 3 : playerState2 += 1
    })
    if (playerState2 === playerCount) {
      //all players ready to reveal
      sendWord()
    }

    if (playerState3 === playerCount) {
      //all players ready to restart game
      restartGame()
    }
  }
  
  /*
    players: [
      {
        username: "string",
        status: 
        word: "string"
      }
    ]
  */


  return (
    <>
    {peerID ? null : 
    <NotInGame
      username={username}
      setusername={setusername}
    ></NotInGame>
    &
    <MainGame
      username={username}
      gameState={gameState}
      oldWordList={oldWordList}
      currentWordList={currentWordList}
      sessionID={peerID}
    ></MainGame>}

    </>
  );
}

export default App;
