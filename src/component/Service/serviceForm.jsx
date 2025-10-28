import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../component/Login/axiosConfig";
import constant from "../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";
import "./serviceForm.css";

const ServiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    serviceType: "",
    remarks: "",
    cost: "",
  });

  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) fetchServiceData(id);
  }, [id]);

  const fetchServiceData = async (serviceId) => {
    try {
      const res = await axiosInstance.get(constant.GETSERVICEBYID(serviceId));

      const data =
        res?.data?.service ||
        res?.data?.data ||
        res?.data ||
        {};

      if (!data || Object.keys(data).length === 0) {
        alert("No service details found for this ID.");
        return;
      }

      setFormData({
        vehicleNumber: data.vehicleNumber || "",
        serviceType: data.serviceType || "",
        remarks: data.remarks || "",
        cost: data.cost || "",
      });
    } catch (err) {
      console.error("Error fetching service:", err);
      alert("Failed to load service details. Please try again.");
    }
  };

  const handleFetchVehicle = async () => {
    if (!formData.vehicleNumber.trim()) {
      alert("Please enter a vehicle number.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `${constant.GETVEHICLEBYNUMBER}/${formData.vehicleNumber}`
      );
      const vehicleData =
        res?.data?.vehicle || res?.data?.data || res?.data || null;

      if (vehicleData) {
        setVehicleDetails(vehicleData);
      } else {
        setVehicleDetails(null);
        alert("Vehicle not found!");
      }
    } catch (err) {
      console.error("Error fetching vehicle:", err);
      setVehicleDetails(null);
      alert("Vehicle not found or server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await axiosInstance.put(constant.UPDATESERVICE(id), formData);
        alert("Service updated successfully!");
      } else {
        await axiosInstance.post(constant.CREATESERVICE, formData);
        alert("Service added successfully!");
      }
      navigate("/ServiceList");
    } catch (err) {
      console.error("Error saving service:", err);
      alert("Failed to save service details. Please try again.");
    }
  };

  return (
    <div className="container py-4">
      <div className="service-card mx-auto">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="card-title m-0">
            {isEdit ? "Edit Service" : "Add Service"}
          </h2>
          <button
            className="btn btn-secondary-modern"
            onClick={() => navigate("/ServiceList")}
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Vehicle Number</label>
            <div className="d-flex gap-2">
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter Vehicle Registration Number"
                required
                disabled={isEdit} 
              />
              {!isEdit && (
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleFetchVehicle}
                  disabled={loading}
                >
                  {loading ? "Fetching..." : "Fetch"}
                </button>
              )}
            </div>
          </div>

          {vehicleDetails && (
            <div className="alert alert-info p-2">
              <strong>Vehicle:</strong> {vehicleDetails.manufacturer} {vehicleDetails.model} |{" "}
              <strong>Owner:</strong> {vehicleDetails.ownerName || "N/A"}

            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold">Service Type</label>
            <select
              className="form-select"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Service Type --</option>
              <option value="Periodic Service">Periodic Service</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Breakdown Service">Breakdown Service</option>
              <option value="Repair">Repair</option>
              <option value="Inspection">Inspection</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter service details or remarks"
              rows="3"
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Cost (₹)</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter service cost"
              step="0.01"
              required
            />
          </div>

          <button type="submit" className="btn btn-modern w-100 mt-3">
            {isEdit ? "Update Service" : "Add Service"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
