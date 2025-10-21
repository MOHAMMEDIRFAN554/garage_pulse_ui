import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState(1);  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    setMessage("");
    if (!email) {
      setMessage("Email is required");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:4500/auth/forgotpassword",
        { email }
      );
      setStep(2);
      setMessage("OTP sent to your email. Enter OTP and new password.");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setMessage("");

    if (!otp || !newPassword || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:4500/auth/resetpassword",
        {
          email,
          otp,
          newPassword,
          confirmPassword,
        }
      );

      setSuccess(true);
      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <h2>Forgot Password</h2>

      {message && <p className={success ? "success" : "error"}>{message}</p>}

      {step === 1 && !success && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            disabled={loading}
          />
          <button className="btn" onClick={handleForgotPassword} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && !success && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            disabled={loading}
          />
          <button className="btn" onClick={handleResetPassword} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}

      {success && <p className="success">Redirecting to login...</p>}
    </div>
  );
}

export default ForgotPassword;
