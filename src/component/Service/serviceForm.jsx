import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../component/Login/axiosConfig";
import constant from "../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";
import "./serviceForm.css";

const ServiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    serviceType: "",
    remarks: "",
  });

  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    fetchServiceTypes();
    fetchUserVehicles();
    if (isEdit) fetchServiceData(id);
  }, [id]);

  const fetchServiceTypes = async () => {
    try {
      const res = await axiosInstance.get(constant.GET_ALL_SERVICE_TYPES);
      setServiceTypes(res.data.serviceTypes || []);
    } catch (err) {
      console.error("Error fetching service types:", err);
      showToast("Failed to load service types", "danger");
    }
  };

  const fetchUserVehicles = async () => {
    try {
      const res = await axiosInstance.get(constant.GETALLVEHICLE);
      setVehicles(res.data.vehicles || []);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
      showToast("Failed to load vehicles", "danger");
    }
  };

  const fetchServiceData = async (serviceId) => {
    try {
      const res = await axiosInstance.get(constant.GETSERVICEBYID(serviceId));
      const data = res?.data?.service || {};

      if (!data || Object.keys(data).length === 0) {
        showToast("No service details found for this ID.", "warning");
        return;
      }

      setFormData({
        vehicleNumber: data.vehicleNumber || "",
        serviceType: data.serviceType || "",
        remarks: data.remarks || "",
      });

      if (data.vehicleNumber) {
        const vehicle = vehicles.find(v => v.registrationNumber === data.vehicleNumber);
        if (vehicle) {
          setVehicleDetails({
            registrationNumber: vehicle.registrationNumber,
            manufacturer: vehicle.manufacturer,
            model: vehicle.model,
            ownerName: vehicle.ownerName || "N/A"
          });
        }
      }
    } catch (err) {
      console.error("Error fetching service:", err);
      showToast("Failed to load service details.", "danger");
    }
  };

  const handleVehicleChange = (e) => {
    const selectedVehicleNumber = e.target.value;
    setFormData({ ...formData, vehicleNumber: selectedVehicleNumber });

    if (selectedVehicleNumber) {
      const selectedVehicle = vehicles.find(v => v.registrationNumber === selectedVehicleNumber);
      if (selectedVehicle) {
        setVehicleDetails({
          registrationNumber: selectedVehicle.registrationNumber,
          manufacturer: selectedVehicle.manufacturer,
          model: selectedVehicle.model,
          ownerName: selectedVehicle.ownerName || "N/A"
        });
      }
    } else {
      setVehicleDetails(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vehicleNumber) {
      showToast("Please select a vehicle", "warning");
      return;
    }

    try {
      if (isEdit) {
        await axiosInstance.put(constant.UPDATESERVICE(id), formData);
        showToast("Service updated successfully!", "success");
      } else {
        await axiosInstance.post(constant.CREATESERVICE, formData);
        showToast("Service request submitted successfully!", "success");

        // ✅ Also send a service request to the Service Manager
        try {
          const selectedVehicle = vehicles.find(v => v.registrationNumber === formData.vehicleNumber);
          if (selectedVehicle) {
            await axiosInstance.post(constant.SERVICE_REQUEST_CREATE, {
              vehicleId: selectedVehicle._id,
              serviceType: formData.serviceType,
              narration: formData.remarks,
            });
            console.log("Service request sent to manager successfully.");
          }
        } catch (reqErr) {
          console.error("Failed to send service request to manager:", reqErr);
        }

        // ✅ Trigger live update event for dashboards
        window.dispatchEvent(new CustomEvent("serviceUpdate", {
          detail: { type: "newService", vehicleNumber: formData.vehicleNumber, serviceType: formData.serviceType }
        }));
      }
      setTimeout(() => navigate("/ServiceList"), 1200);
    } catch (err) {
      console.error("Error saving service:", err);
      showToast("Failed to save service details.", "danger");
    }
  };

  return (
    <div className="container py-4 position-relative">
      <div className="service-card mx-auto">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="card-title m-0">
            {isEdit ? "Edit Service" : "Request Service"}
          </h2>
          <button
            className="btn btn-secondary-modern"
            onClick={() => navigate("/owner/service-requests")}
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Select Vehicle</label>
            <select
              className="form-select"
              name="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleVehicleChange}
              required
              disabled={isEdit}
            >
              <option value="">-- Select Vehicle --</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle._id} value={vehicle.registrationNumber}>
                  {vehicle.manufacturer} {vehicle.model} - {vehicle.registrationNumber}
                </option>
              ))}
            </select>
            <div className="form-text">
              Choose from your registered vehicles
            </div>
          </div>

          {vehicleDetails && (
            <div className="alert alert-info p-2">
              <strong>Selected Vehicle:</strong> {vehicleDetails.manufacturer} {vehicleDetails.model} |{" "}
              <strong>Registration:</strong> {vehicleDetails.registrationNumber} |{" "}
              <strong>Owner:</strong> {vehicleDetails.ownerName}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-semibold">Service Type</label>
            <select
              className="form-select"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Service Type --</option>
              {serviceTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter service details or remarks"
              rows="3"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-modern w-100 mt-3">
            {isEdit ? "Update Service" : "Submit Service Request"}
          </button>
        </form>
      </div>

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

export default ServiceForm;
