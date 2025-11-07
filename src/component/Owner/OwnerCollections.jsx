import React, { useEffect, useState } from "react";
import axiosInstance from "../Login/axiosConfig";
import constant from "../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function OwnerCollections() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filter, setFilter] = useState({
    vehicleId: "",
    range: "daily",
    from: "",
    to: "",
  });
  const [rows, setRows] = useState([]);
  const [totals, setTotals] = useState({
    totalCollection: 0,
    expenses: 0,
    finalCollection: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const v = await axiosInstance.get(constant.GETALLVEHICLE);
        setVehicles(v.data.vehicles || []);
        await search();
      } catch (err) {
        console.error("Load error:", err);
      }
    };
    load();
  }, []);

  const search = async () => {
    try {
      const params = {};
      if (filter.vehicleId) params.vehicleId = filter.vehicleId;
      if (filter.from && filter.to) {
        params.from = filter.from;
        params.to = filter.to;
      } else if (filter.range) {
        params.range = filter.range;
      }

      const r = await axiosInstance.get(constant.COLLECTION_LIST, { params });
      setRows(r.data.rows || []);
      setTotals(
        r.data.totals || { totalCollection: 0, expenses: 0, finalCollection: 0 }
      );
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const exportCSV = () => {
    if (!rows.length) return alert("No data to export");
    const headers = [
      "Date",
      "Vehicle",
      "Employee",
      "Total",
      "Expenses",
      "Final",
      "Note",
    ];
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        [
          new Date(r.date).toLocaleDateString(),
          `${r.vehicleId?.manufacturer} ${r.vehicleId?.model} (${r.vehicleId?.registrationNumber})`,
          `${r.employeeId?.name} (${r.employeeId?.role})`,
          r.totalCollection,
          (r.expenses || []).reduce((s, e) => s + e.amount, 0),
          r.finalCollection,
          r.note || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "collections_report.csv";
    link.click();
  };

  const chartData = rows.map((r) => ({
    date: new Date(r.date).toLocaleDateString(),
    total: r.totalCollection,
    expenses: (r.expenses || []).reduce((s, e) => s + e.amount, 0),
    final: r.finalCollection,
  }));

  return (
    <div className="container py-4">
      {/* Header with Back Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Collections Report</h4>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate("/home")}
        >
          ⬅️ Back to Home
        </button>
      </div>

      <div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Vehicle</label>
              <select
                className="form-select"
                value={filter.vehicleId}
                onChange={(e) =>
                  setFilter({ ...filter, vehicleId: e.target.value })
                }
              >
                <option value="">All Vehicles</option>
                {(vehicles || []).map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.manufacturer} {v.model} ({v.registrationNumber})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Quick Range</label>
              <select
                className="form-select"
                value={filter.range}
                onChange={(e) =>
                  setFilter({ ...filter, range: e.target.value })
                }
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">From</label>
              <input
                type="date"
                className="form-control"
                value={filter.from}
                onChange={(e) => setFilter({ ...filter, from: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">To</label>
              <input
                type="date"
                className="form-control"
                value={filter.to}
                onChange={(e) => setFilter({ ...filter, to: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-3 d-flex gap-2">
            <button className="btn btn-primary" onClick={search}>
              Search
            </button>
            <button className="btn btn-outline-success" onClick={exportCSV}>
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Totals Section */}
      <div>
        <div className="card-body">
          <div className="d-flex gap-3 flex-wrap">
            <div className="badge bg-light text-dark p-3">
              Total: <b>{totals.totalCollection}</b>
            </div>
            <div className="badge bg-light text-dark p-3">
              Expenses: <b>{totals.expenses}</b>
            </div>
            <div className="badge bg-success p-3">
              Final: <b>{totals.finalCollection}</b>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div>
        <div className="card-body" style={{ height: "350px" }}>
          <h6>Collection vs Expenses</h6>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#0d6efd" name="Total Collection" />
              <Bar dataKey="expenses" fill="#dc3545" name="Expenses" />
              <Bar dataKey="final" fill="#198754" name="Final Collection" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div>
        <div className="card-body table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Vehicle</th>
                <th>Employee</th>
                <th>Total</th>
                <th>Expenses</th>
                <th>Final</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id}>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>
                    {r.vehicleId?.manufacturer} {r.vehicleId?.model} (
                    {r.vehicleId?.registrationNumber})
                  </td>
                  <td>
                    {r.employeeId?.name} ({r.employeeId?.role})
                  </td>
                  <td>{r.totalCollection}</td>
                  <td>
                    {(r.expenses || []).reduce((s, e) => s + e.amount, 0)}
                  </td>
                  <td>{r.finalCollection}</td>
                  <td>{r.note}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OwnerCollections;
