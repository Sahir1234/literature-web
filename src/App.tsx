import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './Home';
import Lobby from './Lobby';
import Game from './Game';

function App() {
  return (
    <div style={{ backgroundColor: '#282828', fontFamily: 'Cinzel' }}>
      <Router >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game" element={<Game />} />
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer 
          hideProgressBar={true}
          closeOnClick
          pauseOnHover={false}
          draggable={false}
        />
      </Router>
    </div>
  );
}

export default App;