import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../Login/axiosConfig";
import constant from "../../constant/constant";

function OwnerServiceRequests() {
  const [rows, setRows] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const prevCount = useRef(0);
  const timerRef = useRef(null);

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
    timerRef.current = setInterval(() => load(true), 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const update = async (id, status) => {
    try {
      await axiosInstance.patch(constant.SERVICE_REQUEST_UPDATE_STATUS(id), { status });
      await load();
      showToast(`Request ${status.toLowerCase()}`, status === "APPROVED" ? "success" : "secondary");
    } catch (e) {
      const errMsg = e.response?.data?.error || "Failed to update status";
      console.error("OwnerServiceRequests update error:", errMsg);
      showToast(errMsg, "danger");
    }
  };

  return (
    <div className="container py-4">
      <h4 className="mb-3">Service Requests</h4>
      <div>
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
                  const isOwnerRaised = r?.employeeId?.role === "OWNER";
                  const isPending = r.status === "PENDING";
                  return (
                    <tr key={r._id}>
                      <td>{new Date(r.createdAt).toLocaleString()}</td>
                      <td>
                        {r.vehicleId?.manufacturer} {r.vehicleId?.model} ({r.vehicleId?.registrationNumber})
                      </td>
                      <td>
                        {r.employeeId?.name} ({r.employeeId?.role})
                      </td>
                      <td>{r.serviceType}</td>
                      <td>{r.narration}</td>
                      <td>
                        <span
                          className={`badge ${r.status === "APPROVED" ? "bg-success" : r.status === "PENDING" ? "bg-secondary" : "bg-danger"
                            }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="d-flex gap-2">
                        {!isOwnerRaised && isPending && (
                          <>
                            <button className="btn btn-sm btn-success" onClick={() => update(r._id, "APPROVED")}>
                              Approve
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => update(r._id, "REJECTED")}>
                              Reject
                            </button>
                          </>
                        )}
                        {(isOwnerRaised || !isPending) && (
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
