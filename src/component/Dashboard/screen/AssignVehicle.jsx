import React, { useState, useEffect } from "react";
import axiosInstance from "../../Login/axiosConfig";
import constant from "../../../constant/constant";
import { Toast } from "bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AssignVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [employees, setEmployees] = useState([]);
  const [driver, setDriver] = useState("");
  const [coDriver, setCoDriver] = useState("");
  const [toast, setToast] = useState({ show: false, type: "success", msg: "" });
  const [assignedInfo, setAssignedInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
    fetchEmployees();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axiosInstance.get(constant.GETALLVEHICLE, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVehicles(res.data.vehicles || []);
    } catch (err) {
      showToast("danger", "Failed to fetch vehicles");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get(constant.GETALLEMPLOYEE, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEmployees(res.data.employees || []);
    } catch {
      showToast("danger", "Failed to fetch employees");
    }
  };

  const showToast = (type, msg) => {
    setToast({ show: true, type, msg });
    const toastEl = document.getElementById("liveToast");
    if (toastEl) new Toast(toastEl, { delay: 3000 }).show();
  };

  const handleVehicleSelect = async (e) => {
    const id = e.target.value;
    setSelectedVehicle(id);
    const vehicle = vehicles.find((v) => v._id === id);
    setVehicleType(vehicle?.type || "");
    try {
      const res = await axiosInstance.get(constant.ASSIGNMENT(id), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAssignedInfo(res.data.vehicle);
    } catch {
      setAssignedInfo(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle || !driver) {
      showToast("danger", "Select vehicle and driver");
      return;
    }

    try {
      await axiosInstance.post(
        constant.ASSIGN,
        { vehicleId: selectedVehicle, driverId: driver, coDriverId: coDriver },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      showToast("success", "Vehicle assigned successfully");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      showToast("danger", err.response?.data?.error || "Failed to assign vehicle");
    }
  };

  return (
    <div className="container py-4">
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div
          id="liveToast"
          className={`toast align-items-center text-bg-${toast.type} border-0 ${
            toast.show ? "show" : "hide"
          }`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.msg}</div>
          </div>
        </div>
      </div>

      <div >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Assign Vehicle to Employee</h4>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/dashboard")}
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Select Vehicle</label>
            <select
              className="form-select"
              onChange={handleVehicleSelect}
              value={selectedVehicle}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.manufacturer} {v.model} - {v.registrationNumber}
                </option>
              ))}
            </select>
          </div>

          {vehicleType && (
            <>
              <div className="mb-3">
                <label className="form-label">Assign Driver</label>
                <select
                  className="form-select"
                  value={driver}
                  onChange={(e) => setDriver(e.target.value)}
                >
                  <option value="">Select Driver</option>
                  {employees
                    .filter((emp) => emp.role === "DRIVER")
                    .map((emp) => (
                      <option
                        key={emp._id}
                        value={emp._id}
                        className={
                          assignedInfo?.assignedDriver?._id === emp._id
                            ? "bg-success text-white"
                            : ""
                        }
                      >
                        {emp.name} - {emp.phone}
                      </option>
                    ))}
                </select>
              </div>

              {["BUS", "TRUCK"].includes(vehicleType.toUpperCase()) && (
                <div className="mb-3">
                  <label className="form-label">Assign Co-Driver</label>
                  <select
                    className="form-select"
                    value={coDriver}
                    onChange={(e) => setCoDriver(e.target.value)}
                  >
                    <option value="">Select Co-Driver</option>
                    {employees
                      .filter((emp) => emp.role === "CO-DRIVER")
                      .map((emp) => (
                        <option
                          key={emp._id}
                          value={emp._id}
                          className={
                            assignedInfo?.assignedCoDriver?._id === emp._id
                              ? "bg-success text-white"
                              : ""
                          }
                        >
                          {emp.name} - {emp.phone}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </>
          )}

          <button type="submit" className="btn btn-modern mt-3">
            Save Assignment
          </button>
        </form>

        {assignedInfo && (
          <div className="mt-4 border-top pt-3">
            <h6>Current Assignment:</h6>
            <p>
              <strong>Vehicle:</strong> {assignedInfo.manufacturer}{" "}
              {assignedInfo.model}
            </p>
            <p>
              <strong>Driver:</strong>{" "}
              {assignedInfo.assignedDriver?.name || "None"}
            </p>
            <p>
              <strong>Co-Driver:</strong>{" "}
              {assignedInfo.assignedCoDriver?.name || "None"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignVehicle;
