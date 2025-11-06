import React from "react";

const AdminHeader = ({ handleLogout }) => {
  return (
    <div className="admin-header d-flex justify-content-between align-items-center shadow-sm px-3 py-2">
      <h4 className="m-0">Garage Pulse Admin Dashboard</h4>
      <button className="btn btn-danger btn-sm" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AdminHeader;
