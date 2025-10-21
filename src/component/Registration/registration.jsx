import React, { useState } from 'react';
import "./Registration.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle registration
    const handleRegister = async () => {
        setError('');

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                "https://garage-pulse-api.onrender.com/auth/register",
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                }
            );

            alert(response.data.message);
            setLoading(false);

            navigate("/home");

        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data) {
                setError(err.response.data.error || "Something went wrong");
            } else {
                setError("Network error");
            }
        }
    };

    return (
        <div className="container">
            <div className="login">
                <h2>Registration</h2>

                {error && <p className="error">{error}</p>}

                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Fullname"
                    className="input"
                />
                <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email"
                    className="input"
                />
                <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Password"
                    className="input"
                />
                <input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    type="password"
                    placeholder="Confirm Password"
                    className="input"
                />

                <button className="btn" onClick={handleRegister} disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </div>
        </div>
    );
}

export default Registration;
