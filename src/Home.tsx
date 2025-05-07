import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ref, get } from 'firebase/database';
import { createGame, joinGame, rtdb } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { BackendResponse } from './model/BackendResponse';
import { ClientData } from './model/ClientData';
import { 
  INVALID_INPUT_MESSAGE,
  UNKNOWN_ERROR_MESSAGE 
} from './utils/AlertMessages';
import {
  getLocalStorageData,
  setLocalStorageData, 
  clearLocalStorageData, 
  isLocalStorageDataPresent
} from './utils/LocalStorageHandler';
import { GameData, GameStatus, MAX_GAME_ID_LENGTH, MAX_NAME_LENGTH } from './model/GameData';
import { handleUnknownError, isPlayerInGame } from './utils/Utils';

const Home: React.FC = () => {
  const navigate = useNavigate();



  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [areButtonsDisabled, setButtonsDisabled] = useState(false);

  useEffect(() => { redirectPageIfAlreadyInGame() }, []);

  const redirectPageIfAlreadyInGame = () => {

    if (!isLocalStorageDataPresent()) {
      // clear local storage as a sanity check
      clearLocalStorageData();
      return;
    }

    const localData = getLocalStorageData() as ClientData;
    const rtData = ref(rtdb, `GAMES/${localData.gameId}`);
    get(rtData).then((snapshot) => {
      if (!snapshot.exists()) {
        // clear local storage since it doesn't match a new game
        clearLocalStorageData();
        return;
      }

      const gameData = snapshot.val() as GameData;

      if (!isPlayerInGame(gameData, localData.playerName, localData.uid)) {
        clearLocalStorageData();
        return;
      }  

      const gameStatus = gameData.public.status;
      handleGameStatus(gameStatus);

    }).catch((error) => {
      console.error("Error fetching game data: ", error);
      toast.error(UNKNOWN_ERROR_MESSAGE);
    });
  }


  const handleGameStatus = (gameStatus: GameStatus) => {
    switch (gameStatus) {
      case GameStatus.IN_LOBBY:
        navigate('/lobby');
        break;
      case GameStatus.IN_PROGRESS:
        navigate('/game');
        break;
      default:
        clearLocalStorageData();
    }
  }

  const handleCreateGame = () => {
    setButtonsDisabled(true);

    if (!areInputsValid(playerName, gameId)) {
      toast.error(INVALID_INPUT_MESSAGE);
      return;
    };

    const clientData: ClientData = { gameId: gameId, playerName: playerName, uid: uuidv4() };
    createGame(clientData).then((data) => {
      const response = data as BackendResponse;
      handleBackendResponse(response, clientData);
    }).catch((error: any) => {
      handleUnknownError(error);
    }).finally(() => {
      setButtonsDisabled(false);
    });
  }

  const handleJoinGame = () => {
    setButtonsDisabled(true);

    if (!areInputsValid(playerName, gameId)) {
      toast.error(INVALID_INPUT_MESSAGE);
      return;
    };

    const clientData: ClientData = { gameId: gameId, playerName: playerName, uid: uuidv4() };
    joinGame(clientData).then((data) => {
      const response = data as BackendResponse;
      handleBackendResponse(response, clientData);
    }).catch((error: any) => {
      handleUnknownError(error);
    }).finally(() => {
      setButtonsDisabled(false);
    });
  };

  const areInputsValid = (playerName: string, gameId: string) => {
    return playerName.length <= MAX_NAME_LENGTH && gameId.length <= MAX_GAME_ID_LENGTH;
  };

  const handleBackendResponse = (response: BackendResponse, clientData: ClientData)  => {
    if (response.data.succeeded) {
      setLocalStorageData(clientData);
      toast.success(response.data.message);
      navigate('/lobby');
    } else {
      toast.error(response.data.message);
    }
  }


  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div 
      className="p-4 bg-light bg-opacity-10 border border-white border-2 rounded-4 shadow-lg text-white" 
      style={{ maxWidth: '400px', width: '100%', marginTop: '-200px'}}
      >
        <h2 className="mb-4 text-center">LITERATURE</h2>
        
        <div className="mb-3">
          <label htmlFor="playerName" className="form-label">Your Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="playerName" 
            value={playerName} 
            onChange={(e) => setPlayerName(e.target.value.toUpperCase())} 
            placeholder="Enter your name"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="gameId" className="form-label">Game ID</label>
          <input 
            type="text" 
            className="form-control" 
            id="gameId" 
            value={gameId} 
            onChange={(e) => setGameId(e.target.value.toUpperCase())} 
            placeholder="Enter Game ID"
          />
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button 
            className="btn btn-outline-success w-48" 
            onClick={handleCreateGame}
            disabled={areButtonsDisabled || !playerName || !gameId}
          >
            Create Game
          </button>
          <button 
            className="btn btn-outline-warning w-48" 
            onClick={handleJoinGame}
            disabled={areButtonsDisabled || !playerName || !gameId}
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
