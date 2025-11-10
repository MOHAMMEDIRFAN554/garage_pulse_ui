import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../Login/axiosConfig";
import constant from "../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ServiceList.css";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    fetchServices();
    // Set up polling for live updates every 10 seconds
    const interval = setInterval(fetchServices, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get(constant.GETALLSERVICE);
      setServices(res.data.services || []);
    } catch (err) {
      console.error("Error fetching services:", err);
      showToast("Failed to fetch services.", "danger");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(constant.DELETESERVICE(id));
      showToast("Service deleted successfully.", "success");
      fetchServices();
      setShowModal(false);
    } catch (err) {
      console.error("Error deleting service:", err);
      showToast("Failed to delete service.", "danger");
    }
  };

  const handleView = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    navigate(`/editService/${id}`);
  };

  return (
    <div className="container py-4 position-relative">
      <div className="service-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="card-title m-0">Service Management</h2>
          <div className="d-flex gap-2">
            <button
              className="btn btn-secondary-modern"
              onClick={() => navigate("/home")}
            >
              Back to Home
            </button>
            <button
              className="btn btn-modern"
              onClick={() => navigate("/ServiceForm")}
            >
              Add Service
            </button>
          </div>
        </div>

        <div className="card-body p-0">
          {services.length === 0 ? (
            <p className="text-center text-muted py-4 mb-0 fs-5">
              No services added yet.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 service-table">
                <thead className="table-light">
                  <tr>
                    <th>Vehicle</th>
                    <th>Registration No</th>
                    <th>Service Type</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th style={{ width: "160px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service._id}>
                      <td className="text-capitalize">
                        {service.manufacturer && service.model
                          ? `${service.manufacturer} ${service.model}`
                          : "N/A"}
                      </td>
                      <td className="text-uppercase">{service.vehicleNumber || "N/A"}</td>
                      <td
                        className="fw-semibold text-primary text-capitalize pointer"
                        onClick={() => handleView(service)}
                      >
                        {service.serviceType}
                      </td>
                      <td className="text-muted">
                        {service.remarks
                          ? service.remarks.length > 40
                            ? service.remarks.substring(0, 40) + "..."
                            : service.remarks
                          : "-"}
                      </td>
                      <td>
                        <span className={`badge ${
                          service.status === 'Completed' ? 'bg-success' : 
                          service.status === 'In Progress' ? 'bg-warning' : 
                          'bg-secondary'
                        }`}>
                          {service.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(service._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(service._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedService && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">
                  Service Details - {selectedService.serviceType}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Vehicle:</strong>{" "}
                  {selectedService.manufacturer && selectedService.model
                    ? `${selectedService.manufacturer} ${selectedService.model}`
                    : "N/A"}
                </p>
                <p>
                  <strong>Registration No:</strong>{" "}
                  {selectedService.vehicleNumber}
                </p>
                <p>
                  <strong>Owner Name:</strong> {selectedService.ownerName}
                </p>
                <p>
                  <strong>Service Type:</strong> {selectedService.serviceType}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedService.remarks || "N/A"}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`badge ${
                    selectedService.status === 'Completed' ? 'bg-success' : 
                    selectedService.status === 'In Progress' ? 'bg-warning' : 
                    'bg-secondary'
                  }`}>
                    {selectedService.status}
                  </span>
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedService.serviceDate).toLocaleString()}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(selectedService._id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => handleEdit(selectedService._id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div
          className={`toast align-items-center text-bg-${toast.type} border-0 position-fixed bottom-0 end-0 m-3 show`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToast({ show: false, message: "", type: "success" })}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList;