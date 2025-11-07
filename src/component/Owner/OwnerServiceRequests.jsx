import React, { useEffect, useState } from "react";
import axiosInstance from "../Login/axiosConfig";
import constant from "../../constant/constant";

function OwnerServiceRequests() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    const r = await axiosInstance.get(constant.SERVICE_REQUEST_LIST_OWNER);
    setRows(r.data.rows || []);
  };
  useEffect(()=>{ load(); }, []);

  const update = async (id, status) => {
    await axiosInstance.patch(constant.SERVICE_REQUEST_UPDATE_STATUS(id), { status });
    await load();
  };

  return (
    <div className="container py-4">
      <h4 className="mb-3">Service Requests</h4>
      <div >
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead><tr>
                <th>Date</th><th>Vehicle</th><th>Employee</th><th>Type</th><th>Narration</th><th>Status</th><th>Action</th>
              </tr></thead>
              <tbody>
                {rows.map(r=>(
                  <tr key={r._id}>
                    <td>{new Date(r.createdAt).toLocaleString()}</td>
                    <td>{r.vehicleId?.manufacturer} {r.vehicleId?.model} ({r.vehicleId?.registrationNumber})</td>
                    <td>{r.employeeId?.name} ({r.employeeId?.role})</td>
                    <td>{r.serviceType}</td>
                    <td>{r.narration}</td>
                    <td><span className="badge bg-secondary">{r.status}</span></td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-sm btn-success" onClick={()=>update(r._id,"APPROVED")}>Approve</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>update(r._id,"REJECTED")}>Reject</button>
                    </td>
                  </tr>
                ))}
                {!rows.length && <tr><td colSpan="7" className="text-center text-muted">No requests</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OwnerServiceRequests;
