import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Login/authContext"; 
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import ManageVehicleData from "./pages/ManageVehicleData";
import ManageServiceTypes from "./pages/ManageServiceTypes";
import ManageEmployees from "./pages/ManageEmployees";
import ManageFuelTypes from "./pages/ManageFuelTypes";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); 
  const [activePage, setActivePage] = useState("vehicle");

  const handleLogout = () => {
    logout(); 
    alert("You have been logged out successfully!");
    navigate("/login");
  };

  const renderPage = () => {
    switch (activePage) {
      case "vehicle":
        return <ManageVehicleData />;
      case "service":
        return <ManageServiceTypes />;
      case "employees":
        return <ManageEmployees />;
      case "fuel":
        return <ManageFuelTypes />;
      default:
        return <ManageVehicleData />;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar setActivePage={setActivePage} />
      <div className="admin-main-content">
        <AdminHeader handleLogout={handleLogout} />
        <div className="admin-content-area">{renderPage()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
