import React, { useEffect, useState } from "react";
import axiosInstance from "../Login/axiosConfig";
import { useNavigate } from "react-router-dom";
import constant from "../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EmployeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const itemsPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get(
        constant.GETALLEMPLOYEEWITHVEHICLE,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredEmployees =
    filter === "All"
      ? employees
      : employees.filter((emp) => emp.role === filter);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const formatRoleForDisplay = (role) => {
    const roleDisplayMap = {
      driver: "Driver",
      "co-driver": "Co-Driver",
      mechanic: "Mechanic",
    };
    return roleDisplayMap[role?.toLowerCase()] || role;
  };

  const handleEmployeeClick = async (empId) => {
    setLoadingDetails(true);
    try {
      const response = await axiosInstance.get(constant.GETEMPLOYEEBYID(empId), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSelectedEmployee(response.data.employee);
    } catch (error) {
      console.error("Error fetching employee details", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Employee Dasboard</h2>
        <div className="btn-group" role="group">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/addEmployee")}
          >
            <i className="bi bi-plus-circle me-1"></i> Add Employee
          </button>
          <button
            className="btn btn-danger"
            onClick={() => navigate("/DeleteEmployee")}
          >
            <i className="bi bi-trash3 me-1"></i> Delete Employee
          </button>
          <button
            className="btn btn-warning"
            onClick={() => navigate("/assignVehicle")}
          >
            <i className="bi bi-people-fill me-1"></i> Assign Vehicle
          </button>
          
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/home")}
          >
            <i className="bi bi-house-door me-1"></i> Back to Home
          </button>
        </div>
      </div>

      <div className="d-flex align-items-center mb-4 gap-2">
        <label className="me-2 mb-0 fw-semibold">Filter:</label>
        <select
          className="form-select w-auto"
          onChange={handleFilterChange}
          value={filter}
        >
          <option value="All">All</option>
          <option value="driver">Driver</option>
          <option value="co-driver">Co-Driver</option>
          <option value="mechanic">Mechanic</option>
        </select>
      </div>

      <div className="row g-3">
        {paginatedEmployees.map((emp) => (
          <div key={emp._id} className="col-sm-6 col-md-4 col-lg-3">
            <div
              className="card employee-card h-100 shadow-sm"
              onClick={() => handleEmployeeClick(emp._id)}
              style={{ cursor: "pointer" }}
            >
              {emp.image ? (
                <img
                  src={emp.image}
                  className="card-img-top employee-img"
                  alt={emp.name}
                />
              ) : (
                <div className="employee-img-placeholder bg-light d-flex align-items-center justify-content-center">
                  <i className="bi bi-person-circle fs-1 text-secondary"></i>
                </div>
              )}
              <div className="card-body text-center">
                <h5 className="card-title mb-1">{emp.name}</h5>
                <p className="card-text small mb-1">{emp.email}</p>
                <p className="card-text text-muted small mb-1">
                  Role: {formatRoleForDisplay(emp.role)}
                </p>

                {emp.assignedVehicle ? (
                  <p className="card-text text-success small mb-0">
                    <strong>Vehicle:</strong> {emp.assignedVehicle}
                  </p>
                ) : (
                  <p className="card-text text-muted small mb-0">
                    <em>No Vehicle Assigned</em>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredEmployees.length === 0 && (
          <div className="col-12 text-center text-muted mt-4">
            No Employees added yet.
          </div>
        )}
      </div>

      {filteredEmployees.length > itemsPerPage && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${
                  currentPage === i + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

        {selectedEmployee && (
        <div
          className="employee-modal-overlay"
          onClick={() => setSelectedEmployee(null)}
        >
          <div className="employee-modal" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start">
              <button
                className="btn-close"
                onClick={() => setSelectedEmployee(null)}
              ></button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() =>
                  navigate(`/editEmployee/${selectedEmployee._id}`)
                }
              >
                <i className="bi bi-pencil-square"></i>
              </button>
            </div>

            {loadingDetails ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <div className="text-center">
                {selectedEmployee.image ? (
                  <img
                    src={selectedEmployee.image}
                    className="rounded-circle mb-3"
                    alt={selectedEmployee.name}
                    width="120"
                    height="120"
                  />
                ) : (
                  <i className="bi bi-person-circle fs-1 text-secondary mb-3"></i>
                )}
                <h5>{selectedEmployee.name}</h5>
                <p className="mb-1">{selectedEmployee.email}</p>
                <p className="mb-1">
                  <strong>Phone:</strong> {selectedEmployee.phone || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Address:</strong> {selectedEmployee.address || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Salary:</strong> ₹{selectedEmployee.salary || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Joining Date:</strong>{" "}
                  {selectedEmployee.joiningDate
                    ? new Date(selectedEmployee.joiningDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-muted mb-0">
                  <strong>Role:</strong>{" "}
                  {formatRoleForDisplay(selectedEmployee.role)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
