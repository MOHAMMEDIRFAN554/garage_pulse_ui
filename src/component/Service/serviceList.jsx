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
  const [expenseModal, setExpenseModal] = useState(false);
  const [ownerRequests, setOwnerRequests] = useState([]); // << merge source
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 10000);

    const handleServiceUpdate = (e) => {
      try {
        fetchAll();
        showToast(
          e.detail?.type === "expenses"
            ? "Service expenses updated"
            : `Service status updated${e.detail?.status ? ` to ${e.detail.status}` : ""}`,
          "info"
        );
      } catch (_) {
        fetchAll();
      }
    };
    window.addEventListener("serviceUpdate", handleServiceUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("serviceUpdate", handleServiceUpdate);
    };
  }, []);

  const fetchAll = async () => {
    try {
      const [srv, req] = await Promise.all([
        axiosInstance.get(constant.GETALLSERVICE),
        axiosInstance.get(constant.SERVICE_REQUEST_LIST_OWNER),
      ]);
      setServices(srv.data.services || []);
      setOwnerRequests(req.data.rows || []);
    } catch (err) {
      console.error("Error fetching services/requests:", err);
      showToast("Failed to fetch services.", "danger");
    }
  };

  // Map managerStatus to display status
  const computeDisplayStatus = (service) => {
    const matches = ownerRequests
      .filter((r) =>
        r?.vehicleId?.registrationNumber === service?.vehicleNumber &&
        r?.serviceType === service?.serviceType
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // most recent first

    if (matches.length) {
      const m = matches[0];
      const ms = (m.managerStatus || "").toUpperCase();
      if (ms === "COMPLETED") return "Completed";
      if (ms === "IN PROGRESS" || ms === "ACCEPTED" || ms === "REQUESTED") return "In Progress";
    }
    // fallback to existing field
    return service.status || "Pending";
  };

  const computeBadge = (statusText) => {
    if (statusText === "Completed") return "bg-success";
    if (statusText === "In Progress") return "bg-warning";
    return "bg-secondary";
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(constant.DELETESERVICE(id));
      showToast("Service deleted successfully.", "success");
      fetchAll();
      setShowModal(false);
    } catch (err) {
      console.error("Error deleting service:", err);
      showToast("Failed to delete service.", "danger");
    }
  };

  const handleView = (service, e) => {
    e.stopPropagation();
    setSelectedService(service);
    setShowModal(true);
  };

  // Use owner service-requests (accessible to owner) to show expenses
  const handleViewExpenses = async (serviceId) => {
    try {
      const reqs = ownerRequests;
      // try to match by service fields
      const base = services.find((s) => s._id === serviceId);
      if (!base) {
        showToast("Service not found", "warning");
        return;
      }
      const target = reqs
        .filter(
          (r) =>
            r?.vehicleId?.registrationNumber === base?.vehicleNumber &&
            r?.serviceType === base?.serviceType
        )
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];

      if (target && target.expenses && target.expenses.length > 0) {
        // shape to reuse existing modal rendering
        setSelectedService({
          ...target,
          expenseTotal: target.expenseTotal,
          expenses: target.expenses,
          serviceType: target.serviceType,
        });
        setExpenseModal(true);
      } else {
        showToast("No expenses recorded for this service yet", "warning");
      }
    } catch (err) {
      console.error("Error loading expenses:", err);
      showToast("Failed to fetch expenses", "danger");
    }
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
                    <th style={{ width: "200px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => {
                    const statusText = computeDisplayStatus(service);
                    return (
                      <tr key={service._id}>
                        <td className="text-capitalize">
                          {service.manufacturer && service.model
                            ? `${service.manufacturer} ${service.model}`
                            : "N/A"}
                        </td>
                        <td className="text-uppercase">{service.vehicleNumber || "N/A"}</td>
                        <td
                          className="fw-semibold text-primary text-capitalize"
                          style={{ cursor: "pointer", textDecoration: "underline" }}
                          onClick={(e) => handleView(service, e)}
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
                          <span className={`badge ${computeBadge(statusText)}`}>
                            {statusText}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            {(statusText === "Completed" ||
                              statusText === "In Progress") && (
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => handleViewExpenses(service._id)}
                              >
                                View Expenses
                              </button>
                            )}
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
                    );
                  })}
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
                <p><strong>Vehicle:</strong> {selectedService.manufacturer} {selectedService.model}</p>
                <p><strong>Registration No:</strong> {selectedService.vehicleNumber}</p>
                <p><strong>Owner Name:</strong> {selectedService.ownerName}</p>
                <p><strong>Service Type:</strong> {selectedService.serviceType}</p>
                <p><strong>Description:</strong> {selectedService.remarks || "N/A"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`badge ${computeBadge(computeDisplayStatus(selectedService))}`}>
                    {computeDisplayStatus(selectedService)}
                  </span>
                </p>
                <p><strong>Date:</strong> {new Date(selectedService.serviceDate).toLocaleString()}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {expenseModal && selectedService && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">
                  Service Expenses - {selectedService.serviceType}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setExpenseModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {selectedService.expenses?.length ? (
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedService.expenses.map((exp, i) => (
                        <tr key={i}>
                          <td>{exp.name}</td>
                          <td>{Number(exp.amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-muted mb-0">No expenses recorded</p>
                )}
                <div className="text-end mt-2">
                  <strong>
                    Total: ₹ {Number(selectedService.expenseTotal || 0).toFixed(2)}
                  </strong>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setExpenseModal(false)}>
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
