import React, { useState, useEffect } from "react";
import axiosInstance from "../Login/axiosConfig";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DeleteEmployee.css";
import constant from "../../constant/constant";

const DeleteEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get(constant.GETALLEMPLOYEE);
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setMessage("Please select an employee to delete");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.delete(constant.DELETEEMPLOYEE(selectedEmployee));
      setMessage(response.data.message || "Employee deleted successfully");
      fetchEmployees();
      setSelectedEmployee("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container delete-employee-container">
      <h3 className="text-center mb-4">Delete Employee</h3>

      <form onSubmit={handleDelete} className="delete-employee-form">
        <div className="form-group mb-3">
          <label htmlFor="employeeSelect" className="form-label">
            Select Employee:
          </label>
          <select
            id="employeeSelect"
            className="form-select"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">-- Choose Employee --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.role})
              </option>
            ))}
          </select>
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        <div className="d-flex justify-content-between">
          <button type="button" className="btn btn-secondary" onClick={() => navigate("/home")}>
            Back
          </button>
          <button type="submit" className="btn btn-danger" disabled={loading}>
            {loading ? "Deleting..." : "Delete Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteEmployee;
