import React, { useState, useEffect } from "react";
import axiosInstance from "../../Login/axiosConfig";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import constant from "../../../constant/constant";
import "./AddVehicle.css";

const VEHICLE_DATA = {
  Car: {
    "Maruti Suzuki": ["Alto", "Swift", "Baleno", "Dzire", "Ertiga", "Brezza", "Grand Vitara", "Fronx"],
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
    Audi: ["A4", "A6", "Q3"]
  },
  Truck: {
    Tata: ["Ultra", "Signa", "Prima"],
    "Ashok Leyland": ["Boss", "U Truck", "Captain"]
  },
  Bike: {
    Bajaj: ["Pulsar", "Dominar"],
    Hero: ["Splendor", "Glamour"],
    TVS: ["Apache", "Ntorq"],
    "Royal Enfield": ["Classic 350", "Meteor 350"]
  },
  Bus: {
    Tata: ["Starbus", "Cityride"],
    "Ashok Leyland": ["Viking", "Cheetah"]
  }
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


  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });

  useEffect(() => {
    if (vehicle.type && VEHICLE_DATA[vehicle.type]) {
      setManufacturers(Object.keys(VEHICLE_DATA[vehicle.type]));
    } else {
      setManufacturers([]);
    }
    setVehicle(prev => ({ ...prev, manufacturer: "", model: "" }));
    setModels([]);
  }, [vehicle.type]);

  useEffect(() => {
    if (vehicle.type && vehicle.manufacturer && VEHICLE_DATA[vehicle.type][vehicle.manufacturer]) {
      setModels(VEHICLE_DATA[vehicle.type][vehicle.manufacturer]);
    } else {
      setModels([]);
    }
    setVehicle(prev => ({ ...prev, model: "" }));
  }, [vehicle.manufacturer, vehicle.type]);

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

    const required = ["type", "registrationNumber", "manufacturer", "model", "makeYear", "fuelType", "runningKM", "servicePeriodYears", "servicePeriodKM"];
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

  const getValidationClass = (value) => value ? "is-valid" : "is-invalid";

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
                  <select name="type" className={`form-select ${getValidationClass(vehicle.type)}`} value={vehicle.type} onChange={handleChange}>
                    <option value="">Select Type</option>
                    <option>Car</option>
                    <option>Bus</option>
                    <option>Truck</option>
                    <option>Bike</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Registration Number</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-hash"></i></span>
                  <input name="registrationNumber" className={`form-control ${getValidationClass(vehicle.registrationNumber)}`} onChange={handleChange} />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Manufacturer</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-building"></i></span>
                  <select name="manufacturer" className={`form-select ${getValidationClass(vehicle.manufacturer)}`} value={vehicle.manufacturer} onChange={handleChange}>
                    <option value="">Select Manufacturer</option>
                    {manufacturers.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Model</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-car-front-fill"></i></span>
                  <select name="model" className={`form-select ${getValidationClass(vehicle.model)}`} value={vehicle.model} onChange={handleChange}>
                    <option value="">Select Model</option>
                    {models.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Make Year</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-calendar3"></i></span>
                  <input name="makeYear" type="number" className={`form-control ${getValidationClass(vehicle.makeYear)}`} onChange={handleChange} min="1950" max={(new Date()).getFullYear()} />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Fuel Type</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-fuel-pump"></i></span>
                  <select name="fuelType" className={`form-select ${getValidationClass(vehicle.fuelType)}`} onChange={handleChange}>
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
              </div>

              <div className="col-md-6">
                <label className="form-label">Running KM</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-speedometer"></i></span>
                  <input name="runningKM" type="number" className={`form-control ${getValidationClass(vehicle.runningKM)}`} onChange={handleChange} min="0" />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Service Period (Years)</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-clock-history"></i></span>
                  <input name="servicePeriodYears" type="number" className={`form-control ${getValidationClass(vehicle.servicePeriodYears)}`} onChange={handleChange} min="0" />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Service Period (KM)</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-geo-alt"></i></span>
                  <input name="servicePeriodKM" type="number" className={`form-control ${getValidationClass(vehicle.servicePeriodKM)}`} onChange={handleChange} min="0" />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Chassis Number (optional)</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-gear"></i></span>
                  <input name="chassisNumber" className="form-control" onChange={handleChange} />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Engine Number (optional)</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-tools"></i></span>
                  <input name="engineNumber" className="form-control" onChange={handleChange} />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Image (optional)</label>
                <input type="file" accept="image/*" className="form-control" onChange={handleFile} />
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="isNew" name="isNew" checked={vehicle.isNew} onChange={handleChange} />
                  <label className="form-check-label" htmlFor="isNew">
                    This is a new vehicle (disable last service)
                  </label>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Last Service Date</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-calendar-event"></i></span>
                  <input name="lastServiceDate" type="date" className="form-control" onChange={handleChange} disabled={vehicle.isNew} />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Last Service KM</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-tachometer"></i></span>
                  <input name="lastServiceKM" type="number" className="form-control" onChange={handleChange} disabled={vehicle.isNew} min="0" />
                </div>
              </div>
            </div>

            <div className="mt-4 d-flex gap-3">
              <button type="submit" className="btn btn-modern" disabled={submitting}>
                {submitting ? "Saving..." : "Add Vehicle"}
              </button>
              <button type="button" className="btn btn-secondary-modern" onClick={() => navigate("/dashboard")}>
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
