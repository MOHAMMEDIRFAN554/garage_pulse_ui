import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import constant from "../../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";

const ManageVehicleData = () => {
  const [vehicleTypes] = useState(["CAR", "BIKE", "TRUCK", "BUS"]);
  const [selectedType, setSelectedType] = useState("CAR");

  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState({});
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [newManufacturer, setNewManufacturer] = useState("");
  const [newModel, setNewModel] = useState("");
  const [editing, setEditing] = useState({ type: "", name: "" });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500);
  };

  // Load manufacturers and models
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const mfgRes = await axiosInstance.get(
          constant.GET_MANUFACTURERS_BY_TYPE(selectedType)
        );
        const list = mfgRes.data.manufacturers || [];
        setManufacturers(list);

        const modelMap = {};
        for (const m of list) {
          const mdlRes = await axiosInstance.get(
            constant.GET_MODELS_BY_MANUFACTURER(m._id)
          );
          modelMap[m.name] = mdlRes.data.models || [];
        }
        setModels(modelMap);
      } catch (err) {
        console.error("Error loading data:", err);
        showToast("Failed to load manufacturers or models", "danger");
      } finally {
        setLoading(false);
      }
    };
    if (selectedType) load();
  }, [selectedType]);

  // Add manufacturer
  const addManufacturer = async () => {
    const name = (newManufacturer || "").trim().toUpperCase();
    if (!name) return;
    try {
      setLoading(true);
      await axiosInstance.post(constant.CREATE_MANUFACTURER, {
        name,
        vehicleType: selectedType,
      });
      showToast("Manufacturer added successfully!", "success");
      setNewManufacturer("");
      setSelectedType(selectedType); // reload trigger
    } catch (err) {
      console.error("Error adding manufacturer:", err);
      showToast(err.response?.data?.error || "Failed to add manufacturer", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Add model
  const addModel = async () => {
    const name = (newModel || "").trim().toUpperCase();
    if (!selectedManufacturer || !name) return;
    try {
      setLoading(true);
      await axiosInstance.post(constant.CREATE_MODEL, {
        name,
        vehicleType: selectedType,
        manufacturer: selectedManufacturer,
      });
      showToast("Model added successfully!", "success");
      setNewModel("");
      setSelectedType(selectedType);
    } catch (err) {
      console.error("Error adding model:", err);
      showToast(err.response?.data?.error || "Failed to add model", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Edit manufacturer or model name
  const handleEdit = (type, name) => {
    setEditing({ type, name });
  };

  const saveEdit = async (newName) => {
    try {
      setLoading(true);
      if (editing.type === "manufacturer") {
        const found = manufacturers.find((m) => m.name === editing.name);
        await axiosInstance.patch(constant.CREATE_MANUFACTURER, {
          id: found._id,
          name: newName.toUpperCase(),
        });
      } else {
        const foundMan = manufacturers.find((m) =>
          models[m.name]?.some((mod) => mod.name === editing.name)
        );
        await axiosInstance.patch(constant.CREATE_MODEL, {
          name: newName.toUpperCase(),
          manufacturer: foundMan.name,
          vehicleType: selectedType,
        });
      }
      showToast("Updated successfully!", "success");
      setEditing({ type: "", name: "" });
      setSelectedType(selectedType);
    } catch (err) {
      showToast("Failed to update", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Delete manufacturer or model
  const handleDelete = async (type, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      setLoading(true);
      if (type === "manufacturer") {
        const found = manufacturers.find((m) => m.name === name);
        await axiosInstance.delete(`${constant.CREATE_MANUFACTURER}/${found._id}`);
      } else {
        const foundMan = manufacturers.find((m) =>
          models[m.name]?.some((mod) => mod.name === name)
        );
        await axiosInstance.delete(`${constant.CREATE_MODEL}/${foundMan._id}/${name}`);
      }
      showToast("Deleted successfully", "success");
      setSelectedType(selectedType);
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 position-relative">
      <h5>Manage Vehicle Data</h5>

      {loading && (
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(255,255,255,0.5)", zIndex: 9999 }}
        >
          <div className="spinner-border text-primary" />
        </div>
      )}

      <div className="row mt-3">
        <div className="col-md-4">
          <label className="form-label">Vehicle Type</label>
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

        <div className="col-md-4">
          <label className="form-label">Add Manufacturer</label>
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Enter Manufacturer"
              value={newManufacturer}
              onChange={(e) => setNewManufacturer(e.target.value.toUpperCase())}
            />
            <button className="btn btn-primary" onClick={addManufacturer}>
              Add
            </button>
          </div>
        </div>

        <div className="col-md-4">
          <label className="form-label">Add Model</label>
          <div className="input-group">
            <select
              className="form-select"
              value={selectedManufacturer}
              onChange={(e) => setSelectedManufacturer(e.target.value)}
            >
              <option value="">Select Manufacturer</option>
              {manufacturers.map((m) => (
                <option key={m._id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            <input
              className="form-control"
              placeholder="Enter Model"
              value={newModel}
              onChange={(e) => setNewModel(e.target.value.toUpperCase())}
            />
            <button className="btn btn-success" onClick={addModel}>
              Add
            </button>
          </div>
        </div>
      </div>

      <hr className="my-4" />

      <h6>Current Manufacturers & Models</h6>
      <table className="table table-bordered table-hover mt-3">
        <thead className="table-light">
          <tr>
            <th>Manufacturer</th>
            <th>Models</th>
            <th style={{ width: "180px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {manufacturers.map((m) => (
            <tr key={m._id}>
              <td>
                {editing.type === "manufacturer" && editing.name === m.name ? (
                  <div className="input-group input-group-sm">
                    <input
                      className="form-control"
                      defaultValue={m.name}
                      onBlur={(e) => saveEdit(e.target.value)}
                      autoFocus
                    />
                  </div>
                ) : (
                  m.name
                )}
              </td>
              <td>
                {(models[m.name] || []).map((mdl, idx) => (
                  <span key={idx} className="badge bg-secondary me-1 mb-1">
                    {editing.type === "model" && editing.name === mdl.name ? (
                      <input
                        className="form-control form-control-sm d-inline-block"
                        style={{ width: "100px" }}
                        defaultValue={mdl.name}
                        onBlur={(e) => saveEdit(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      mdl.name
                    )}
                   
                  </span>
                ))}
              </td>
              <td>
                <button
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={() => handleEdit("manufacturer", m.name)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete("manufacturer", m.name)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!manufacturers.length && (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No manufacturers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
