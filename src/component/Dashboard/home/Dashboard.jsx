import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import { useNavigate } from "react-router-dom";
import constant from "../../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; 
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

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredVehicles =
    filter === "All"
      ? vehicles
      : vehicles.filter((v) => v.type === filter);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVehicles = filteredVehicles.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="m-0">Dashboard - Vehicles</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => navigate("/home")}>
            Back to Home
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/addVehicle")}>
            Add Vehicle
          </button>
        </div>
      </div>

      <div className="d-flex align-items-center mb-4 gap-2">
        <label className="me-2 mb-0 fw-semibold">Filter:</label>
        <select
          className="form-select w-auto"
          onChange={handleFilterChange}
          value={filter}
        >
          <option value="All">All</option>
          <option value="Car">Car</option>
          <option value="Bus">Bus</option>
          <option value="Truck">Truck</option>
          <option value="Bike">Bike</option>
        </select>
      </div>

      <div className="row g-3">
        {paginatedVehicles.map((v) => (
          <div key={v._id} className="col-sm-6 col-md-4 col-lg-3">
            <div
              className="card vehicle-card h-100 shadow-sm"
              onClick={() => navigate(`/vehicle/${v._id}`)}
              style={{ cursor: "pointer" }}
            >
              {v.image ? (
                <img
                  src={
                    v.image.startsWith("/uploads")
                      ? `${v.image}`
                      : v.image
                  }
                  className="card-img-top vehicle-img"
                  alt={v.registrationNumber}
                />
              ) : (
                <div className="vehicle-img-placeholder">No Image</div>
              )}
              <div className="card-body">
                <h5 className="card-title">{v.registrationNumber}</h5>
                <p className="card-text mb-1">
                  {v.manufacturer} — {v.model}
                </p>
                <p className="card-text small">
                  Type: {v.type} | KM: {v.runningKM}
                </p>
              </div>
            </div>
          </div>
        ))}

        {filteredVehicles.length === 0 && (
          <div className="col-12 text-center text-muted mt-4">
            No vehicles added yet.
          </div>
        )}
      </div>

      {filteredVehicles.length > itemsPerPage && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Dashboard;
