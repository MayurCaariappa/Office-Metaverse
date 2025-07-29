import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Login } from "./components/Login.jsx";
import { Game } from "./components/Game.jsx";
import { Signup } from "./components/Signup.jsx";
import "./globals.css";

function App() {
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [showLogin, setShowLogin] = useState(true);

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
    setShowLogin(true);
    console.log(`User ${username} signed up successfully!`);
    navigate("/login");
  };

  const toggleAuthView = () => {
    setShowLogin(!showLogin);
    navigate(showLogin ? "/signup" : "/login");
  };

  return (
    <Routes>
      <Route
        path="/game"
        element={
          login && token ? <Game token={token} /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/login"
        element={
          <div>
            <Login onLoginSuccess={handleLoginSuccess} />
            <br />
            <p>
              First time here? Create a character before you crash our servers!{" "}
              <button onClick={toggleAuthView}>Sign up</button>
            </p>
          </div>
        }
      />
      <Route
        path="/signup"
        element={
          <div>
            <Signup onSignupSuccess={handleSignupSuccess} />
            <br />
            <p>
              Already have an account?{" "}
              <button onClick={toggleAuthView}>Log in</button>
            </p>
          </div>
        }
      />
      <Route
        path="/"
        element={
          showLogin ? <Navigate to="/login" /> : <Navigate to="/signup" />
        }
      />
    </Routes>
  );
}

export default App;
