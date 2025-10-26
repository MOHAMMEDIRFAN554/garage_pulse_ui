import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosConfig";
import { useAuth } from "./authContext";
import "bootstrap/dist/css/bootstrap.min.css";
import constant from '../../constant/constant';
import './Login.css'; 

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!user.email || !user.password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post(constant.LOGIN_API, {
        email: user.email,
        password: user.password,
      });

      // Save token and user data using context
      login(response.data.user, response.data.token);
      
      setLoading(false);
      alert(response.data.msg);
      navigate("/home");
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.msg || err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow p-4 login-card">
        <h3 className="text-center mb-4">Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            disabled={loading}
          />
        </div>

        <button
          className="btn btn-primary w-100 mb-3"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center">
          <span
            className="text-primary link-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </span>
        </p>

        <p className="text-center mt-3">
          Don't have an account?{" "}
          <span
            className="text-primary link-pointer"
            onClick={() => navigate("/registration")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;