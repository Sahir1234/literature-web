import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createGame, joinGame, homePageRedirect } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { BackendResponse } from './utils/BackendResponse';
import { 
  INVALID_INPUT_MESSAGE, 
  SUCCESSFUL_GAME_INIT_MESSAGE, 
  UNKNOWN_ERROR_MESSAGE 
} from './utils/AlertMessages';
import { MAX_NAME_LENGTH, MAX_GAME_ID_LENGTH } from './utils/Configs';
import {
  getLocalStorageGameId,
  getLocalStoragePlayerName,
  getLocalStorageUid, 
  setLocalStorageData, 
  clearLocalStorageData, 
  isLocalStorageDataPresent,
} from './utils/LocalStorageHandler';

interface HomePageData {
  gameId: string;
  playerName: string;
  uid: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');

  useEffect(() => { redirectPageIfAlreadyInGame() }, []);

  const redirectPageIfAlreadyInGame = () => {
    if (!isLocalStorageDataPresent()) {
      // clear local storage as a sanity check
      clearLocalStorageData();
      return;
    }

    const localStorageGameId = getLocalStorageGameId();
    const localStoragePlayerName = getLocalStoragePlayerName();
    const localStorageUid = getLocalStorageUid();

    homePageRedirect( { gameId: localStorageGameId, playerName: localStoragePlayerName, uid: localStorageUid } ).then((data) => {
      const response = data as BackendResponse;
      if (response.data.succeeded) {
        navigate('/' + response.data.message);
      } else {
        clearLocalStorageData();
      }
    }).catch((error: any) => {
      handleUnknownError(error);
    });
  }
  
  const handleCreateGame = () => {
    if (!areInputsValid(playerName, gameId)) {
      toast.error(INVALID_INPUT_MESSAGE);
      return;
    };

    const homePageData: HomePageData = { gameId: gameId, playerName: playerName, uid: uuidv4() };
    createGame(homePageData).then((data) => {
      const response = data as BackendResponse;
      handleBackendResponse(response, homePageData);
    }).catch((error: any) => {
      handleUnknownError(error);
    });
  };

  const handleJoinGame = () => {
    if (!areInputsValid(playerName, gameId)) {
      toast.error(INVALID_INPUT_MESSAGE);
      return;
    };

    const homePageData: HomePageData = { gameId: gameId, playerName: playerName, uid: uuidv4() };
    joinGame(homePageData).then((data) => {
      const response = data as BackendResponse;
      handleBackendResponse(response, homePageData);
    }).catch((error: any) => {
      handleUnknownError(error);
    });
  };

  const areInputsValid = (playerName: string, gameId: string) => {
    return playerName.length <= MAX_NAME_LENGTH && gameId.length <= MAX_GAME_ID_LENGTH;
  };

  const handleBackendResponse = (response: BackendResponse, homePageData: HomePageData)  => {
    if (response.data.succeeded) {
      handleSuccessfulGameInit(homePageData);
    } else {
      toast.error(response.data.message);
    }
  }

  const handleSuccessfulGameInit = (homePageData: HomePageData) => {
    setLocalStorageData(homePageData.gameId, homePageData.playerName, homePageData.uid);
    toast.success(SUCCESSFUL_GAME_INIT_MESSAGE);
    navigate('/lobby');
  }

  const handleUnknownError = (error: any) => {
    console.error("Error: ", error);
    toast.error(UNKNOWN_ERROR_MESSAGE);
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
        
        <div className="mb-3">
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

        <div className="d-flex justify-content-between">
          <button 
            className="btn btn-outline-light w-48" 
            onClick={handleCreateGame}
            disabled={!playerName || !gameId}
          >
            Create Game
          </button>
          <button 
            className="btn btn-outline-light w-48" 
            onClick={handleJoinGame}
            disabled={!playerName || !gameId}
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
