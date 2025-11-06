import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import constant from "../../../constant/constant";

const ManageFuelTypes = () => {
  const [fuelTypes, setFuelTypes] = useState([]);
  const [newFuel, setNewFuel] = useState("");

  useEffect(() => {
    loadFuelTypes();
  }, []);

  const loadFuelTypes = async () => {
    try {
      const res = await axiosInstance.get(constant.GET_ALL_FUEL_TYPES);
      setFuelTypes(res.data.fuelTypes || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addFuelType = async () => {
    const fuelName = (newFuel || "").trim().toUpperCase();
    if (!fuelName) return;

    try {
      await axiosInstance.post(constant.CREATE_FUEL_TYPE, { name: fuelName });
      setFuelTypes((prev) => (prev.includes(fuelName) ? prev : [...prev, fuelName]));
      setNewFuel("");
      alert("Fuel type added successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add fuel type");
    }
  };

  return (
    <div className="p-3">
      <h5>Manage Fuel Types</h5>

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
    </div>
  );
};

export default ManageFuelTypes;
