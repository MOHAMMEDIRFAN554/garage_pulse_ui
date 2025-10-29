import React, { useState } from "react";
import axiosInstance from "../Login/axiosConfig";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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
    role: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFile = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = ["name", "email", "password", "phone", "role"];
    for (let k of required) {
      if (!employee[k]) {
        setToast({ show: true, type: "danger", msg: `Please fill ${k}` });
        return;
      }
    }

    const formData = new FormData();
    Object.keys(employee).forEach((k) => {
      if (employee[k] !== undefined && employee[k] !== null && employee[k] !== "") {
        formData.append(k, employee[k]);
      }
    });

    if (imageFile) formData.append("photo", imageFile);

    try {
      setSubmitting(true);
      const res = await axiosInstance.post(constant.ADDEMPLOYEE, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setToast({ show: true, type: "success", msg: res.data.msg || "Employee added successfully" });
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        type: "danger",
        msg: err.response?.data?.error || "Failed to add employee"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getValidationClass = (value) => (value ? "is-valid" : "is-invalid");

  return (
    <div className="container py-4">
      <div className="card mx-auto add-employee-card">
        <div className="card-body">
          <h4 className="card-title mb-3">Add Employee</h4>

          {toast.show && (
            <div className={`alert alert-${toast.type} custom-toast`} role="alert">
              {toast.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-person"></i></span>
                  <input
                    name="name"
                    className={`form-control ${getValidationClass(employee.name)}`}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                  <input
                    name="email"
                    type="email"
                    className={`form-control ${getValidationClass(employee.email)}`}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock"></i></span>
                  <input
                    name="password"
                    type="password"
                    className={`form-control ${getValidationClass(employee.password)}`}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone Number</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                  <input
                    name="phone"
                    type="tel"
                    className={`form-control ${getValidationClass(employee.phone)}`}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Role</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-person-badge"></i></span>
                  <select
                    name="role"
                    className={`form-select ${getValidationClass(employee.role)}`}
                    value={employee.role}
                    onChange={handleChange}
                  >
                    <option value="">Select Role</option>
                    <option>Driver</option>
                    <option>Co-driver</option>
                    <option>Mechanical</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Joining Date</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-calendar3"></i></span>
                  <input
                    name="joiningDate"
                    type="date"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Experience (Years)</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-award"></i></span>
                  <input
                    name="experience"
                    type="number"
                    className="form-control"
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">License Number (optional)</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-card-text"></i></span>
                  <input
                    name="licenseNumber"
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
              </div>

            </div>

            <div className="mt-4 d-flex gap-3">
              <button type="submit" className="btn btn-modern" disabled={submitting}>
                {submitting ? "Saving..." : "Add Employee"}
              </button>
              <button
                type="button"
                className="btn btn-secondary-modern"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
