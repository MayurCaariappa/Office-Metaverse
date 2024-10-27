import './App.css';
import React, { useState } from 'react';
import GameScene from "../components/GameScene.jsx";
import { Login } from '../components/Login.jsx';

function App() {
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState("");

  // Function to handle successful login
  const handleLoginSuccess = (user) => {
    setLogin(true);
    setUsername(user);
  };

  return (
    <div className="App">
      {!login ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <GameScene username={username} />
      )}
    </div>
  )
}

export default App
