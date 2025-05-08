import React from 'react';
import { useNavigate } from 'react-router-dom';

const Game: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
    className="container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100 text-white" 
    style={{ backgroundColor: '#282828' }}
    >
      <div className="card p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <button className="btn btn-outline-light w-100" onClick={() => navigate("/")}>
          Leave Lobby
        </button>
      </div>
    </div>
  );
};

export default Game;
