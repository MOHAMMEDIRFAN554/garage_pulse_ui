import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import constant from "../../../constant/constant";

const ManageVehicleData = () => {
  const [vehicleTypes] = useState(["CAR", "BIKE", "TRUCK", "BUS"]);
  const [selectedType, setSelectedType] = useState("CAR");

  const [manufacturers, setManufacturers] = useState([]);
  const [newManufacturer, setNewManufacturer] = useState("");

  const [models, setModels] = useState({});
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [newModel, setNewModel] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const mfgRes = await axiosInstance.get(
          constant.GET_MANUFACTURERS_BY_TYPE(selectedType)
        );
        const list = mfgRes.data.manufacturers || [];
        setManufacturers(list.map((m) => m.name)); 

        const modelMap = {};
        for (const m of list) {
          const mdlRes = await axiosInstance.get(
            constant.GET_MODELS_BY_MANUFACTURER(m._id)
          );
          modelMap[m.name] = (mdlRes.data.models || []).map((x) => x.name);
        }
        setModels(modelMap);
        setSelectedManufacturer("");
      } catch (err) {
        console.error(err);
      }
    };
    if (selectedType) load();
  }, [selectedType]);

  const addManufacturer = async () => {
    const name = (newManufacturer || "").trim().toUpperCase();
    if (!name) return;
    try {
      await axiosInstance.post(constant.CREATE_MANUFACTURER, {
        name,
        vehicleType: selectedType,
      });
      setManufacturers((prev) =>
        prev.includes(name) ? prev : [...prev, name]
      );
      setNewManufacturer("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add manufacturer");
    }
  };

  const addModel = async () => {
    const name = (newModel || "").trim().toUpperCase();
    if (!selectedManufacturer || !name) return;

    try {
      await axiosInstance.post(constant.CREATE_MODEL, {
        name,
        vehicleType: selectedType,
        manufacturer: selectedManufacturer,
      });

      setModels((prev) => ({
        ...prev,
        [selectedManufacturer]: [
          ...(prev[selectedManufacturer] || []),
          name,
        ],
      }));
      setNewModel("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add model");
    }
  };

  return (
    <div className="p-3">
      <h5>Manage Vehicle Types, Manufacturers & Models</h5>

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
            onChange={(e) =>
              setNewManufacturer(e.target.value.toUpperCase())
            }
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
    </div>
  );
};

export default ManageVehicleData;
