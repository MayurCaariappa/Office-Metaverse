import './App.css';
import React, { useState } from 'react';
import GameScene from "../components/GameScene.jsx";
import { Login } from '../components/Login.jsx';

function App() {
  const [login, setLogin] = useState(false);

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setLogin(true);
  };

  return (
    <div className="App">
      {!login ? (<Login onLoginSuccess={handleLoginSuccess} />) : (<GameScene />)}
    </div>
  )
}

export default App
