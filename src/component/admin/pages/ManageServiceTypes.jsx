import React, { useState } from "react";

const ManageServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [newService, setNewService] = useState("");

  const addServiceType = () => {
    if (!newService.trim()) return;
    setServiceTypes([...serviceTypes, newService]);
    setNewService("");
  };

  return (
    <div className="p-3">
      <h5>Manage Service Types</h5>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter Service Type (e.g., Periodic, Breakdown)"
        value={newService}
        onChange={(e) => setNewService(e.target.value)}
      />
      <button className="btn btn-primary btn-sm" onClick={addServiceType}>
        Add Service Type
      </button>

      <ul className="mt-3">
        {serviceTypes.map((type, i) => (
          <li key={i}>{type}</li>
        ))}
      </ul>
    </div>
  );
};

export default ManageServiceTypes;
