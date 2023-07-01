
import './App.css';
import { useEffect, useState } from 'react';
import MainGame from './MainGame';
import PeerJS from "peerjs";

function App() {

  const [gameState, setGameState] = useState(0)
  /*
    0 lobby/revealed
    1 writing
  */
  const [oldWordList, setOldWordList] = useState({})
  const [currentWordList, setCurrentWordList] = useState({})
  //const [playersState, setPlayersState] = useState()
  const [username, setusername] = useState("")
  const [peerID, setPeerID] = useState(null)
  const [peers, setPeers] = useState(null)
  const [players, setPlayers] = useState({})
  /*
    id, username, state
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


  //peer functions
  
  const connectToPeer= (id) => {
    const peer = new PeerJS()
    peer.connect(id)
    setPeers([...peers, peer])
    setPlayers([...players, {id: peer.peer}])
    //get state from peer
    peer.send({cmd: "getState"})
  }

  const handleDisconnect = (peer) => {
    setPeers(peers.filter(p => p !== peer))
    let peerID = peer.peer
    //not sure about this one
    setPeers(players.filter(p => p.id !== peerID))
  }



  useEffect(() => {
    
    //callbacks
    function gotPeerState(peerID, stateData) {
        if (peerID in players) {
            //check if anything has changed
            let changesData = {}
            let changesToBeMade = false
            if (players[peerID].state !== stateData.state) {
                changesData.state = stateData.state
                changesToBeMade = true
            }
            if (players[peerID].username !== stateData.username) {
                changesData.username = stateData.username
                changesToBeMade = true
            }
            if (changesToBeMade) {
                setPlayers((tmp, changesToBeMade, peerID) => {
                    let newPeerObj = {...tmp[peerID], ...changesToBeMade}
                    tmp[peerID] = newPeerObj
                    return tmp
                })
            }
            //process on state update
            //

        } else {
            setPlayers(tmp => {
                tmp[peerID].state = stateData.state
                tmp[peerID].username = stateData.username
                return tmp
            })
        }
      setPlayers(tmp => {
        tmp[peerID].state = stateData.state
        tmp[peerID].username = stateData.username
        tmp[peerID].word = stateData.word
        return tmp
      })
    }

    function sendPeerState(peerID) {
      let myState = {
        state: playerState,
        username: username,
        word: word
      }
      //send
    }

    function sendAllState () {
      players.forEach(peer => {
        sendPeerState(peer.id)
      })
    }

    function connectToPeer(peerID) {

    }

    function gotPeerList(peerListData) {
      //for each data, if peerlist does not have set connected try to connect
      peerListData.forEach((newPeerID => {
        if (!(newPeerID in players)) {
            connectToPeer(newPeerID)
        }
      }))
    }

    function gotWord(peerID, word) {
        //add word to list
        setCurrentWordList((tmp, peerID, word) => {
            tmp[peerID] = word
            return tmp
        })
        //if final word move to reveal
        if (Object.keys(players).length === Object.keys(currentWordList.length)) {
            setOldWordList(currentWordList)
            setGameState(1)
        }
    }

    function sendPeerList(peerID) {
      let sendingList = []
      players.forEach((peer) => {
        sendingList.push(peer.id)
      })
      //send List
    }


    //setup recieveing functions
    peer.on("connection", (conn) => {
      let peerID = conn.peer
      let newConnection = false
      //if peer is not in list add.
      if (!(players.includes(peerID))) {
        setPlayers(tmp => {
            tmp.push(peerID)
            return tmp
        })
        newConnection = true
      }

      //recieved data
      conn.on("data", (data, peerID) => {
        if (data.type === "status")
        gotPeerState(peerID, data.payload)
        if (data.type === "word")
        gotWord(peerID, data.payload)
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
      peerList: players
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
  )
}

export default App;
