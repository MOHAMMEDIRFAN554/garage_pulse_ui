import React from "react";
import "./AdminDashboard.css";

const AdminSidebar = ({ setActivePage }) => {
  return (
    <div className="admin-sidebar shadow-sm">
      <h3 className="sidebar-title">Admin Panel</h3>
      <ul className="sidebar-menu">
        <li onClick={() => setActivePage("vehicle")}>🚗 Manage Vehicle Data</li>
        <li onClick={() => setActivePage("service")}>🧰 Service Types</li>
        <li onClick={() => setActivePage("employees")}>👨‍🔧 Employees</li>
        <li onClick={() => setActivePage("fuel")}>⛽ Fuel Types</li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
