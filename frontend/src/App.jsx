import "./globals.css";
import React, { useState } from "react";
import { Login } from "../components/Login.jsx";
import { Game } from '../components/Game.jsx';
import { Signup } from "../components/Signup.jsx";

function App() {
    const [login, setLogin] = useState(false);
    const [signup, setSignup] = useState(false);
    const [username, setUsername] = useState("");
    const [token, setToken] = useState("");
    const [showLogin, setShowLogin] = useState(true);

    // Callback function to handle login success
    const handleLoginSuccess = (username, token) => {
        setLogin(true);
        setUsername(username);
        setToken(token);
        console.log(`User ${username} logged in successfully!`);
    };

    // Callback function to handle signup success
    const handleSignupSuccess = (username) => {
        setSignup(true);
        setUsername(username);
        setShowLogin(true);
        console.log(`User ${username} signed up successfully!`);
    }

    const toggleAuthView = () => {
        setShowLogin(!showLogin);
    };

    if (login && token) {
        return (
            <div className="App">
                <h3>Welcome, {username}!</h3>
                <Game token={token} />
            </div>
        );
    }

    return (
        <div className="App">
            {showLogin ? (
                <div>
                    <Login onLoginSuccess={handleLoginSuccess} /> <br />
                    <p>First time here? Create a character before you crash our servers!{" "}
                        <button onClick={toggleAuthView}>Sign up</button>
                    </p>
                </div>
            ) : (
                <div>
                    <Signup onSignupSuccess={handleSignupSuccess} />
                    <p>
                        Already have an account?{" "}
                        <button onClick={toggleAuthView}>Log in</button>
                    </p>
                </div>
            )}
        </div>
    );
}

export default App;
