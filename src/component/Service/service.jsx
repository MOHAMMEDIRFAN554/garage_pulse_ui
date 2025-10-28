import React, { useEffect, useState } from "react";
import axios from "axios";
import constant from "../../constant/constant"; 
import ServiceForm from "./ServiceForm";
import "./Service.css";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editService, setEditService] = useState(null);

  const fetchServices = async () => {
    try {
      const res = await axios.get(constant.GETALLSERVICE); 
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(constant.DELETESERVICE(id)); 
      fetchServices(); 
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  return (
    <div className="service-container">
      <h2>Vehicle Service Management</h2>
      <button
        className="btn"
        onClick={() => {
          setFormVisible(true);
          setEditService(null);
        }}
      >
        + Add New Service
      </button>

      {formVisible && (
        <ServiceForm
          fetchServices={fetchServices}
          setFormVisible={setFormVisible}
          editService={editService}
        />
      )}

      <table className="service-table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Description</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service._id}>
              <td>{service.name}</td>
              <td>{service.description}</td>
              <td>₹{service.cost}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditService(service);
                    setFormVisible(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(service._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceList;
