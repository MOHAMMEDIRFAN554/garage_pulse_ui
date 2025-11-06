import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import constant from "../../../constant/constant";

const ManageEmployees = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const res = await axiosInstance.get(constant.GET_ALL_EMPLOYEE_ROLES);
      setRoles(res.data.roles || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addRole = async () => {
    const roleName = (newRole || "").trim().toUpperCase();
    if (!roleName) return;

    try {
      await axiosInstance.post(constant.CREATE_EMPLOYEE_ROLE, { name: roleName });
      setRoles((prev) => (prev.includes(roleName) ? prev : [...prev, roleName]));
      setNewRole("");
      alert("Employee role added successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add employee role");
    }
  };

  return (
    <div className="p-3">
      <h5>Manage Employee Roles</h5>

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
    </div>
  );
};

export default ManageEmployees;
