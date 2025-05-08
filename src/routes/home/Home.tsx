import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ClientData } from '../../model/ClientData';
import { HomeService } from './HomeService';
import { Page, PageRouter } from '../PageRouter';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [areButtonsDisabled, setButtonsDisabled] = useState(false);

  useEffect( () => { PageRouter.rerouteBasedOnGameStatus(navigate, Page.HOME) }, []);

  const handleCreateGame = () => {
    const clientData: ClientData = { gameId, playerName, uid: uuidv4() };
    HomeService.handleCreateGame(clientData, navigate, setButtonsDisabled);
  }

  const handleJoinGame = () => {
    const clientData: ClientData = { gameId, playerName, uid: uuidv4() };
    HomeService.handleJoinGame(clientData, navigate, setButtonsDisabled);
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
