import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ref, onValue } from "firebase/database";
import { leaveLobby, switchTeams, rtdb, startGame } from '../../firebase';
import { BackendResponse } from '../model/BackendResponse';
import { NEED_EVEN_TEAMS_MESSAGE, WRONG_AMOUNT_OF_PLAYERS_MESSAGE, TOO_MANY_PLAYERS } from '../utils/AlertMessages';
import { MAX_PLAYERS, MIN_PLAYERS, PublicGameData } from '../model/GameData';
import { handleBackendResponse, handleUnknownError, reRoutePage } from '../utils/Utils';
import { isPlayerInGame } from '../backend/DatabaseClient';
import { GAME_ROUTE, HOME_ROUTE } from '../routes/PageRouter';
import { LocalStorageManager } from '../utils/LocalStorageManager';
import { ClientData } from '../model/ClientData';

const Lobby: React.FC = () => {
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState<string>('Loading..');
  const [gameId, setGameId] = useState<string>('Loading...');
  const [host, setHost] = useState<string>('Loading...');
  const [redTeam, setRedTeam] = useState<string[]>(['Loading...']);
  const [blueTeam, setBlueTeam] = useState<string[]>(['Loading...']);
  const [areButtonsDisabled, setButtonsDisabled] = useState(false);

  useEffect(() => { 
    if (!LocalStorageManager.isLocalDataPresent()) {
      LocalStorageManager.clearLocalData();
      navigate(HOME_ROUTE);
    }

    const {gameId, playerName, uid } = LocalStorageManager.getLocalData() as ClientData;
    setPlayerName(playerName!);
    setGameId(gameId!);

    if(!isPlayerInGame(gameId!, playerName!, uid!)) {
      LocalStorageManager.clearLocalData();
      navigate(HOME_ROUTE);
    }
    
    const gameRef = ref(rtdb, `GAMES/${gameId!}/public`);
    const unsubscribe = onValue(gameRef, updateLobbyState);
    return () => unsubscribe();

  }, [gameId]);

  const updateLobbyState = (snapshot: any) => {
    if (snapshot.exists()) {
      const publicGameData = snapshot.val() as PublicGameData;
      navigate((publicGameData.status));

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

    switchTeams( LocalStorageManager.getLocalData() ).then((data) => {  
      handleBackendResponse(data as BackendResponse);
    }).catch((error: any) => {
      handleUnknownError(error);
    }).finally(() => {
      setButtonsDisabled(false);
    });
  }

  const handleLeaveLobby = () => {
    setButtonsDisabled(true);
    verifyLocalStorageData();

    leaveLobby( LocalStorageManager.getLocalData() ).then((data) => {
      const response = data as BackendResponse;

      if (response.data.succeeded) {
        toast.success(response.data.message);
        LocalStorageManager.clearLocalData();
        navigate(HOME_ROUTE);
      } else {
        toast.error(response.data.message);
      }
    }).catch((error: any) => {
      handleUnknownError(error);
    }).finally(() => {
      setButtonsDisabled(false);
    });
  };

  const handleStartGame = () => {
    if (redTeam.length === blueTeam.length) {
      toast.error(NEED_EVEN_TEAMS_MESSAGE);
      return;
    }

    const totalPlayerCount = redTeam.length + blueTeam.length;
    if (totalPlayerCount < MIN_PLAYERS) {
      toast.error(WRONG_AMOUNT_OF_PLAYERS_MESSAGE);
      return;
    } else if (totalPlayerCount > MAX_PLAYERS) {
      toast.error(TOO_MANY_PLAYERS);
      return;
    }

    verifyLocalStorageData();
    setButtonsDisabled(true);

    startGame( LocalStorageManager.getLocalData() ).then((data) => {
      const response = data as BackendResponse;

      if (response.data.succeeded) {
        toast.success(response.data.message);
        navigate(GAME_ROUTE);
      } else {
        toast.error(response.data.message);
      }
    }).catch((error: any) => {
      handleUnknownError(error);
    }).finally(() => {
      setButtonsDisabled(false);
    });;
  }

  const verifyLocalStorageData = () => {
    if (!LocalStorageManager.isLocalDataPresent()) {
      clearLocalStorageAndReturnHome();
      return;
    }
  }

  const clearLocalStorageAndReturnHome = () => {
    LocalStorageManager.clearLocalData();
    navigate(HOME_ROUTE);
  }

  return (
    <div 
    className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div 
      className="p-4 bg-light bg-opacity-10 border border-white border-2 rounded-4 shadow-lg text-white" 
      style={{ maxWidth: '500px', width: '100%', marginTop: '-200px'}}
      >
        <h2 className="text-center mb-4">Game ID: {gameId}</h2>

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
