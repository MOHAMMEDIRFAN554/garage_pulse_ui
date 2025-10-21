import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [user, setUser] = useState({ name: '', password: '' });

  function handleSubmit() {
    alert('Login Successful');
  }

  return (
    <div className="container">
      <div className="login">
        <h2>Login Page</h2>
        <input
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          type="text"
          placeholder="Enter Username"
          className="input"
        />
        <input
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          type="password"
          placeholder="Enter Password"
          className="input"
        />
        <button className="btn" onClick={handleSubmit}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
