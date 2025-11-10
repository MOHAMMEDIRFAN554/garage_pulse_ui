import { useState, useEffect } from "react";
import axiosInstance from "../../Login/axiosConfig";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import constant from "../../../constant/constant";
import "./AddVehicle.css";

const AddVehicle = () => {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({
    type: "",
    registrationNumber: "",
    ownerName: "",
    manufacturer: "",
    model: "",
    makeYear: "",
    fuelType: "",
    runningKM: "",
    servicePeriodYears: "",
    servicePeriodKM: "",
    chassisNumber: "",
    engineNumber: "",
    lastServiceDate: "",
    lastServiceKM: "",
    isNew: false,
    insuranceProvider: "",
    insurancePolicyNumber: "",
    insuranceExpiryDate: ""
  });

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [imageFiles, setImageFiles] = useState([{ id: Date.now(), file: null, preview: null }]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  // Fetch vehicle types and fuel types
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        setLoading(true);
        const [typesRes, fuelRes] = await Promise.all([
          axiosInstance.get(constant.GET_VEHICLE_TYPES),
          axiosInstance.get(constant.GET_ALL_FUEL_TYPES),
        ]);
        setVehicleTypes(typesRes.data.types || []);
        setFuelTypes(fuelRes.data.fuelTypes || []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load dropdown data", "danger");
      } finally {
        setLoading(false);
      }
    };
    loadDropdowns();
  }, []);

  // Load manufacturers based on type
  useEffect(() => {
    const loadManufacturers = async () => {
      if (!vehicle.type) return;
      try {
        setLoading(true);
        const res = await axiosInstance.get(
          constant.GET_MANUFACTURERS_BY_TYPE(vehicle.type)
        );
        setManufacturers(res.data.manufacturers || []);
        setVehicle((prev) => ({ ...prev, manufacturer: "", model: "" }));
        setModels([]);
      } catch (err) {
        console.error(err);
        showToast("Failed to load manufacturers", "danger");
      } finally {
        setLoading(false);
      }
    };
    loadManufacturers();
  }, [vehicle.type]);

  useEffect(() => {
    const loadModels = async () => {
      if (!vehicle.manufacturer) return;
      try {
        setLoading(true);
        const selectedMfg = manufacturers.find(
          (m) => m.name === vehicle.manufacturer
        );
        if (!selectedMfg) return;
        const res = await axiosInstance.get(
          constant.GET_MODELS_BY_MANUFACTURER(selectedMfg._id)
        );
        setModels(res.data.models || []);
      } catch (err) {
        console.error(err);
        showToast("Failed to load models", "danger");
      } finally {
        setLoading(false);
      }
    };
    loadModels();
  }, [vehicle.manufacturer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVehicle((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (id, file) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setImageFiles((prev) =>
        prev.map((img) => (img.id === id ? { ...img, file, preview } : img))
      );
    }
  };

  const addMoreImage = () => {
    setImageFiles((prev) => [...prev, { id: Date.now(), file: null, preview: null }]);
  };

  const removeImage = (id) => {
    setImageFiles((prev) => {
      const updatedFiles = prev.filter((img) => img.id !== id);
      if (updatedFiles.length === 0) {
        return [{ id: Date.now(), file: null, preview: null }];
      }
      return updatedFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = [
      "type",
      "registrationNumber",
      "manufacturer",
      "model",
      "makeYear",
      "fuelType",
      "runningKM",
      "servicePeriodYears",
      "servicePeriodKM",
    ];
    for (let k of required) {
      if (!vehicle[k]) {
        showToast(`Please fill ${k}`, "danger");
        return;
      }
    }

    try {
      setSubmitting(true);
      let imagesBase64 = [];

      for (let { file } of imageFiles) {
        if (file) {
          const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
          });
          imagesBase64.push(base64);
        }
      }

      const payload = {
        ...vehicle,
        images: imagesBase64,
        makeYear: Number(vehicle.makeYear),
        runningKM: Number(vehicle.runningKM),
        servicePeriodYears: Number(vehicle.servicePeriodYears),
        servicePeriodKM: Number(vehicle.servicePeriodKM),
        lastServiceKM: vehicle.lastServiceKM ? Number(vehicle.lastServiceKM) : null
      };

      const res = await axiosInstance.post(constant.ADDVEHICLE, payload);
      showToast(res.data.msg || "Vehicle added successfully", "success");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error(err);
      showToast(
        err.response?.data?.error || "Failed to add vehicle",
        "danger"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getValidationClass = (value) => (value ? "is-valid" : "is-invalid");

  return (
    <div className="container py-4">
      <div className="card mx-auto add-vehicle-card">
        <div className="card-body">
          <h4 className="card-title mb-3">Add Vehicle</h4>

          {toast.show && (
            <div className={`alert alert-${toast.type} custom-toast`} role="alert">
              {toast.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label">Vehicle Type</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-truck"></i></span>
                  <select
                    name="type"
                    className={`form-select ${getValidationClass(vehicle.type)}`}
                    value={vehicle.type}
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    {vehicleTypes.length > 0
                      ? vehicleTypes.map((t, i) => (
                          <option key={i} value={t.name || t}>
                            {t.name || t}
                          </option>
                        ))
                      : (
                        <>
                          <option value="Car">Car</option>
                          <option value="Bus">Bus</option>
                          <option value="Truck">Truck</option>
                          <option value="Bike">Bike</option>
                        </>
                      )}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Registration Number</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-hash"></i></span>
                  <input
                    name="registrationNumber"
                    className={`form-control ${getValidationClass(vehicle.registrationNumber)}`}
                    value={vehicle.registrationNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Owner Name</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-person-circle"></i></span>
                  <input
                    name="ownerName"
                    className={`form-control ${getValidationClass(vehicle.ownerName)}`}
                    value={vehicle.ownerName}
                    onChange={handleChange}
                    placeholder="Enter owner name"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Manufacturer</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-building"></i></span>
                  <select
                    name="manufacturer"
                    className={`form-select ${getValidationClass(vehicle.manufacturer)}`}
                    value={vehicle.manufacturer}
                    onChange={handleChange}
                  >
                    <option value="">Select Manufacturer</option>
                    {manufacturers.map((m, index) => (
                      <option key={index} value={m.name || m}>
                        {m.name || m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Model</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-car-front-fill"></i></span>
                  <select
                    name="model"
                    className={`form-select ${getValidationClass(vehicle.model)}`}
                    value={vehicle.model}
                    onChange={handleChange}
                  >
                    <option value="">Select Model</option>
                    {models.map((m, index) => (
                      <option key={index} value={m.name || m}>
                        {m.name || m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Make Year</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-calendar3"></i></span>
                  <input
                    name="makeYear"
                    type="number"
                    className={`form-control ${getValidationClass(vehicle.makeYear)}`}
                    value={vehicle.makeYear}
                    onChange={handleChange}
                    min="1950"
                    max={(new Date()).getFullYear()}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Fuel Type</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-fuel-pump"></i></span>
                  <select
                    name="fuelType"
                    className={`form-select ${getValidationClass(vehicle.fuelType)}`}
                    value={vehicle.fuelType}
                    onChange={handleChange}
                  >
                    <option value="">Select Fuel Type</option>
                    {fuelTypes.length > 0
                      ? fuelTypes.map((f, i) => (
                          <option key={i} value={f.name || f}>
                            {f.name || f}
                          </option>
                        ))
                      : (
                        <>
                          <option value="Petrol">Petrol</option>
                          <option value="Diesel">Diesel</option>
                          <option value="CNG">CNG</option>
                          <option value="GAS">GAS</option>
                          <option value="EV">EV</option>
                          <option value="Strong Hybrid">Strong Hybrid</option>
                          <option value="Mild Hybrid">Mild Hybrid</option>
                        </>
                      )}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Running KM</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-speedometer"></i></span>
                  <input
                    name="runningKM"
                    type="number"
                    className={`form-control ${getValidationClass(vehicle.runningKM)}`}
                    value={vehicle.runningKM}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Service Period (Years)</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-clock-history"></i></span>
                  <input
                    name="servicePeriodYears"
                    type="number"
                    className={`form-control ${getValidationClass(vehicle.servicePeriodYears)}`}
                    value={vehicle.servicePeriodYears}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Service Period (KM)</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
                  <input
                    name="servicePeriodKM"
                    type="number"
                    className={`form-control ${getValidationClass(vehicle.servicePeriodKM)}`}
                    value={vehicle.servicePeriodKM}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Chassis Number (optional)</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-gear"></i></span>
                  <input
                    name="chassisNumber"
                    className="form-control"
                    value={vehicle.chassisNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Engine Number (optional)</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-tools"></i></span>
                  <input
                    name="engineNumber"
                    className="form-control"
                    value={vehicle.engineNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Insurance Provider</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-building"></i></span>
                  <input
                    name="insuranceProvider"
                    className="form-control"
                    value={vehicle.insuranceProvider}
                    onChange={handleChange}
                    placeholder="Enter insurance company name"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Policy Number</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-card-text"></i></span>
                  <input
                    name="insurancePolicyNumber"
                    className="form-control"
                    value={vehicle.insurancePolicyNumber}
                    onChange={handleChange}
                    placeholder="Enter policy number"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Expiry Date</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-calendar-x"></i></span>
                  <input
                    type="date"
                    name="insuranceExpiryDate"
                    className="form-control"
                    value={vehicle.insuranceExpiryDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-12">
                <label className="form-label">Vehicle Images</label>
                {imageFiles.map((img) => (
                  <div key={img.id} className="mb-3 p-3 border rounded">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          onChange={(e) => handleFileChange(img.id, e.target.files[0])}
                        />
                      </div>
                      <div className="col-md-3">
                        {img.preview && (
                          <div className="image-preview-container position-relative">
                            <img
                              src={img.preview}
                              alt="Preview"
                              className="img-thumbnail"
                              style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="col-md-1">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeImage(img.id)}
                          disabled={imageFiles.length === 1 && !img.file}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mt-2"
                  onClick={addMoreImage}
                >
                  + Add More Image
                </button>
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isNew"
                    name="isNew"
                    checked={vehicle.isNew}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isNew">
                    This is a new vehicle (disable last service)
                  </label>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Last Service Date</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-calendar-event"></i></span>
                  <input
                    name="lastServiceDate"
                    type="date"
                    className="form-control"
                    value={vehicle.lastServiceDate}
                    onChange={handleChange}
                    disabled={vehicle.isNew}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Last Service KM</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-tachometer"></i></span>
                  <input
                    name="lastServiceKM"
                    type="number"
                    className="form-control"
                    value={vehicle.lastServiceKM}
                    onChange={handleChange}
                    disabled={vehicle.isNew}
                    min="0"
                  />
                </div>
              </div>

            </div>

            <div className="mt-4 d-flex gap-3 justify-content-end">
              <button type="submit" className="btn btn-modern" disabled={submitting || loading}>
                {submitting ? "Saving..." : loading ? "Loading..." : "Add Vehicle"}
              </button>
              <button
                type="button"
                className="btn btn-secondary-modern"
                onClick={() => navigate("/dashboard")}
              >
                Back to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;