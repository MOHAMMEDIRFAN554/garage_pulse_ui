import React, { useState, useEffect } from "react";
import axios from "axios";

const ServiceForm = ({ fetchServices, setFormVisible, editService }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost: "",
  });

  useEffect(() => {
    if (editService) {
      setFormData({
        name: editService.name,
        description: editService.description,
        cost: editService.cost,
      });
    }
  }, [editService]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editService) {
        await axios.put(
          `http://localhost:5000/api/services/updateService/${editService._id}`,
          formData
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/services/createService",
          formData
        );
      }
      fetchServices();
      setFormVisible(false);
    } catch (err) {
      console.error("Error saving service:", err);
    }
  };

  return (
    <div className="form-container">
      <h3>{editService ? "Edit Service" : "Add New Service"}</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Service Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={formData.cost}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn">
          {editService ? "Update Service" : "Add Service"}
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => setFormVisible(false)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ServiceForm;
