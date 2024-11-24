import PropTypes from "prop-types";
import { useState } from 'react';
import axios from 'axios';

export const Signup = ({ onSignupSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/v1/signup", {
                username: username,
                password: password,
            });

            // alert("Signed up successfully");
            if (onSignupSuccess) {
                onSignupSuccess(username);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.msg) {
                alert(error.response.data.msg);
            } else {
                alert("Failed to sign up");
            }
            console.error("Error during sign-up:", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                style={{ margin: 10, padding: 10 }}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
                type="password"
                style={{ margin: 10, padding: 10 }}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleSignup}>Signup</button>
        </div>
    );
};

// Prop validation
Signup.propTypes = {
    onSignupSuccess: PropTypes.func.isRequired,
};