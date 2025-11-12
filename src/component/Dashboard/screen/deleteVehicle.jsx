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
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const handleSearch = async () => {
    if (!registrationNumber.trim()) {
      showToast("Please enter a registration number.", "warning");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `${constant.GETVEHICLEBYNUMBER}/${registrationNumber}`
      );

      const vehicle = res?.data?.vehicle || res?.data?.data || res?.data || null;
      if (!vehicle?._id) {
        showToast("No vehicle found for this registration number.", "danger");
        setVehicleData(null);
        return;
      }
      setVehicleData(vehicle);
      showToast("Vehicle fetched successfully!", "success");
    } catch (err) {
      console.error("Error fetching vehicle:", err);
      showToast("Failed to fetch vehicle details.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!vehicleData || !vehicleData._id) {
      showToast("Please fetch a vehicle first.", "warning");
      return;
    }

    if (!window.confirm(`Delete vehicle ${vehicleData.registrationNumber}?`))
      return;

    try {
      await axiosInstance.delete(constant.DELETEVEHICLE(vehicleData._id));
      showToast("Vehicle deleted successfully!", "success");
      setVehicleData(null);
      setRegistrationNumber("");
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      showToast("Failed to delete vehicle. You might not have permission.", "danger");
    }
  };

  return (
    <div className="container py-4 position-relative">
      <div className="service-card mx-auto">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="card-title m-0">Delete Vehicle</h2>
          <button
            className="btn btn-secondary-modern"
            onClick={() => navigate("/dashboard")}
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
              <strong>Owner Name:</strong> {vehicleData?.ownerName || "Unknown"}
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

      {toast.show && (
        <div
          className={`toast align-items-center text-white bg-${toast.type} border-0 position-fixed bottom-0 end-0 m-3 show`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToast({ show: false, message: "", type: "" })}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteVehicle;
