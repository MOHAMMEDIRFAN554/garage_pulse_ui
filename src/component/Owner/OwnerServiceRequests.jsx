import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../Login/axiosConfig";
import constant from "../../constant/constant";
import { useNavigate } from "react-router-dom";

function OwnerServiceRequests() {
  const [rows, setRows] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const prevCount = useRef(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2500);
  };

  const load = async (silent = false) => {
    try {
      const r = await axiosInstance.get(constant.SERVICE_REQUEST_LIST_OWNER);
      const list = r.data.rows || [];
      setRows(list);
      if (!silent && prevCount.current && list.length > prevCount.current) {
        showToast("New service request received", "info");
      }
      prevCount.current = list.length;
    } catch (e) {
      if (!silent) showToast("Failed to load requests", "danger");
      console.error("OwnerServiceRequests load error:", e);
    }
  };

  useEffect(() => {
    load(true);
    const onSvcUpdate = () => load(true);
    window.addEventListener("serviceUpdate", onSvcUpdate);
    timerRef.current = setInterval(() => load(true), 5000);
    return () => {
      clearInterval(timerRef.current);
      window.removeEventListener("serviceUpdate", onSvcUpdate);
    };
  }, []);

  const update = async (id, status) => {
    try {
      const res = await axiosInstance.patch(constant.SERVICE_REQUEST_UPDATE_STATUS(id), { status });
      if (status === "APPROVED") {
        showToast("Request approved and moved to Service List", "success");
        navigate("/serviceList");
      } else if (status === "REJECTED") {
        showToast("Request rejected and removed", "danger");
      }
      await load();
    } catch (e) {
      const errMsg = e.response?.data?.error || "Failed to update status";
      console.error("OwnerServiceRequests update error:", errMsg);
      showToast(errMsg, "danger");
    }
  };

  // status formatter: if manager completed, show COMPLETED; else show owner approval state
  const displayStatus = (r) => {
    const ms = (r.managerStatus || "").toUpperCase();
    if (ms === "COMPLETED") return { text: "COMPLETED", cls: "bg-success" };
    if (ms === "IN PROGRESS" || ms === "ACCEPTED" || ms === "REQUESTED")
      return { text: ms, cls: ms === "IN PROGRESS" ? "bg-warning" : "bg-info" };
    // fallback to owner approval status
    const os = (r.status || "").toUpperCase();
    if (os === "APPROVED") return { text: "APPROVED", cls: "bg-success" };
    if (os === "PENDING") return { text: "PENDING", cls: "bg-secondary" };
    return { text: "REJECTED", cls: "bg-danger" };
  };

  return (
    <div className="container py-4">
      <h4 className="mb-3">Service Requests</h4>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Vehicle</th>
                <th>Employee</th>
                <th>Type</th>
                <th>Narration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isPending = r.status === "PENDING";
                const ds = displayStatus(r);
                return (
                  <tr key={r._id}>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                    <td>
                      {r.vehicleId?.manufacturer} {r.vehicleId?.model} ({r.vehicleId?.registrationNumber})
                    </td>
                    <td>{r.employeeId?.name} ({r.employeeId?.role || "Owner"})</td>
                    <td>{r.serviceType}</td>
                    <td>{r.narration}</td>
                    <td>
                      <span className={`badge ${ds.cls}`}>{ds.text}</span>
                    </td>
                    <td className="d-flex gap-2">
                      {isPending ? (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => update(r._id, "APPROVED")}>
                            Approve
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => update(r._id, "REJECTED")}>
                            Reject
                          </button>
                        </>
                      ) : (
                        <button className="btn btn-sm btn-outline-secondary" disabled>
                          No Action
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
              onClick={() => setToast({ show: false, message: "", type: "success" })}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
}
export default OwnerServiceRequests;
