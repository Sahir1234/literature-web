import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LobbyService } from './LobbyService';

const Lobby: React.FC = () => {
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState<string>('Loading..');
  const [gameId, setGameId] = useState<string>('Loading...');
  const [host, setHost] = useState<string>('Loading...');
  const [redTeam, setRedTeam] = useState<string[]>(['Loading...']);
  const [blackTeam, setBlackTeam] = useState<string[]>(['Loading...']);
  const [areButtonsDisabled, setButtonsDisabled] = useState(false);

  useEffect(() => { 
    LobbyService.onComponentChange(navigate, setPlayerName, setGameId, setHost, setRedTeam, setBlackTeam) 
  }, [gameId]);

  const handleLeaveLobby = () => {
    LobbyService.handleLeaveLobby(navigate, setButtonsDisabled);
  };
  
  const handleSwitchTeams = () => {
    LobbyService.handleSwitchTeams(navigate, setButtonsDisabled);
  }

  const handleStartGame = () => {
    LobbyService.handleStartGame(redTeam, blackTeam, navigate, setButtonsDisabled);
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
            <h4 className="text-center">Black Team</h4>
            <ul>
              {blackTeam.map(p => <li key={p}>{p}</li>)}
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
