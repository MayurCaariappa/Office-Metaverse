import React, { useState } from 'react';
import axios from 'axios';
import GameScene from './GameScene';

export const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            debugger;
            const response = await axios.post("http://localhost:3000/admin/signin", {
                username: username,
                password: password
            });
            alert("Signed in successfully");
            onLoginSuccess(username);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.msg) {
                alert(error.response.data.msg);
            } else {
                alert("Failed to sign in");
            }
            console.error("Error during sign-in:", error);
        }
    };

    return (
        <div>
            <h1>2D Metaverse Office</h1>
            <h2>Login to your Avatar</h2>
            <input
                type="text"
                style = {{margin: 10, padding: 10}}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
                type="password"
                style = {{margin: 10, padding: 10}}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};
