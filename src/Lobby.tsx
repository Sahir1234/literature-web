import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { get, ref, onValue } from "firebase/database";
import { leaveLobby, switchTeams, rtdb, startGame } from '../firebase';
import { clearLocalStorageData, getLocalStorageData, isLocalStorageDataPresent } from './utils/LocalStorageHandler';
import { BackendResponse } from './model/BackendResponse';
import { NEED_EQUAL_TEAMS, NOT_ENOUGH_PLAYERS, TOO_MANY_PLAYERS, UNKNOWN_ERROR_MESSAGE } from './utils/AlertMessages';
import { GameStatus, MAX_PLAYERS, MIN_PLAYERS, PlayerData, PublicGameData } from './model/GameData';
import { handleBackendResponse, handleUnknownError } from './utils/Utils';

const Lobby: React.FC = () => {
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState<string>('Loading..');
  const [gameId, setGameId] = useState<string>('Loading...');
  const [host, setHost] = useState<string>('Loading...');
  const [redTeam, setRedTeam] = useState<string[]>(['Loading...']);
  const [blueTeam, setBlueTeam] = useState<string[]>(['Loading...']);
  const [areButtonsDisabled, setButtonsDisabled] = useState(false);

  useEffect(() => { linkComponentStateWithGame() }, [gameId]);

  const linkComponentStateWithGame = () => {
    if (!isLocalStorageDataPresent()) {
      clearLocalStorageAndReturnHome();
    }

    const {gameId, playerName, uid } = getLocalStorageData();
    setPlayerName(playerName!);
    setGameId(gameId!);

    verifyPlayerIsInGame(gameId!, playerName!, uid!);
    
    const gameRef = ref(rtdb, `GAMES/${gameId!}/public`);
    const unsubscribe = onValue(gameRef, handleGameStateChange);
    return () => unsubscribe();
  }

  const verifyPlayerIsInGame = (gameId: string, playerName: string, uid: string) => {
    const playerRef = ref(rtdb, `GAMES/${gameId}/private/${playerName}`);
    get(playerRef).then((snapshot) => {
      if (!snapshot.exists()) {
        clearLocalStorageAndReturnHome();
      }
      const playerData = snapshot.val() as PlayerData;
      console.log(playerData);
      if (playerData.uid !== uid) {
        clearLocalStorageAndReturnHome();
      }
    }).catch((error) => {
      console.error("Error fetching game data: ", error);
      toast.error(UNKNOWN_ERROR_MESSAGE);
    });
  }

  const handleGameStateChange = (snapshot: any) => {
    if (snapshot.exists()) {
      const publicGameData = snapshot.val() as PublicGameData;
      if (publicGameData.status === GameStatus.IN_PROGRESS) {
        navigate('/game');
      } else if (publicGameData.status === GameStatus.GAME_OVER) {
        clearLocalStorageAndReturnHome();
      }

      setHost(publicGameData.host);
      setRedTeam(publicGameData.redTeam ? publicGameData.redTeam : []);
      setBlueTeam(publicGameData.blueTeam ? publicGameData.blueTeam : []);
    } else {
      clearLocalStorageAndReturnHome();
    }
  }
  
  const handleSwitchTeams = () => {
    setButtonsDisabled(true);
    verifyLocalStorageData();

    switchTeams( getLocalStorageData() ).then((data) => {  
      const response = data as BackendResponse;
      handleBackendResponse(response);
      setButtonsDisabled(false);
    }).catch((error: any) => {
      handleUnknownError(error);
      setButtonsDisabled(false);
    });
  }

  const handleLeaveLobby = () => {
    setButtonsDisabled(true);
    verifyLocalStorageData();

    leaveLobby( getLocalStorageData() ).then((data) => {
      const response = data as BackendResponse;

      if (response.data.succeeded) {
        toast.success(response.data.message);
        clearLocalStorageData();
        setButtonsDisabled(false);
        navigate("/");
      } else {
        toast.error(response.data.message);
        setButtonsDisabled(false);
      }
    }).catch((error: any) => {
      handleUnknownError(error);
      setButtonsDisabled(false);
    });
  };

  const handleStartGame = () => {
    if (redTeam.length === blueTeam.length) {
      toast.error(NEED_EQUAL_TEAMS);
      return;
    }

    const totalPlayerCount = redTeam.length + blueTeam.length;
    if (totalPlayerCount < MIN_PLAYERS) {
      toast.error(NOT_ENOUGH_PLAYERS);
      return;
    } else if (totalPlayerCount > MAX_PLAYERS) {
      toast.error(TOO_MANY_PLAYERS);
      return;
    }

    setButtonsDisabled(true);
    verifyLocalStorageData();

    startGame( getLocalStorageData() ).then((data) => {
      const response = data as BackendResponse;

      if (response.data.succeeded) {
        toast.success(response.data.message);
        setButtonsDisabled(false);
        navigate("/game");
      } else {
        toast.error(response.data.message);
        setButtonsDisabled(false);
      }
    }).catch((error: any) => {
      handleUnknownError(error);
      setButtonsDisabled(false);
    });
  }

  const verifyLocalStorageData = () => {
    if (!isLocalStorageDataPresent()) {
      clearLocalStorageAndReturnHome();
      return;
    }
  }

  const clearLocalStorageAndReturnHome = () => {
    clearLocalStorageData();
    navigate('/');
  }

  return (
    <div 
    className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div 
      className="p-4 bg-light bg-opacity-10 border border-white border-2 rounded-4 shadow-lg text-white" 
      style={{ maxWidth: '500px', width: '100%', marginTop: '-200px'}}
      >
        <h2 className="text-center mb-4">Game: {gameId}</h2>

        <div className="row mb-2">
          <div className="col-6">
            <h4 className="text-center">Red Team</h4>
            <ul>
              {redTeam.map(p => <li key={p}>{p}</li>)}
            </ul>
          </div>
          <div className="col-6">
            <h4 className="text-center">Blue Team</h4>
            <ul>
              {blueTeam.map(p => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </div>

        <div className="d-flex justify-content-between mt-5">
          <button className="btn btn-outline-danger w-48" onClick={() => handleLeaveLobby()} disabled={areButtonsDisabled}>
            Leave Game
          </button>
          <button className="btn btn-outline-warning w-48" onClick={() => handleSwitchTeams()} disabled={areButtonsDisabled}>
            Switch Teams
          </button>
          <button className="btn btn-outline-success w-48" 
            onClick={() => handleStartGame()} disabled={areButtonsDisabled || (playerName !== host)}>
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
