import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import constant from "../../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";

const ManageServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [newService, setNewService] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    loadServiceTypes();
  }, []);

  const loadServiceTypes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(constant.GET_ALL_SERVICE_TYPES);
      setServiceTypes(res.data.serviceTypes || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load service types", "danger");
    } finally {
      setLoading(false);
    }
  };

  const addServiceType = async () => {
    const name = (newService || "").trim().toUpperCase();
    if (!name) return;

    try {
      setLoading(true);
      await axiosInstance.post(constant.CREATE_SERVICE_TYPE, { name });
      setServiceTypes((prev) =>
        prev.includes(name) ? prev : [...prev, name]
      );
      setNewService("");
      showToast("Service type added successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to add service type", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 position-relative">
      <h5>Manage Service Types</h5>

      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(255,255,255,0.7)", zIndex: 9999 }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter Service Type (e.g., PERIODIC, BREAKDOWN)"
        value={newService}
        onChange={(e) => setNewService(e.target.value.toUpperCase())}
      />

      <button className="btn btn-primary btn-sm" onClick={addServiceType}>
        Add Service Type
      </button>

      <ul className="mt-3">
        {serviceTypes.map((type, i) => (
          <li key={i}>{type}</li>
        ))}
      </ul>

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

export default ManageServiceTypes;
