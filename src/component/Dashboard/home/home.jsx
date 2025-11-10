import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Login/authContext";
import constant from "../../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    vehicles: 0,
    underService: 0,
    employees: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    setUserData(user);
    loadStats();
  }, [user]);

  const handleLogout = () => {
    logout();
    const toastEl = document.getElementById("logoutToast");
    const toast = new window.bootstrap.Toast(toastEl);
    toast.show();
    setTimeout(() => navigate("/login"), 1500);
  };

  const loadStats = async () => {
    try {
      const [vehiclesRes, employeesRes, serviceRes] = await Promise.all([
        axiosInstance.get(constant.GETALLVEHICLE),
        axiosInstance.get(constant.GETALLEMPLOYEE),
        axiosInstance.get(constant.SERVICE_REQUEST_LIST_OWNER),
      ]);

      const vehicles = vehiclesRes.data.vehicles || [];
      const employees = employeesRes.data.employees || [];
      const services = serviceRes.data.requests || [];

      const underService = services.filter(
        (s) => s.status?.toLowerCase() !== "completed"
      ).length;

      setStats({
        vehicles: vehicles.length,
        underService,
        employees: employees.length,
        pendingRequests: underService,
      });
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  if (!userData) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* ===== Toast Notification ===== */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div
          id="logoutToast"
          className="toast align-items-center text-bg-success border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">Logged out successfully!</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>

      {/* ===== Header Section ===== */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Welcome, {userData?.name || "User"} 👋</h3>
          <p className="text-muted mb-0">
            Logged in as <strong>{userData?.email}</strong>
          </p>
        </div>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> Logout
        </button>
      </div>

      {/* ===== Stats Tiles ===== */}
      <div className="row g-3 mb-5">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3 bg-light">
            <i className="bi bi-car-front fs-1 text-primary mb-2"></i>
            <h5 className="fw-semibold">Total Vehicles</h5>
            <h3 className="fw-bold text-dark">{stats.vehicles}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3 bg-light">
            <i className="bi bi-tools fs-1 text-warning mb-2"></i>
            <h5 className="fw-semibold">Under Service</h5>
            <h3 className="fw-bold text-dark">{stats.underService}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3 bg-light">
            <i className="bi bi-people-fill fs-1 text-success mb-2"></i>
            <h5 className="fw-semibold">Total Employees</h5>
            <h3 className="fw-bold text-dark">{stats.employees}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 text-center p-3 bg-light">
            <i className="bi bi-clipboard-check fs-1 text-danger mb-2"></i>
            <h5 className="fw-semibold">Pending Requests</h5>
            <h3 className="fw-bold text-dark">{stats.pendingRequests}</h3>
          </div>
        </div>
      </div>

      {/* ===== Management Tiles ===== */}
      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <div
            className="card text-center shadow-sm border-0 bg-primary text-white p-4 home-tile"
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-car-front fs-1 mb-3"></i>
            <h4 className="fw-bold">Vehicle Management</h4>
            <p className="small">View, add, assign, and manage all vehicles</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div
            className="card text-center shadow-sm border-0 bg-success text-white p-4 home-tile"
            onClick={() => navigate("/EmployeList")}
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-person-badge fs-1 mb-3"></i>
            <h4 className="fw-bold">Employee Management</h4>
            <p className="small">Manage drivers, co-drivers, and staff</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div
            className="card text-center shadow-sm border-0 bg-warning text-dark p-4 home-tile"
            onClick={() => navigate("/owner/service-requests")}
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-wrench-adjustable fs-1 mb-3"></i>
            <h4 className="fw-bold">Service Management</h4>
            <p className="small">Track ongoing and completed services</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div
            className="card text-center shadow-sm border-0 bg-info text-white p-4 home-tile"
            onClick={() => navigate("/owner/collections")}
            style={{ cursor: "pointer" }}
          >
            <i className="bi bi-cash-stack fs-1 mb-3"></i>
            <h4 className="fw-bold">Collection Management</h4>
            <p className="small">Monitor daily and total collections</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
