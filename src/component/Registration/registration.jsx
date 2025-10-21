import React, { useState } from 'react';
import "./registration.css";
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

    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState(null);
    const [step, setStep] = useState(1); 

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
                "https://garage-pulse-api.onrender.com/auth/register",
                { name, email, password, confirmPassword }
            );

            setUserId(response.data.userId);
            setStep(2);
            setSuccess("OTP sent to your email. Please verify.");
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

    const handleVerifyOtp = async () => {
        setError('');
        setSuccess('');

        if (!otp) {
            setError("Please enter OTP");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                "https://garage-pulse-api.onrender.com/auth/verifyOtp",
                { userId, otp }
            );

            setSuccess(response.data.message);
            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || "OTP verification failed");
            } else {
                setError("Network error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="login">
                <h2>Registration</h2>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                {step === 1 && (
                    <>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text"
                            placeholder="Full Name"
                            className="input"
                            disabled={loading}
                        />
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="Email"
                            className="input"
                            disabled={loading}
                        />
                        <input
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type="password"
                            placeholder="Password"
                            className="input"
                            disabled={loading}
                        />
                        <input
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            type="password"
                            placeholder="Confirm Password"
                            className="input"
                            disabled={loading}
                        />

                        <button className="btn" onClick={handleRegister} disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            type="text"
                            placeholder="Enter OTP"
                            className="input"
                            disabled={loading}
                        />
                        <button className="btn" onClick={handleVerifyOtp} disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Registration;
