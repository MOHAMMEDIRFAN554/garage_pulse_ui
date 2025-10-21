import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate(); //  You missed this line earlier
  const [user, setUser] = useState({ name: '', password: '' });

  function handleSubmit() {
    alert('Login Successful');
    // navigate('/dashboard'); // Optional — if you have a dashboard page
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

        {/* 🔹 Forgot Password link */}
        <p className="forgot-link">
          <span
            onClick={() => navigate('/forgot-password')}
            style={{ color: 'blue', cursor: 'pointer' }}
          >
            Forgot Password?
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
