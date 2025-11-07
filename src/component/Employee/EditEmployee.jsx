import React, { useState, useEffect } from "react";
import axiosInstance from "../Login/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast } from "bootstrap";
import "./AddEmployee.css";
import constant from "../../constant/constant";

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    joiningDate: "",
    licenseNumber: "",
    role: "",
    experience: "",
    salary: "",
  });

  const [roles, setRoles] = useState([]);
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });

  useEffect(() => {
    fetchRoles();
    fetchEmployee();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await axiosInstance.get(constant.GET_ALL_EMPLOYEE_ROLES, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setRoles(res.data.roles || []);
    } catch {
      showToast("danger", "Failed to fetch roles");
    }
  };

  const fetchEmployee = async () => {
    try {
      const res = await axiosInstance.get(constant.GETEMPLOYEEBYID(id), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployee(res.data.employee);
    } catch {
      showToast("danger", "Failed to fetch employee data");
    }
  };

  const showToast = (type, msg) => {
    setToast({ show: true, type, msg });
    const toastEl = document.getElementById("liveToast");
    if (toastEl) new Toast(toastEl, { delay: 3000 }).show();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "name" ? value.toUpperCase() : value;
    setEmployee((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(constant.UPDATEEMPLOYEE(id), employee, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      showToast("success", "Employee updated successfully");
      setTimeout(() => navigate("/EmployeList"), 1500);
    } catch {
      showToast("danger", "Failed to update employee");
    }
  };

  return (
    <div className="container py-4">
      <div
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 11 }}
      >
        <div
          id="liveToast"
          className={`toast align-items-center text-bg-${toast.type} border-0 ${
            toast.show ? "show" : "hide"
          }`}
        >
          <div className="d-flex">
            <div className="toast-body">{toast.msg}</div>
          </div>
        </div>
      </div>

      <div className="card mx-auto add-employee-card">
        <div className="card-body">
          <h4 className="card-title mb-3">Edit Employee</h4>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name *</label>
                <input
                  name="name"
                  value={employee.name}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email *</label>
                <input
                  name="email"
                  value={employee.email}
                  className="form-control"
                  disabled
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone *</label>
                <input
                  name="phone"
                  value={employee.phone}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Salary (₹)</label>
                <input
                  name="salary"
                  value={employee.salary}
                  type="number"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Role *</label>
                <select
                  name="role"
                  value={employee.role}
                  className="form-select"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((r, i) => (
                    <option key={i} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-12">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  value={employee.address}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <button type="submit" className="btn btn-modern">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary-modern ms-2"
                onClick={() => navigate("/EmployeList")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
