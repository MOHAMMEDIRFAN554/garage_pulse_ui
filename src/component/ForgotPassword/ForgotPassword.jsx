import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import constant from '../../constant/constant';
import './ForgotPassword.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    setMessage("");

    if (!email || !newPassword || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(constant.FORGOT_API, {
        email,
        newPassword,
        confirmPassword
      });

      setLoading(false);
      setSuccess(true);
      setMessage(response.data.msg);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setLoading(false);
      setMessage(err.response?.data?.msg || "Reset failed");
    }
  };

  return (
    <div className="forgot-page d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4 forgot-card">
        <h3 className="text-center mb-4">Reset Password</h3>

        {message && (
          <div className={`alert ${success ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || success}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading || success}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading || success}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleResetPassword}
          disabled={loading || success}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
