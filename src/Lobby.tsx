import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { leaveLobby, switchTeams } from '../firebase';
import { clearLocalStorageData, getLocalStorageData, isLocalStorageDataPresent } from './utils/LocalStorageHandler';
import { BackendResponse } from './utils/BackendResponse';
import { UNKNOWN_ERROR_MESSAGE } from './utils/AlertMessages';

const Lobby: React.FC = () => {
  const navigate = useNavigate();

  // Static player data for illustration (replace with real data if needed)
  const [players] = useState<string[]>(['Player1', 'Player2']);

  const handleSwitchTeams = () => {
    verifyLocalStorageData();

    switchTeams( getLocalStorageData() ).then((data) => {  
      const response = data as BackendResponse;
      if (response.data.succeeded) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    }).catch((error: any) => {
      handleUnknownError(error);
    });
  }

  const handleLeaveLobby = () => {
    verifyLocalStorageData();

    leaveLobby( getLocalStorageData() ).then((data) => {
      const response = data as BackendResponse;

      if (response.data.succeeded) {
        toast.success(response.data.message);
        clearLocalStorageData();
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    }).catch((error: any) => {
      handleUnknownError(error);
    });
  };

  const verifyLocalStorageData = () => {
    if (!isLocalStorageDataPresent()) {
      clearLocalStorageData();
      navigate("/");
      return;
    }
  }

  const handleUnknownError = (error: any) => {
    console.error("Error: ", error);
    toast.error(UNKNOWN_ERROR_MESSAGE);
  }

  return (
    <div 
    className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
      <div 
      className="p-4 bg-light bg-opacity-10 border border-white border-2 rounded-4 shadow-lg text-white" 
      style={{ maxWidth: '600px', width: '100%', marginTop: '-200px'}}
      >
        <h2 className="text-center">Game: 6</h2>

        <ul className="list-group my-3">
          {players.map((player, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {player}
              {index === 0 && <span className="badge bg-primary">Host</span>}
            </li>
          ))}
        </ul>

        <p className="text-center">
          {(players.length < 4 || players.length > 10)
            ? "Need between 4 and 10 players to start..."
            : "Ready to start!"}
        </p>

        <button className="btn btn-outline-light w-100" onClick={() => handleSwitchTeams()}>
          Switch Teams
        </button>

        <button className="btn btn-outline-light w-100" onClick={() => handleLeaveLobby()}>
          Leave Game
        </button>
      </div>
    </div>
  );
};

export default Lobby;
