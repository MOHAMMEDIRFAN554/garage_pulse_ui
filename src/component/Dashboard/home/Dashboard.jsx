import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import { useNavigate } from "react-router-dom";
import constant from "../../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axiosInstance.get(constant.GETALLVEHICLE);
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error("Error fetching vehicles", error);
    }
  };

  const filteredVehicles =
    filter === "All"
      ? vehicles
      : vehicles.filter((v) => v.type === filter);

  return (
    <div className="container py-4">
      <h2 className="mb-3">Dashboard - Vehicles</h2>

      <div className="d-flex align-items-center mb-3 gap-2">
        <label className="me-2 mb-0">Filter:</label>
        <select className="form-select w-auto" onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Car">Car</option>
          <option value="Bus">Bus</option>
          <option value="Truck">Truck</option>
          <option value="Bike">Bike</option>
        </select>

        <button className="btn btn-primary ms-auto" onClick={() => navigate("/addVehicle")}>Add Vehicle</button>
      </div>

      <div className="row g-3">
        {filteredVehicles.map((v) => (
          <div key={v._id} className="col-sm-6 col-md-4 col-lg-3">
            <div className="card vehicle-card h-100" onClick={() => navigate(`/vehicle/${v._id}`)} style={{ cursor: "pointer" }}>
              {v.image ? (
                <img src={v.image.startsWith("/uploads") ? `${v.image}` : v.image} className="card-img-top vehicle-img" alt={v.registrationNumber} />
              ) : (
                <div className="vehicle-img-placeholder">No Image</div>
              )}
              <div className="card-body">
                <h5 className="card-title">{v.registrationNumber}</h5>
                <p className="card-text mb-1">{v.manufacturer} — {v.model}</p>
                <p className="card-text small">Type: {v.type} | KM: {v.runningKM}</p>
              </div>
            </div>
          </div>
        ))}
        {filteredVehicles.length === 0 && <div className="col-12">No vehicles added yet.</div>}
      </div>
    </div>
  );
};

export default Dashboard;
