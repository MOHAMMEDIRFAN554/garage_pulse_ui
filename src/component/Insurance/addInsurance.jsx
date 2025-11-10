import React, { useState, useEffect } from "react";
import axios from "axios";
import "./addInsurance.css";
import constant from "../../constant/constant";
import { useNavigate } from "react-router-dom";

const AddInsurance = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicleId: "",
    provider: "",
    policyNumber: "",
    startDate: "",
    expiryDate: "",
    premiumAmount: "",
    notes: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(constant.GETALLVEHICLE, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(res.data.vehicles)
          ? res.data.vehicles
          : res.data || [];

        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setVehicles([]);
      }
    };
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");

    const apiUrl = `${constant.ADDINSURANCE}`;

    const res = await axios.post(apiUrl, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 201) {
      setMessage("Insurance added successfully!");

      setFormData({
        vehicleId: "",
        provider: "",
        policyNumber: "",
        startDate: "",
        expiryDate: "",
        premiumAmount: "",
        notes: "",
      });
    }
  } catch (error) {
    console.error("Error adding insurance:", error);
    setMessage("Failed to add insurance. Please try again.");
  }
};


  return (
    <div className="add-insurance-card mt-4">
      <div className="card-body">
        <h2 className="card-title text-center mb-4">Add Vehicle Insurance</h2>

        {message && <div className="alert-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Select Vehicle</label>
            <select
              className="form-select"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose Vehicle --</option>
              {Array.isArray(vehicles) &&
                vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.registrationNumber} - {v.model}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Provider</label>
            <input
              type="text"
              name="provider"
              className="form-control"
              placeholder="Enter insurance provider"
              value={formData.provider}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Policy Number</label>
            <input
              type="text"
              name="policyNumber"
              className="form-control"
              placeholder="Enter policy number"
              value={formData.policyNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              className="form-control"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              className="form-control"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Premium Amount</label>
            <input
              type="number"
              name="premiumAmount"
              className="form-control"
              placeholder="Enter premium amount"
              value={formData.premiumAmount}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              className="form-control"
              rows="3"
              placeholder="Enter additional notes (optional)"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button type="submit" className="btn-modern">
              Save Insurance
            </button>

            <button
              type="button"
              className="btn-secondary-modern"
              onClick={() => navigate("/dashboard")}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInsurance;
