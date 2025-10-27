import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import constant from "../../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";

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
  }, [id]);

  if (!vehicle) return <div className="container py-4">Loading...</div>;

  return (
    <div className="container py-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>Back</button>
      <div className="card">
        {vehicle.image ? <img src={vehicle.image} alt="vehicle" style={{ width: "100%", maxHeight: 400, objectFit: "cover" }} /> : null}
        <div className="card-body">
          <h3>{vehicle.registrationNumber}</h3>
          <p><strong>Manufacturer:</strong> {vehicle.manufacturer}</p>
          <p><strong>Model:</strong> {vehicle.model}</p>
          <p><strong>Type:</strong> {vehicle.type}</p>
          <p><strong>Fuel:</strong> {vehicle.fuelType}</p>
          <p><strong>Make Year:</strong> {vehicle.makeYear}</p>
          <p><strong>Running KM:</strong> {vehicle.runningKM}</p>
          <p><strong>Service Interval:</strong> {vehicle.servicePeriodYears} years / {vehicle.servicePeriodKM} KM</p>
          <p><strong>Chassis Number:</strong> {vehicle.chassisNumber || "-"}</p>
          <p><strong>Engine Number:</strong> {vehicle.engineNumber || "-"}</p>
          <p><strong>New Vehicle:</strong> {vehicle.isNew ? "Yes" : "No"}</p>
          {vehicle.lastServiceDate && <p><strong>Last Service Date:</strong> {new Date(vehicle.lastServiceDate).toLocaleDateString()}</p>}
          {vehicle.lastServiceKM !== null && <p><strong>Last Service KM:</strong> {vehicle.lastServiceKM}</p>}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
