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
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const handleImageClick = (vehicle, e) => {
    e.stopPropagation();
    setSelectedVehicle(vehicle);
    setCurrentImageIndex(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVehicle(null);
    setCurrentImageIndex(0);
  };

  const getFirstImage = (vehicle) => {
    if (vehicle.images && vehicle.images.length > 0) {
      return vehicle.images[0];
    }
    return vehicle.image || null;
  };

  const nextImage = () => {
    if (selectedVehicle && selectedVehicle.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === selectedVehicle.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedVehicle && selectedVehicle.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? selectedVehicle.images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="container py-4">
      {/* Image Modal */}
      {showModal && selectedVehicle && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedVehicle.registrationNumber} - Images 
                  {selectedVehicle.images && selectedVehicle.images.length > 1 && 
                    ` (${currentImageIndex + 1}/${selectedVehicle.images.length})`
                  }
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body text-center">
                {selectedVehicle.images && selectedVehicle.images.length > 1 ? (
                  <div className="carousel-container position-relative">
                    <img
                      src={selectedVehicle.images[currentImageIndex]}
                      className="img-fluid rounded"
                      alt={`${selectedVehicle.registrationNumber} - ${currentImageIndex + 1}`}
                      style={{ 
                        maxHeight: "500px", 
                        width: "auto", 
                        objectFit: "contain" 
                      }}
                    />
                    
                    {/* Previous Button */}
                    <button 
                      className="carousel-control-prev position-absolute top-50 start-0 translate-middle-y btn btn-dark rounded-circle p-2"
                      onClick={prevImage}
                      style={{ left: "10px" }}
                    >
                      <span className="carousel-control-prev-icon"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    
                    {/* Next Button */}
                    <button 
                      className="carousel-control-next position-absolute top-50 end-0 translate-middle-y btn btn-dark rounded-circle p-2"
                      onClick={nextImage}
                      style={{ right: "10px" }}
                    >
                      <span className="carousel-control-next-icon"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                ) : (
                  <img
                    src={getFirstImage(selectedVehicle)}
                    className="img-fluid rounded"
                    alt={selectedVehicle.registrationNumber}
                    style={{ 
                      maxHeight: "500px", 
                      width: "auto", 
                      objectFit: "contain" 
                    }}
                  />
                )}
                
                {/* Vehicle Information */}
                <div className="vehicle-info mt-4 p-3 bg-light rounded">
                  <h6>Vehicle Information</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Manufacturer:</strong> {selectedVehicle.manufacturer}</p>
                      <p className="mb-1"><strong>Model:</strong> {selectedVehicle.model}</p>
                      <p className="mb-1"><strong>Type:</strong> {selectedVehicle.type}</p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-1"><strong>Fuel Type:</strong> {selectedVehicle.fuelType}</p>
                      <p className="mb-1"><strong>Running KM:</strong> {selectedVehicle.runningKM?.toLocaleString()}</p>
                      <p className="mb-1"><strong>Year:</strong> {selectedVehicle.makeYear}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => navigate(`/vehicle/${selectedVehicle._id}`)}
                >
                  View Full Details
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              {getFirstImage(v) ? (
                <div className="position-relative">
                  <img
                    src={getFirstImage(v)}
                    className="card-img-top vehicle-img"
                    alt={v.registrationNumber}
                    style={{ height: "200px", objectFit: "cover" }}
                    onClick={(e) => handleImageClick(v, e)}
                  />
                  {(v.images && v.images.length > 1) && (
                    <span className="position-absolute top-0 end-0 badge bg-primary m-2">
                      +{v.images.length - 1}
                    </span>
                  )}
                </div>
              ) : (
                <div className="vehicle-img-placeholder">No Image</div>
              )}
              <div className="card-body">
                <h5 className="card-title">{v.registrationNumber}</h5>
                <p className="card-text mb-1">
                  {v.manufacturer} — {v.model}
                </p>
                <p className="card-text small">
                  Type: {v.type} | KM: {v.runningKM?.toLocaleString()}
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