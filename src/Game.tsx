import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Game: React.FC = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();

  // Static player data for illustration (replace with real data if needed)
  const [players, setPlayers] = useState<string[]>(['Player1', 'Player2']);
  const [isHost, setIsHost] = useState(true); // Assume the first player is the host for now
  const [isReady, setIsReady] = useState(false);

  // This function is for the "Start Game" button, which only the host can press
  const handleStartGame = () => {
    if (isHost && players.length >= 4) {
      setIsReady(true);
      alert("Game Started!"); // This could be a navigation to the game page or a different action
    }
  };

  return (
    <div 
    className="container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100 text-white" 
    style={{ backgroundColor: '#282828' }}
    >
      <div className="card p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center">Lobby: {lobbyId}</h2>

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

        {isHost && players.length >= 4 && !isReady && (
          <button className="btn btn-success w-100 my-2" onClick={handleStartGame}>
            Start Game
          </button>
        )}

        <button className="btn btn-outline-light w-100" onClick={() => navigate("/")}>
          Leave Lobby
        </button>
      </div>
    </div>
  );
};

export default Game;
