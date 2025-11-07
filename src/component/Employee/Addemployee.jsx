import React, { useState, useEffect } from "react";
import axiosInstance from "../Login/axiosConfig";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast } from "bootstrap";
import "./AddEmployee.css";
import constant from "../../constant/constant";

const AddEmployee = () => {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    joiningDate: "",
    licenseNumber: "",
    role: "",
    experience: "",
    salary: "", 
  });

  const [roles, setRoles] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get(constant.GET_ALL_EMPLOYEE_ROLES, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        let fetchedRoles = [];
        if (Array.isArray(res.data.roles)) {
          fetchedRoles = res.data.roles;
        } else if (Array.isArray(res.data.data)) {
          fetchedRoles = res.data.data;
        } else if (Array.isArray(res.data)) {
          fetchedRoles = res.data;
        }

        if (fetchedRoles.length > 0) {
          setRoles(fetchedRoles);
        } else {
          showToast("danger", "No roles found from server");
        }
      } catch (err) {
        console.error("Failed to fetch roles:", err);
        showToast("danger", "Failed to fetch employee roles");
      }
    };

    fetchRoles();
  }, []);

  const showToast = (type, msg) => {
    setToast({ show: true, type, msg });

    const toastEl = document.getElementById("liveToast");
    if (toastEl) {
      const bsToast = new Toast(toastEl, { delay: 3000 });
      bsToast.show();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "name" ? value.toUpperCase() : value;
    setEmployee((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = ["name", "email", "password", "phone", "role"];
    for (let k of required) {
      if (!employee[k]) {
        showToast("danger", `Please fill ${k}`);
        return;
      }
    }

    try {
      setSubmitting(true);

      let base64Image = "";
      if (imageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        await new Promise((resolve) => {
          reader.onload = () => {
            base64Image = reader.result;
            resolve();
          };
        });
      }

      const payload = { ...employee, image: base64Image };

      await axiosInstance.post(constant.ADDEMPLOYEE, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      showToast("success", "Employee added successfully");
      setTimeout(() => navigate("/EmployeList"), 1500);
    } catch (err) {
      showToast(
        "danger",
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to add employee"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getValidationClass = (value) => (value ? "is-valid" : "is-invalid");

  return (
    <div className="container py-4">
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div
          id="liveToast"
          className={`toast align-items-center text-bg-${toast.type} border-0 ${
            toast.show ? "show" : "hide"
          }`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.msg}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
              onClick={() => setToast({ ...toast, show: false })}
            ></button>
          </div>
        </div>
      </div>

      <div className="card mx-auto add-employee-card">
        <div className="card-body">
          <h4 className="card-title mb-3">Add Employee</h4>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name *</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    name="name"
                    value={employee.name}
                    className={`form-control ${getValidationClass(employee.name)}`}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Email *</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    name="email"
                    type="email"
                    value={employee.email}
                    className={`form-control ${getValidationClass(employee.email)}`}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Password *</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    name="password"
                    type="password"
                    value={employee.password}
                    className={`form-control ${getValidationClass(employee.password)}`}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone Number *</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    value={employee.phone}
                    className={`form-control ${getValidationClass(employee.phone)}`}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Salary (₹)</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-cash-coin"></i>
                  </span>
                  <input
                    name="salary"
                    type="number"
                    value={employee.salary}
                    className="form-control"
                    onChange={handleChange}
                    min="0"
                    placeholder="Enter salary"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Role *</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person-badge"></i>
                  </span>
                  <select
                    name="role"
                    className={`form-select ${getValidationClass(employee.role)}`}
                    value={employee.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.length > 0 ? (
                      roles.map((role, index) => (
                        <option key={`${role}-${index}`} value={role}>
                          {role}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading roles...</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Joining Date</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-calendar3"></i>
                  </span>
                  <input
                    name="joiningDate"
                    type="date"
                    value={employee.joiningDate}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Experience (Years)</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-award"></i>
                  </span>
                  <input
                    name="experience"
                    type="number"
                    value={employee.experience}
                    className="form-control"
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">License Number (optional)</label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-card-text"></i>
                  </span>
                  <input
                    name="licenseNumber"
                    value={employee.licenseNumber}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-12">
                <label className="form-label">Address (optional)</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows="2"
                  value={employee.address}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-md-6">
                <label className="form-label">Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleFile}
                />

                {preview && (
                  <div className="mt-3 text-center">
                    <img
                      src={preview}
                      alt="Preview"
                      className="img-fluid rounded shadow-sm"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 d-flex gap-3">
              <button
                type="submit"
                className="btn btn-modern"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Add Employee"}
              </button>
              <button
                type="button"
                className="btn btn-secondary-modern"
                onClick={() => navigate("/EmployeList")}
              >
                Back to Employee List
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
