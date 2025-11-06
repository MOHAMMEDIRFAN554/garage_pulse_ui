import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import constant from "../../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";

const ManageFuelTypes = () => {
  const [fuelTypes, setFuelTypes] = useState([]);
  const [newFuel, setNewFuel] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  useEffect(() => {
    loadFuelTypes();
  }, []);

  const loadFuelTypes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(constant.GET_ALL_FUEL_TYPES);
      setFuelTypes(res.data.fuelTypes || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to load fuel types", "danger");
    } finally {
      setLoading(false);
    }
  };

  const addFuelType = async () => {
    const fuelName = (newFuel || "").trim().toUpperCase();
    if (!fuelName) return;

    try {
      setLoading(true);
      await axiosInstance.post(constant.CREATE_FUEL_TYPE, { name: fuelName });
      setFuelTypes((prev) =>
        prev.includes(fuelName) ? prev : [...prev, fuelName]
      );
      setNewFuel("");
      showToast("Fuel type added successfully!", "success");
    } catch (err) {
      showToast(
        err.response?.data?.error || "Failed to add fuel type",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 position-relative">
      <h5>Manage Fuel Types</h5>

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
        placeholder="Enter Fuel Type (e.g., PETROL, DIESEL, CNG, EV)"
        value={newFuel}
        onChange={(e) => setNewFuel(e.target.value.toUpperCase())}
      />

      <button className="btn btn-primary btn-sm" onClick={addFuelType}>
        Add Fuel Type
      </button>

      <ul className="mt-3">
        {fuelTypes.map((fuel, i) => (
          <li key={i}>{fuel}</li>
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
              onClick={() =>
                setToast({ show: false, message: "", type: "success" })
              }
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFuelTypes;
