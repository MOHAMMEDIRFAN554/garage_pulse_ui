import React, { useEffect, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import constant from "../../../constant/constant";

const ManageServiceTypes = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [newService, setNewService] = useState("");

  useEffect(() => {
    loadServiceTypes();
  }, []);

  const loadServiceTypes = async () => {
    try {
      const res = await axiosInstance.get(constant.GET_ALL_SERVICE_TYPES);
      setServiceTypes(res.data.serviceTypes || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addServiceType = async () => {
    const name = (newService || "").trim().toUpperCase();
    if (!name) return;
    try {
      await axiosInstance.post(constant.CREATE_SERVICE_TYPE, { name });
      setServiceTypes((prev) =>
        prev.includes(name) ? prev : [...prev, name]
      );
      setNewService("");
      alert("Service type added successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add service type");
    }
  };

  return (
    <div className="p-3">
      <h5>Manage Service Types</h5>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter Service Type (e.g., PERIODIC, BREAKDOWN)"
        value={newService}
        onChange={(e) => setNewService(e.target.value.toUpperCase())}
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
