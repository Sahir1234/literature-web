import { useState } from 'react';
import { toast } from 'react-toastify';

function Home() {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');

  const validateInputsWithErrorAlert = (playerName: string, gameId: string) => {
    if (playerName.length > 10) {
      toast.error("Player name must be 10 characters or fewer.");
      return false;
    }

    if (gameId.length > 10) {
      toast.error("Game ID must be 10 characters or fewer.");
      return false;
    }

    return true;
  };

  const doesGameExist = async (gameId: string) => {
    // Simulate a check to see if the game exists

    return true;
  }

  const handleJoinGame = () => {
    console.log(`Joining game: ${gameId} as ${playerName}`);

    if (!validateInputsWithErrorAlert(playerName, gameId)) {
      return;
    };

    // check that game exists and does not have this player already:
    // catch error from firebase and show toast error

  };

  const handleCreateGame = () => {
    console.log(`Creating new game as ${playerName} with ID: ${gameId}`);

    if (!validateInputsWithErrorAlert(playerName, gameId)) {
      return;
    };

    if (!doesGameExist(gameId)) {
      toast.error("Game ID is already being used. Please choose a different one.");
      return;
    }

    // create game with this player as host
  };

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
            onChange={(e) => setPlayerName(e.target.value)} 
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
            onChange={(e) => setGameId(e.target.value)} 
            placeholder="Enter Game ID"
          />
        </div>

        <div className="d-flex justify-content-between">
          <button 
            className="btn btn-success w-48" 
            onClick={handleCreateGame}
            disabled={!playerName || !gameId}
          >
            Create Game
          </button>
          <button 
            className="btn btn-primary w-48" 
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
