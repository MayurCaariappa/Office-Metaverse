import "./App.css";
import { useState } from "react";
import { Login } from "../components/Login.jsx";
import { Signup } from "../components/Signup.jsx";

function App() {
    const [login, setLogin] = useState(false);
    const [signup, setSignup] = useState(false);
    const [username, setUsername] = useState("");

    // Callback function to handle login success
    const handleLoginSuccess = (username) => {
        setLogin(true);
        setUsername(username);
        console.log(`User ${username} logged in successfully!`);
    };

    // Callback function to handle signup success
    const handleSignupSuccess = (username) => {
        setSignup(true);
        setUsername(username);
        console.log(`User ${username} signed up successfully!`);
    }

    return (
        <div className="App">
            {!signup ? (
                <Signup onSignupSuccess={handleSignupSuccess} />
            ) : (
                <h3>Welcome, {username}!</h3>
            )}
        </div>
    );
}

export default App;
