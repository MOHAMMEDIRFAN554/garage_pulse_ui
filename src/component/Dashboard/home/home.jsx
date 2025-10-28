import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Login/authContext";
import "./Home.css";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  const handleLogout = () => {
    logout();
    alert("You have been logged out successfully!");
    navigate("/login");
  };

  if (!userData) {
    return (
      <div className="home-container">
        <div className="text-white text-center">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="user-name">Welcome, {userData?.name || "User"}</div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="home-card">
        <h1>Welcome to Garage Pulse!</h1>
        <p>
          You have successfully logged in as <strong>{userData?.email}</strong>.
        </p>
        <p>
          <strong>Role:</strong> {userData?.role}
        </p>
        <p>
          <strong>User ID:</strong> {userData?.id}
        </p>

        <div className="button-container">
          <button className="home-btn" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>

          <button
            className="home-btn add-btn"
            style={{ backgroundColor: "#28a745" }}
            onClick={() => navigate("/addVehicle")}
          >
            ➕ Add Vehicle
          </button>
          <button
            className="home-btn add-btn"
            style={{ backgroundColor: "#28a745" }}
            onClick={() => navigate("/ServiceList")}
          >
           Service List
          </button>
          <button
            className="home-btn add-btn"
            style={{ backgroundColor: "#28a745" }}
            onClick={() => navigate("/ServiceForm")}
          >
            Service Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
