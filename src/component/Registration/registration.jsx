import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import constant from '../../constant/constant';
import './registration.css';

function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        constant.REGISTER_API,
        { name, email, password, confirmPassword }
      );

      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Something went wrong");
      } else {
        setError("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4 registration-card">
        <h2 className="text-center mb-4">Register</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}

export default Registration;
