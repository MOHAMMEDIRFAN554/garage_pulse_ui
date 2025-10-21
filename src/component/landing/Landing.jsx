import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="welcome-text">Welcome to Garage Pulse</h1>

      <div className="button-container">
        <div className="card" onClick={() => navigate('/login')}>
          <h2>Login</h2>
          <p>Already have an account? Login here.</p>
          <button>Go to Login</button>
        </div>

        <div className="card" onClick={() => navigate('/registration')}>
          <h2>Register</h2>
          <p>Create a new account to get started.</p>
          <button>Go to Register</button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
