import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import constant from "../../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";

const ManageEmployees = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(constant.GET_ALL_EMPLOYEE_ROLES);
      setRoles(res.data.roles || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load employee roles", "danger");
    } finally {
      setLoading(false);
    }
  };

  const addRole = async () => {
    const roleName = (newRole || "").trim().toUpperCase();
    if (!roleName) return;

    try {
      setLoading(true);
      await axiosInstance.post(constant.CREATE_EMPLOYEE_ROLE, { name: roleName });
      setRoles((prev) => (prev.includes(roleName) ? prev : [...prev, roleName]));
      setNewRole("");
      showToast("Employee role added successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to add employee role", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 position-relative">
      <h5>Manage Employee Roles</h5>

      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(255,255,255,0.7)", zIndex: 9999 }}
        >
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter New Role (e.g., DRIVER, SUPERVISOR)"
        value={newRole}
        onChange={(e) => setNewRole(e.target.value.toUpperCase())}
      />

      <button className="btn btn-success btn-sm" onClick={addRole}>
        Add Role
      </button>

      <ul className="mt-3">
        {roles.map((role, i) => (
          <li key={i}>{role}</li>
        ))}
      </ul>

      {toast.show && (
        <div
          className={`toast align-items-center text-bg-${toast.type} border-0 position-fixed bottom-0 end-0 m-3 show`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() =>
                setToast({ show: false, message: "", type: "success" })
              }
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployees;
