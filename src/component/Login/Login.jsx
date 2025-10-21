import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!user.email || !user.password) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        'https://garage-pulse-api.onrender.com/auth/login',
        {
          email: user.email,
          password: user.password
        }
      );

      setLoading(false);
      alert(response.data.msg);

      localStorage.setItem('token', response.data.token);

      navigate('/home');

    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data.msg || 'Login failed');
      } else {
        setError('Network error');
      }
    }
  };

  return (
    <div className="container">
      <div className="login">
        <h2>Login Page</h2>

        {error && <p className="error">{error}</p>}

        <input
          name="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          type="email"
          placeholder="Enter Email"
          className="input"
        />
        <input
          name="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          type="password"
          placeholder="Enter Password"
          className="input"
        />

        <button className="btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}

export default Login;
