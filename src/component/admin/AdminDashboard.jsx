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
import "bootstrap/dist/css/bootstrap.min.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activePage, setActivePage] = useState("vehicle");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500);
  };

  const handleLogout = () => {
    logout();
    showToast("You have been logged out successfully!", "success");
    setTimeout(() => {
    logout();
    navigate("/login", { replace: true });
  }, 1500);
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
    <div className="admin-dashboard-container position-relative">
      <AdminSidebar setActivePage={setActivePage} />
      <div className="admin-main-content">
        <AdminHeader handleLogout={handleLogout} />
        <div className="admin-content-area">{renderPage()}</div>
      </div>

      {toast.show && (
        <div
          className={`toast align-items-center text-bg-${toast.type} border-0 position-fixed bottom-0 end-0 m-3 show`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ zIndex: 2000 }}
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToast({ show: false, message: "", type: "success" })}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
