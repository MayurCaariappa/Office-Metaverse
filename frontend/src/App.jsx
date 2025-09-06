import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthPage } from "./components/Auth-page.jsx";
import { Game } from "./components/Game.jsx";
import "./index.css";
import "./globals.css";

function App() {
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleLoginSuccess = (username, token) => {
    setLogin(true);
    setUsername(username);
    setToken(token);
    console.log(`User ${username} logged in successfully!`);
    navigate("/game");
  };

  const handleSignupSuccess = (username) => {
    setUsername(username);
    console.log(`User ${username} signed up successfully!`);
    navigate("/game");
  };

  return (
    <Routes>
      <Route
        path="/game"
        element={
          login && token ? <Game token={token} /> : <Navigate to="/auth" />
        }
      />
      <Route
        path="/auth"
        element={
          <AuthPage
            onLoginSuccess={handleLoginSuccess}
            onSignupSuccess={handleSignupSuccess}
          />
        }
      />
      <Route path="/" element={<Navigate to="/auth" />} />
    </Routes>
  );
}

export default App;
