import PropTypes from "prop-types";
import React, { useState } from 'react';
import axios from 'axios';

export const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/signin", {
                username: username,
                password: password,
            });

            localStorage.setItem('gameToken', response.data.token);

            // alert("Signed in successfully");
            if (onLoginSuccess) {
                onLoginSuccess(username, response.data.token);
            }
        } catch (error) {
            if (error.response?.data?.msg) {
                alert(error.response.data.msg);
            } else {
                alert("Failed to sign in");
            }
            console.error("Error during sign-in:", error);
        }
    };

    return (
        <div>
            <h1>Welcome Back!</h1>
            <input
                type="text"
                style={{ margin: 10, padding: 10 }}
                placeholder="what was your name again?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
                type="password"
                style={{ margin: 10, padding: 10 }}
                placeholder="don’t tell anyone!"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleLogin}>Login</button> <br />
        </div>
    );
};

// Prop validation
Login.propTypes = {
    onLoginSuccess: PropTypes.func.isRequired,
};
