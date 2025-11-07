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
      {/* Header */}
      <header className="home-header">
        <div className="user-name">Welcome, {userData?.name || "User"}</div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Card */}
      <div className="home-card">
        <h1>Welcome to Garage Pulse!</h1>
        <p>
          You have successfully logged in as <strong>{userData?.email}</strong>.
        </p>
        <p>
          <strong>Role:</strong> {userData?.role || "N/A"}
        </p>
        <p>
          <strong>User ID:</strong> {userData?.id || "N/A"}
        </p>

        {/* Buttons */}
        <div className="button-container">
          {/* VEHICLE SECTION */}
          <button className="home-btn" onClick={() => navigate("/dashboard")}>
            <span className="icon">🚗</span> Vehicle Dashboard
          </button>

          <button
            className="home-btn add-btn"
            style={{ backgroundColor: "#28a745" }}
            onClick={() => navigate("/addVehicle")}
          >
            <span className="icon">➕</span> Add Vehicle
          </button>

          {/* EMPLOYEE SECTION */}
          <button className="home-btn" onClick={() => navigate("/EmployeList")}>
            <span className="icon">👥</span> Employee List
          </button>

          <button
            className="home-btn add-btn"
            style={{ backgroundColor: "#28a745" }}
            onClick={() => navigate("/AddEmployee")}
          >
            <span className="icon">➕</span> Add Employee
          </button>

          {/* SERVICE SECTION */}
          <button className="home-btn" onClick={() => navigate("/ServiceList")}>
            <span className="icon">🧾</span> Service List
          </button>

          <button
            className="home-btn add-btn"
            style={{ backgroundColor: "#28a745" }}
            onClick={() => navigate("/ServiceForm")}
          >
            <span className="icon">➕</span> Add Service
          </button>

          {/* INSURANCE + ASSIGNMENT */}
          <button
            className="home-btn add-btn"
            style={{ backgroundColor: "#28a745" }}
            onClick={() => navigate("/insurance")}
          >
            <span className="icon">➕</span> Add Insurance
          </button>

          <button
            className="home-btn add-btn"
            style={{ backgroundColor: "#28a745" }}
            onClick={() => navigate("/assignVehicle")}
          >
            <span className="icon">➕</span> Assign Vehicle
          </button>

          {/* OWNER COLLECTION & SERVICE REQUESTS */}
          <button
            className="home-btn"
            style={{ backgroundColor: "#007bff" }}
            onClick={() => navigate("/owner/collections")}
          >
            <span className="icon">💰</span> Collection Report
          </button>

          <button
            className="home-btn"
            style={{ backgroundColor: "#17a2b8" }}
            onClick={() => navigate("/owner/service-requests")}
          >
            <span className="icon">🛠️</span> Service Requests
          </button>

          {/* DELETE ACTIONS */}
          <button
            className="home-btn add-btn"
            style={{ backgroundColor: "#a72828ff" }}
            onClick={() => navigate("/DeleteVehicle")}
          >
            <span className="icon">🗑️</span> Delete Vehicle
          </button>

          <button
            className="home-btn add-btn"
            style={{ backgroundColor: "#a72828ff" }}
            onClick={() => navigate("/DeleteEmployee")}
          >
            <span className="icon">🗑️</span> Delete Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
