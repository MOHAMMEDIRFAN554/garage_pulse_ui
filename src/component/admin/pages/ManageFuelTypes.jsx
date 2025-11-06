import React, { useState } from "react";

const ManageFuelTypes = () => {
  const [fuelTypes, setFuelTypes] = useState(["Petrol", "Diesel", "CNG", "EV"]);
  const [newFuel, setNewFuel] = useState("");

  const addFuelType = () => {
    if (!newFuel.trim()) return;
    setFuelTypes([...fuelTypes, newFuel]);
    setNewFuel("");
  };

  return (
    <div className="p-3">
      <h5>Manage Fuel Types</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter Fuel Type"
        value={newFuel}
        onChange={(e) => setNewFuel(e.target.value)}
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
