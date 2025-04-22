import { useState } from 'react';
import { toast } from 'react-toastify';

const Home: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');

  const validateInputsWithErrorAlert = (playerName: string, gameId: string) => {
    if (playerName.length > 10) {
      toast.error("Player name must be 10 characters or fewer.");
      return false;
    }

    if (gameId.length > 10) {
      toast.error("Game ID must be 10 characters or fewer.");
    }

    return true;
  };

  const handleJoinGame = async () => {
    console.log(`Joining game: ${gameId} as ${playerName}`);

    if (!validateInputsWithErrorAlert(playerName, gameId)) {
      return;
    };

    
    toast.error("Game ID does not exist. Please enter a valid game.");
    toast.error("Player with the same name has already joined. Please pick a new name.");
    toast.error("The selected game is full. Please join a different game.");

    // create UUID for this player
    // join game as this player
    // persist local storage with gameId and playerName and UUID
    // redrirect them to the lobby page
  };

  const handleCreateGame = async () => {
    console.log(`Creating new game as ${playerName} with ID: ${gameId}`);

    if (!validateInputsWithErrorAlert(playerName, gameId)) {
      return;
    };

    toast.error("Game ID is currently in use. Please enter a new game ID.");

    // Check if the game ID already exists
    // create UUID for this player
    // create game with call to datastore
    // persist local storage with gameId and playerName and UUID
    // redirect them to the lobby page
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
