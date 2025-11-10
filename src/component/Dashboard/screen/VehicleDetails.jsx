import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import constant from "../../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";
import "./VehicleDetails.css";
import PrintComponent from "../../Print/PrintComponent"; 

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get(constant.GETVEHICLEBYID(id));
        setVehicle(res.data.vehicle);
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Failed to load vehicle");
        navigate("/dashboard");
      }
    };
    fetch();
  }, [id, navigate]);

  if (!vehicle)
    return (
      <div className="container py-4 loading-container">
        <div className="loading-text">Loading vehicle details...</div>
      </div>
    );

  return (
    <div className="container py-4 vehicle-details-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-secondary back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <PrintComponent
          contentSelector=".vehicle-card"
          title="Vehicle Details Report"
          footer={`© ${new Date().getFullYear()} Garage Pulse - Vehicle Management System`}
        />
      </div>

      <div className="shadow-sm vehicle-card">
        {vehicle.image && (
          <div className="vehicle-image-container">
            <img
              src={vehicle.image}
              alt="vehicle"
              className="img-fluid rounded vehicle-image"
              style={{
                maxHeight: "300px",
                objectFit: "cover",
                width: "auto",
              }}
            />
          </div>
        )}

        <div className="card-body">
          <h3 className="card-title vehicle-title mb-4">{vehicle.registrationNumber}</h3>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <h5 className="section-header">Vehicle Information</h5>

                <p className="info-paragraph"><strong>Manufacturer:</strong> {vehicle.manufacturer}</p>
                <p className="info-paragraph"><strong>Model:</strong> {vehicle.model}</p>
                <p className="info-paragraph"><strong>Type:</strong> {vehicle.type}</p>
                <p className="info-paragraph"><strong>Fuel Type:</strong> {vehicle.fuelType}</p>
                <p className="info-paragraph"><strong>Make Year:</strong> {vehicle.makeYear}</p>
                <p className="info-paragraph"><strong>Running KM:</strong> {vehicle.runningKM.toLocaleString()} KM</p>
                <p className="info-paragraph"><strong>Service Interval:</strong> {vehicle.servicePeriodYears} years / {vehicle.servicePeriodKM.toLocaleString()} KM</p>
                <p className="info-paragraph"><strong>Chassis Number:</strong>
                  <span className={!vehicle.chassisNumber ? "status-not-available" : ""}>
                    {vehicle.chassisNumber || "Not Available"}
                  </span>
                </p>
                <p className="info-paragraph"><strong>Engine Number:</strong>
                  <span className={!vehicle.engineNumber ? "status-not-available" : ""}>
                    {vehicle.engineNumber || "Not Available"}
                  </span>
                </p>
                <p className="info-paragraph"><strong>New Vehicle:</strong>
                  <span className={vehicle.isNew ? "status-new" : "status-used"}>
                    {vehicle.isNew ? "Yes" : "No"}
                  </span>
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-4">
                <h5 className="section-header">Service Information</h5>

                {vehicle.lastServiceDate ? (
                  <p className="info-paragraph">
                    <strong>Last Service Date:</strong> {new Date(vehicle.lastServiceDate).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="info-paragraph"><strong>Last Service Date:</strong>
                    <span className="status-not-available">Not Serviced Yet</span>
                  </p>
                )}

                {vehicle.lastServiceKM !== null ? (
                  <p className="info-paragraph"><strong>Last Service KM:</strong> {vehicle.lastServiceKM.toLocaleString()} KM</p>
                ) : (
                  <p className="info-paragraph"><strong>Last Service KM:</strong>
                    <span className="status-not-available">Not Serviced Yet</span>
                  </p>
                )}
              </div>

              <div className="mb-4">
                <h5 className="section-header">Insurance Information</h5>

                {vehicle.insuranceProvider && (
                  <p className="info-paragraph"><strong>Insurance Provider:</strong> {vehicle.insuranceProvider}</p>
                )}

                {vehicle.insurancePolicyNumber && (
                  <p className="info-paragraph"><strong>Policy Number:</strong> {vehicle.insurancePolicyNumber}</p>
                )}

                {vehicle.insuranceExpiryDate ? (
                  <p className="info-paragraph">
                    <strong>Insurance Expiry:</strong> {new Date(vehicle.insuranceExpiryDate).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="info-paragraph"><strong>Insurance Expiry:</strong>
                    <span className="status-not-available">Not Available</span>
                  </p>
                )}
              </div>

              <div className="mb-4">
                <h5 className="section-header">Owner Information</h5>
                {vehicle.ownerName && (
                  <p className="info-paragraph"><strong>Owner Name:</strong> {vehicle.ownerName}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 additional-details">
            <h5 className="section-header">Additional Details</h5>
            <div className="row">
              <div className="col-md-6">
                <p className="info-paragraph"><strong>Vehicle Status:</strong>
                  <span className={vehicle.isNew ? "status-new" : "status-used"}>
                    {vehicle.isNew ? "Brand New Vehicle" : "Used Vehicle"}
                  </span>
                </p>
                <p className="info-paragraph"><strong>Next Service Due:</strong> {
                  vehicle.lastServiceDate
                    ? `After ${vehicle.servicePeriodKM - (vehicle.runningKM - vehicle.lastServiceKM)} KM or ${new Date(new Date(vehicle.lastServiceDate).getFullYear() + vehicle.servicePeriodYears, new Date(vehicle.lastServiceDate).getMonth(), new Date(vehicle.lastServiceDate).getDate()).toLocaleDateString()}`
                    : `At ${vehicle.servicePeriodKM.toLocaleString()} KM`
                }</p>
              </div>
              <div className="col-md-6">
                <p className="info-paragraph"><strong>Current Odometer:</strong> {vehicle.runningKM.toLocaleString()} KM</p>
                <p className="info-paragraph"><strong>Fuel Type:</strong> {vehicle.fuelType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
