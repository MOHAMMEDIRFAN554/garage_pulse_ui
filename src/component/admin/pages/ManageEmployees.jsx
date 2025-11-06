import React, { useState } from "react";

const ManageEmployees = () => {
  const [roles, setRoles] = useState(["driver", "co-driver", "mechanic"]);
  const [newRole, setNewRole] = useState("");

  const addRole = () => {
    if (!newRole.trim()) return;
    setRoles([...roles, newRole.toLowerCase()]);
    setNewRole("");
  };

  return (
    <div className="p-3">
      <h5>Manage Employee Roles</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter New Role"
        value={newRole}
        onChange={(e) => setNewRole(e.target.value)}
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
