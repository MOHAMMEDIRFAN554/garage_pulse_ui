import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../Login/axiosConfig";
import constant from "../../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../Login/authContext";

const STAGES = ["REQUESTED", "ACCEPTED", "IN PROGRESS", "COMPLETED"];
const pct = (stage) => {
  const i = Math.max(0, STAGES.indexOf(stage));
  return Math.round((i / (STAGES.length - 1)) * 100);
};

const ServiceHome = () => {
  const { logout } = useAuth();
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("REQUESTED");
  const [mechanics, setMechanics] = useState([]);
  const [active, setActive] = useState(null);
  const [working, setWorking] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeData, setCompleteData] = useState({
    serviceId: null,
    nextServiceKM: "",
    nextServiceDate: ""
  });

  const [toast, setToast] = useState({ show: false, type: "success", message: "" });
  const showToast = (message, type = "success") => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "success", message: "" }), 2500);
  };

  const load = async () => {
    try {
      const [r, m] = await Promise.all([
        axiosInstance.get(constant.SERVICE_MANAGER_REQUESTS),
        axiosInstance.get(constant.SERVICE_MANAGER_MECHANICS),
      ]);
      setRows(r.data.requests || []);
      setMechanics(m.data.mechanics || []);
    } catch (err) {
      console.error("ServiceHome load error:", err);
      showToast("Failed to load data", "danger");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const validStages = ["REQUESTED", "ACCEPTED", "IN PROGRESS", "COMPLETED"];
    const validServices = rows.filter((x) => validStages.includes(x.managerStatus));
    return validServices.filter((x) => (x.managerStatus || "REQUESTED") === tab);
  }, [rows, tab]);

  const assignMechanic = async (serviceId, mechanicId) => {
    try {
      setWorking(true);
      await axiosInstance.post(constant.SERVICE_MANAGER_ASSIGN, {
        serviceId,
        mechanicId,
      });
      await load();
      showToast("Mechanic assigned & moved to IN PROGRESS", "success");
    } catch (e) {
      showToast(e.response?.data?.error || "Failed to assign", "danger");
    } finally {
      setWorking(false);
    }
  };

  const startEdit = (svc) => {
    setActive({
      _id: svc._id,
      expenses: (svc.expenses || []).map((x) => ({
        name: x.name,
        amount: x.amount,
      })),
    });
  };

  const changeExpense = (idx, key, val) => {
    setActive((prev) => {
      const cp = { ...prev, expenses: [...prev.expenses] };
      if (key === "amount") {
        cp.expenses[idx][key] = Number(val || 0);
      } else {
        cp.expenses[idx][key] = val;
      }
      return cp;
    });
  };

  const addRow = () =>
    setActive((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { name: "", amount: 0 }],
    }));
  const removeRow = (idx) =>
    setActive((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((_, i) => i !== idx),
    }));

  const total = useMemo(
    () =>
      (active?.expenses || []).reduce(
        (s, e) => s + Number(e.amount || 0),
        0
      ),
    [active]
  );

  const saveExpenses = async () => {
    try {
      setWorking(true);
      await axiosInstance.patch(`${constant.SERVICE_MANAGER_EXPENSE}/${active._id}`, {
        expenses: active.expenses,
      });
      await load();

      window.dispatchEvent(new CustomEvent("serviceUpdate", {
        detail: { type: "expenses", id: active._id }
      }));

      showToast("Expenses saved", "success");
    } catch (e) {
      showToast(e.response?.data?.error || "Failed to save expenses", "danger");
    } finally {
      setWorking(false);
    }
  };

  const setStatus = async (id, managerStatus) => {
    try {
      setWorking(true);
      await axiosInstance.patch(constant.SERVICE_MANAGER_UPDATE_STATUS(id), {
        managerStatus,
      });
      await load();

      window.dispatchEvent(new CustomEvent("serviceUpdate", {
        detail: { type: "status", id, status: managerStatus }
      }));

      showToast(`Status updated to ${managerStatus}`, "success");
    } catch (e) {
      showToast(e.response?.data?.error || "Failed to update status", "danger");
    } finally {
      setWorking(false);
    }
  };

  const openCompleteModal = (svc) => {
    setCompleteData({
      serviceId: svc._id,
      nextServiceKM: "",
      nextServiceDate: ""
    });
    setShowCompleteModal(true);
  };

  const handleComplete = async () => {
    const { serviceId, nextServiceKM, nextServiceDate } = completeData;
    
    if (!nextServiceKM || !nextServiceDate) {
      showToast("Next service details are required", "danger");
      return;
    }

    try {
      setWorking(true);
      await axiosInstance.patch(constant.SERVICE_MANAGER_COMPLETE(serviceId), {
        nextServiceKM,
        nextServiceDate,
      });
      await load();
      setActive(null);
      setShowCompleteModal(false);
      showToast("Service marked completed", "success");
    } catch (e) {
      showToast(e.response?.data?.error || "Failed to complete service", "danger");
    } finally {
      setWorking(false);
    }
  };

  const updateCompleteData = (field, value) => {
    setCompleteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container py-4 position-relative">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Service Manager Dashboard</h4>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setShowPassModal(true)}
          >
            Change Password
          </button>
          <button className="btn btn-danger btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        {STAGES.map((s) => (
          <li className="nav-item" key={s}>
            <button
              className={`nav-link ${tab === s ? "active" : ""}`}
              onClick={() => setTab(s)}
            >
              {s}
            </button>
          </li>
        ))}
      </ul>

      {/* Table */}
      <div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Vehicle</th>
                  <th>Service Type</th>
                  <th>Requested By</th>
                  <th>Mechanic</th>
                  <th style={{ width: 240 }}>Progress</th>
                  <th style={{ width: 280 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((svc) => {
                  const prog = pct(svc.managerStatus || "REQUESTED");
                  return (
                    <tr
                      key={svc._id}
                      className={active?._id === svc._id ? "table-primary" : ""}
                    >
                      <td>
                        {svc.vehicleId?.manufacturer} {svc.vehicleId?.model} (
                        {svc.vehicleId?.registrationNumber})
                      </td>
                      <td>{svc.serviceType}</td>
                      <td>
                        {svc.employeeId?.name} ({svc.employeeId?.role || "Owner"})
                      </td>
                      <td>
                        <div className="d-flex gap-2 align-items-center">
                          <span>{svc.assignedMechanic?.name || "-"}</span>
                          {tab !== "COMPLETED" && (
                            <select
                              className="form-select form-select-sm"
                              style={{ maxWidth: 180 }}
                              onChange={(e) =>
                                e.target.value &&
                                assignMechanic(svc._id, e.target.value)
                              }
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Assign Mechanic
                              </option>
                              {mechanics.map((m) => (
                                <option key={m._id} value={m._id}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                      <td style={{ minWidth: 240 }}>
                        <div className="progress" style={{ height: 10 }}>
                          <div
                            className={`progress-bar ${
                              prog < 50
                                ? "bg-warning"
                                : prog < 100
                                ? "bg-info"
                                : "bg-success"
                            }`}
                            role="progressbar"
                            style={{ width: `${prog}%` }}
                            aria-valuenow={prog}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <small className="text-muted">
                          {svc.managerStatus || "REQUESTED"}
                        </small>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          {tab === "REQUESTED" && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => setStatus(svc._id, "ACCEPTED")}
                            >
                              Accept
                            </button>
                          )}
                          {tab !== "COMPLETED" && (
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => startEdit(svc)}
                            >
                              Expenses
                            </button>
                          )}
                          {tab === "ACCEPTED" && (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setStatus(svc._id, "IN PROGRESS")}
                            >
                              Start
                            </button>
                          )}
                          {tab === "IN PROGRESS" && (
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => openCompleteModal(svc)}
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!filtered.length && (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">
                      No records
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      {active && (
        <div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="m-0">Service Expenses</h6>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setActive(null)}
                >
                  Close
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={saveExpenses}
                  disabled={working}
                >
                  Save
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "55%" }}>Item</th>
                    <th style={{ width: "25%" }}>Amount</th>
                    <th style={{ width: "20%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {(active.expenses || []).map((r, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={r.name}
                          onChange={(e) =>
                            changeExpense(i, "name", e.target.value)
                          }
                          placeholder="e.g., Engine Oil"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={r.amount}
                          onChange={(e) =>
                            changeExpense(i, "amount", e.target.value)
                          }
                          min="0"
                        />
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeRow(i)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={addRow}
              >
                + Add Row
              </button>
              <div className="badge bg-light text-dark p-2">
                Total Expenses: <b>₹ {Number(total || 0).toFixed(2)}</b>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Service Modal */}
      {showCompleteModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Complete Service</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCompleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Next Service KM</label>
                  <input
                    type="number"
                    className="form-control"
                    value={completeData.nextServiceKM}
                    onChange={(e) => updateCompleteData("nextServiceKM", e.target.value)}
                    placeholder="Enter next service KM"
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Next Service Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={completeData.nextServiceDate}
                    onChange={(e) => updateCompleteData("nextServiceDate", e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCompleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleComplete}
                  disabled={working}
                >
                  {working ? "Completing..." : "Complete Service"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPassModal && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPassModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="password"
                  id="oldPass"
                  className="form-control mb-2"
                  placeholder="Old Password"
                />
                <input
                  type="password"
                  id="newPass"
                  className="form-control"
                  placeholder="New Password"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPassModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    const oldPassword = document.getElementById("oldPass").value;
                    const newPassword = document.getElementById("newPass").value;
                    if (!oldPassword || !newPassword)
                      return alert("Please fill both fields");

                    try {
                      await axiosInstance.patch(
                        constant.SERVICE_MANAGER_CHANGE_PASSWORD,
                        { oldPassword, newPassword }
                      );
                      showToast("Password changed successfully", "success");
                      setShowPassModal(false);
                    } catch (e) {
                      showToast(
                        e.response?.data?.error || "Failed to change password",
                        "danger"
                      );
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
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
                setToast({ show: false, type: "success", message: "" })
              }
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceHome;