import React, { useState, useEffect } from "react";
import axiosInstance from "../../Login/axiosConfig";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import constant from "../../../constant/constant";
import "./AddVehicle.css";

const MANUFACTURERS = {
  "Maruti Suzuki": ["Alto", "Swift", "Baleno", "Dzire", "Ertiga","Brezza","Grand Vitara","Fronx"],
  Hyundai: ["i10", "i20", "Venue", "Creta", "Verna"],
  Tata: ["Tiago", "Tigor", "Nexon", "Harrier", "Punch"],
  Mahindra: ["Thar", "XUV700", "Scorpio", "Bolero"],
  Kia: ["Seltos", "Sonet", "Carnival", "EV6"],
  Honda: ["City", "Amaze", "Jazz", "WR-V"],
  Toyota: ["Innova", "Fortuner", "Yaris", "Glanza"],
  Ford: ["Figo", "EcoSport", "Endeavour"],
  Renault: ["Kwid", "Triber", "Duster"],
  Volkswagen: ["Polo", "Vento", "Taigun"],
  BMW: ["3 Series", "5 Series", "X1"],
  Mercedes: ["A-Class", "C-Class", "GLE"],
  Audi: ["A4", "A6", "Q3"],
  Bajaj: ["Pulsar", "Dominar"],
  Hero: ["Splendor", "Glamour"],
  TVS: ["Apache", "Ntorq"],
  "Royal Enfield": ["Classic 350", "Meteor 350"]
};

const AddVehicle = () => {
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState({
    type: "",
    registrationNumber: "",
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
    isNew: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [models, setModels] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });

  useEffect(() => {
    if (vehicle.manufacturer && MANUFACTURERS[vehicle.manufacturer]) {
      setModels(MANUFACTURERS[vehicle.manufacturer]);
    } else {
      setModels([]);
    }
  }, [vehicle.manufacturer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVehicle(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFile = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = ["type","registrationNumber","manufacturer","model","makeYear","fuelType","runningKM","servicePeriodYears","servicePeriodKM"];
    for (let k of required) {
      if (!vehicle[k]) {
        setToast({ show: true, type: "danger", msg: `Please fill ${k}` });
        return;
      }
    }

    const formData = new FormData();
    Object.keys(vehicle).forEach(k => {
      if (vehicle[k] !== undefined && vehicle[k] !== null && vehicle[k] !== "") {
        formData.append(k, vehicle[k]);
      }
    });

    if (imageFile) formData.append("image", imageFile);

    try {
      setSubmitting(true);
      const res = await axiosInstance.post(constant.ADDVEHICLE, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setToast({ show: true, type: "success", msg: res.data.msg || "Vehicle added" });
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (err) {
      console.error(err);
      setToast({ show: true, type: "danger", msg: err.response?.data?.error || "Failed to add vehicle" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="card mx-auto add-vehicle-card">
        <div className="card-body">
          <h4 className="card-title mb-3">Add Vehicle</h4>

          {toast.show && (
            <div className={`alert alert-${toast.type}`} role="alert">
              {toast.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Vehicle Type</label>
                <select name="type" className="form-select" onChange={handleChange} required>
                  <option value="">Select Type</option>
                  <option>Car</option>
                  <option>Bus</option>
                  <option>Truck</option>
                  <option>Bike</option>
                </select>
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Registration Number</label>
                <input name="registrationNumber" className="form-control" onChange={handleChange} required />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Manufacturer</label>
                <select name="manufacturer" className="form-select" onChange={handleChange} required>
                  <option value="">Select Manufacturer</option>
                  {Object.keys(MANUFACTURERS).map(m => <option key={m}>{m}</option>)}
                </select>
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Model</label>
                <select name="model" className="form-select" value={vehicle.model} onChange={handleChange} required>
                  <option value="">Select Model</option>
                  {models.length ? models.map(m => <option key={m}>{m}</option>) : null}
                </select>
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Make Year</label>
                <input name="makeYear" type="number" className="form-control" onChange={handleChange} min="1950" max={(new Date()).getFullYear()} required />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Fuel Type</label>
                <select name="fuelType" className="form-select" onChange={handleChange} required>
                  <option value="">Select Fuel Type</option>
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>CNG</option>
                  <option>GAS</option>
                  <option>EV</option>
                  <option>Strong Hybrid</option>
                  <option>Mild Hybrid</option>
                </select>
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Running KM</label>
                <input name="runningKM" type="number" className="form-control" onChange={handleChange} min="0" required />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Service Period (Years)</label>
                <input name="servicePeriodYears" type="number" className="form-control" onChange={handleChange} min="0" required />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Service Period (KM)</label>
                <input name="servicePeriodKM" type="number" className="form-control" onChange={handleChange} min="0" required />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Chassis Number (optional)</label>
                <input name="chassisNumber" className="form-control" onChange={handleChange} />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Engine Number (optional)</label>
                <input name="engineNumber" className="form-control" onChange={handleChange} />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Image (optional)</label>
                <input type="file" accept="image/*" className="form-control" onChange={handleFile} />
              </div>

              <div className="col-12 mb-2">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="isNew" name="isNew" checked={vehicle.isNew} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="isNew">This is a new vehicle (disable last service)</label>
                </div>
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Last Service Date</label>
                <input name="lastServiceDate" type="date" className="form-control" onChange={handleChange} disabled={vehicle.isNew} />
              </div>

              <div className="col-md-6 mb-2">
                <label className="form-label">Last Service KM</label>
                <input name="lastServiceKM" type="number" className="form-control" onChange={handleChange} disabled={vehicle.isNew} min="0" />
              </div>
            </div>

            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-success" disabled={submitting}>
                {submitting ? "Saving..." : "Add Vehicle"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
