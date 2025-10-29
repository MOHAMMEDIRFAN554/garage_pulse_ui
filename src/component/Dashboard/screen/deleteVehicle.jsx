import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../component/Login/axiosConfig";
import constant from "../../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";
import "./deleteVehicle.css";

const DeleteVehicle = () => {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!registrationNumber.trim()) {
      alert("Please enter a registration number.");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${constant.DLGETVEHICLEBYNUMBER}/${registrationNumber}`
      );

      const vehicle = res?.data?.vehicle || res?.data?.data || res?.data || null;
      if (!vehicle) {
        alert("No vehicle found for this registration number.");
        setVehicleData(null);
        return;
      }
      setVehicleData(vehicle);
    } catch (err) {
      console.error("Error fetching vehicle:", err);
      alert("Failed to fetch vehicle details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!vehicleData?._id) {
      alert("Please fetch a vehicle first.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete vehicle ${vehicleData.registrationNumber}?`
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(constant.DELETEVEHICLE(vehicleData._id));
      alert("Vehicle deleted successfully!");
      setVehicleData(null);
      setRegistrationNumber("");
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      alert("Failed to delete vehicle. You might not have permission.");
    }
  };

  return (
    <div className="container py-4">
      <div className="service-card mx-auto">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="card-title m-0">Delete Vehicle</h2>
          <button
            className="btn btn-secondary-modern"
            onClick={() => navigate("/home")}
          >
            Back
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">
            Vehicle Registration Number
          </label>
          <div className="d-flex gap-2">
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="form-control"
              placeholder="Enter registration number"
            />
            <button
              className="btn btn-outline-primary"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {vehicleData && (
          <div className="alert alert-info mt-3">
            <p>
              <strong>Owner Name:</strong>{" "}
              {vehicleData?.ownerName || "Unknown"}
            </p>
            <p>
              <strong>Registration Number:</strong>{" "}
              {vehicleData.registrationNumber}
            </p>
            <p>
              <strong>Manufacturer:</strong> {vehicleData.manufacturer}
            </p>
            <p>
              <strong>Model:</strong> {vehicleData.model}
            </p>
            <p>
              <strong>Type:</strong> {vehicleData.type}
            </p>

            <button
              className="btn btn-danger w-100 mt-3"
              onClick={handleDelete}
            >
              Delete Vehicle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteVehicle;
