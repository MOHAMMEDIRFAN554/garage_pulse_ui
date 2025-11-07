import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import constant from "../../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";

const ManageVehicleData = () => {
  const [vehicleTypes] = useState(["CAR", "BIKE", "TRUCK", "BUS"]);
  const [selectedType, setSelectedType] = useState("CAR");

  const [manufacturers, setManufacturers] = useState([]);
  const [newManufacturer, setNewManufacturer] = useState("");

  const [models, setModels] = useState({});
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [newModel, setNewModel] = useState("");

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const mfgRes = await axiosInstance.get(
          constant.GET_MANUFACTURERS_BY_TYPE(selectedType),
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const list = mfgRes.data.manufacturers || [];
        setManufacturers(list.map((m) => m.name));

        const modelMap = {};
        for (const m of list) {
          const mdlRes = await axiosInstance.get(
            constant.GET_MODELS_BY_MANUFACTURER(m._id),
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          modelMap[m.name] = (mdlRes.data.models || []).map((x) => x.name);
        }
        setModels(modelMap);
        setSelectedManufacturer("");
      } catch (err) {
        console.error("Error loading data:", err);
        if (err.response?.status === 401) {
          showToast("Authentication failed. Please login again.", "danger");
        } else {
          showToast("Failed to load manufacturers or models", "danger");
        }
      } finally {
        setLoading(false);
      }
    };
    if (selectedType) load();
  }, [selectedType]);

  const addManufacturer = async () => {
    const name = (newManufacturer || "").trim().toUpperCase();
    if (!name) return;
    try {
      setLoading(true);
      const payload = {
        name,
        vehicleType: selectedType,
      };
      await axiosInstance.post(constant.CREATE_MANUFACTURER, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setManufacturers((prev) =>
        prev.includes(name) ? prev : [...prev, name]
      );
      setNewManufacturer("");
      showToast("Manufacturer added successfully!", "success");
    } catch (err) {
      console.error("Error adding manufacturer:", err);
      if (err.response?.status === 401) {
        showToast("Authentication failed. Please login again.", "danger");
      } else {
        showToast(err.response?.data?.error || "Failed to add manufacturer", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  const addModel = async () => {
    const name = (newModel || "").trim().toUpperCase();
    if (!selectedManufacturer || !name) return;

    try {
      setLoading(true);
      const payload = {
        name,
        vehicleType: selectedType,
        manufacturer: selectedManufacturer,
      };
      await axiosInstance.post(constant.CREATE_MODEL, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setModels((prev) => ({
        ...prev,
        [selectedManufacturer]: [
          ...(prev[selectedManufacturer] || []),
          name,
        ],
      }));
      setNewModel("");
      showToast("Model added successfully!", "success");
    } catch (err) {
      console.error("Error adding model:", err);
      if (err.response?.status === 401) {
        showToast("Authentication failed. Please login again.", "danger");
      } else {
        showToast(err.response?.data?.error || "Failed to add model", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 position-relative">
      <h5>Manage Vehicle Types, Manufacturers & Models</h5>

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

      <div className="row mt-3">
        <div className="col-md-6 mb-3">
          <h6>Vehicle Type</h6>
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {vehicleTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row mt-1">
        <div className="col-md-6">
          <h6>Add Manufacturer</h6>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter Manufacturer (UPPERCASE)"
            value={newManufacturer}
            onChange={(e) => setNewManufacturer(e.target.value.toUpperCase())}
          />
          <button className="btn btn-primary btn-sm" onClick={addManufacturer}>
            Add Manufacturer
          </button>
        </div>

        <div className="col-md-6">
          <h6>Add Model</h6>
          <select
            className="form-select mb-2"
            value={selectedManufacturer}
            onChange={(e) => setSelectedManufacturer(e.target.value)}
          >
            <option value="">Select Manufacturer</option>
            {manufacturers.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Enter Model (UPPERCASE)"
            value={newModel}
            onChange={(e) => setNewModel(e.target.value.toUpperCase())}
          />
          <button className="btn btn-success btn-sm" onClick={addModel}>
            Add Model
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h6>Current Manufacturers & Models</h6>
        <ul>
          {Object.keys(models).map((manufacturer) => (
            <li key={manufacturer}>
              <strong>{manufacturer}:</strong>{" "}
              {(models[manufacturer] || []).join(", ")}
            </li>
          ))}
        </ul>
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

export default ManageVehicleData;