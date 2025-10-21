import React, { useState } from "react";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="forgot-container">
      <h2>Forgot Password</h2>
      <p>Enter your details to reset your password:</p>

       <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
      />


      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input"
      />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
      />

     
      <button className="btn">Submit</button>
    </div>
  );
}

export default ForgotPassword;
