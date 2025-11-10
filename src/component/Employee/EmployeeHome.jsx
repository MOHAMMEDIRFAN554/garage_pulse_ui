import React, { useEffect, useState } from "react";
import axiosInstance from "../Login/axiosConfig";
import constant from "../../constant/constant";
import "bootstrap/dist/css/bootstrap.min.css";

function EmployeeHome() {
  const [vehicle, setVehicle] = useState(null);
  const [tab, setTab] = useState("vehicle");
  const [km, setKm] = useState("");
  const [loading, setLoading] = useState(false);
  const [svcTypes, setSvcTypes] = useState([]);
  const [svcForm, setSvcForm] = useState({ serviceType: "", narration: "" });
  const [col, setCol] = useState({ totalCollection: "", note: "" });
  const [expenses, setExpenses] = useState([{ name: "", amount: "" }]);
  const [todayCollectionId, setTodayCollectionId] = useState(null);
  const [pwd, setPwd] = useState({ oldPassword: "", newPassword: "" });
  const [dailyTotal, setDailyTotal] = useState(0);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    const init = async () => {
      try {
        const v = await axiosInstance.get(constant.EMPLOYEE_ASSIGNED_VEHICLE);
        setVehicle(v.data.vehicle || null);
        setKm(v.data.vehicle?.runningKM || "");
        const res = await axiosInstance.get(constant.GET_ALL_SERVICE_TYPES);
        setSvcTypes(res.data.serviceTypes || []);
      } catch (err) {
        console.error("Load error:", err);
      }
    };
    init();
  }, []);

  // ✅ Filter strictly to logged-in employee’s collections only
  const loadTodayCollections = async () => {
    try {
      const r = await axiosInstance.get(constant.COLLECTION_LIST, {
        params: { range: "daily" },
      });
      const user = JSON.parse(localStorage.getItem("user"));
      const myEmail = user?.email?.toLowerCase();
      if (!myEmail) return;

      // only my collections, strictly filtered by backend and double-checked here
      const mine = (r.data.rows || []).filter(
        (x) => x.employeeId?.email?.toLowerCase() === myEmail
      );

      if (mine.length > 0) {
        const today = mine[0];
        const todayDate = new Date().toISOString().split("T")[0];
        const recordDate = new Date(today.date).toISOString().split("T")[0];

        if (recordDate !== todayDate) {
          clearTodayData();
          return;
        }

        setCol({
          totalCollection: today.totalCollection || "",
          note: today.note || "",
        });
        setExpenses(
          today.expenses?.length ? today.expenses : [{ name: "", amount: "" }]
        );
        setTodayCollectionId(today._id);
        setDailyTotal(today.finalCollection || 0);
        localStorage.setItem(
          "todayCollection",
          JSON.stringify({
            id: today._id,
            col: {
              totalCollection: today.totalCollection || "",
              note: today.note || "",
            },
            expenses: today.expenses,
            total: today.finalCollection || 0,
            date: todayDate,
            email: myEmail,
          })
        );
      } else {
        const saved = localStorage.getItem("todayCollection");
        if (saved) {
          const data = JSON.parse(saved);
          const todayDate = new Date().toISOString().split("T")[0];

          // Clear if mismatch by email or date
          if (data.date !== todayDate || data.email !== myEmail) {
            clearTodayData();
            return;
          }

          setTodayCollectionId(data.id || null);
          setCol(data.col || { totalCollection: "", note: "" });
          setExpenses(data.expenses || [{ name: "", amount: "" }]);
          setDailyTotal(data.total || 0);
        }
      }
    } catch (err) {
      console.error("Collection load error:", err);
    }
  };

  const clearTodayData = () => {
    setTodayCollectionId(null);
    setCol({ totalCollection: "", note: "" });
    setExpenses([{ name: "", amount: "" }]);
    setDailyTotal(0);
    localStorage.removeItem("todayCollection");
  };

  useEffect(() => {
    loadTodayCollections();
  }, []);

  const refreshToday = () => {
    const newDate = new Date().toISOString().split("T")[0];
    setCurrentDate(newDate);
    clearTodayData();
    loadTodayCollections();
  };

  const saveKM = async () => {
    if (!vehicle?._id) return alert("No vehicle assigned");
    setLoading(true);
    try {
      await axiosInstance.patch(
        constant.EMPLOYEE_UPDATE_RUNNING_KM(vehicle._id),
        {
          runningKM: Number(km),
        }
      );
      alert("Updated running KM");
    } catch (e) {
      alert(e.response?.data?.error || "Failed to update KM");
    } finally {
      setLoading(false);
    }
  };

  const addExpense = () => setExpenses([...expenses, { name: "", amount: "" }]);
  const updateExpense = (i, key, val) => {
    const cp = expenses.slice();
    cp[i][key] = val;
    setExpenses(cp);
  };
  const removeExpense = (i) => {
    const cp = expenses.slice();
    cp.splice(i, 1);
    setExpenses(cp.length ? cp : [{ name: "", amount: "" }]);
  };

  // ✅ Save collection only for current employee
  const saveCollection = async () => {
    if (!vehicle?._id) return alert("No vehicle assigned");
    const user = JSON.parse(localStorage.getItem("user"));
    const payload = {
      vehicleId: vehicle._id,
      date: new Date(),
      totalCollection: Number(col.totalCollection || 0),
      expenses: expenses.filter((e) => e.name && e.amount !== ""),
      note: col.note || "",
      employeeEmail: user?.email, // ✅ unique identifier
    };

    try {
      let response;
      if (todayCollectionId) {
        response = await axiosInstance.put(
          `${constant.COLLECTION_CREATE}/${todayCollectionId}`,
          payload
        );
        alert("Today's collection updated successfully");
      } else {
        response = await axiosInstance.post(constant.COLLECTION_CREATE, payload);
        alert("Today's collection saved");
      }

      const updated = response.data.collection || payload;
      const todayDate = new Date().toISOString().split("T")[0];
      const myEmail = user?.email?.toLowerCase();
      setTodayCollectionId(updated._id);
      setDailyTotal(
        Number(updated.totalCollection || 0) -
          (updated.expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0)
      );
      localStorage.setItem(
        "todayCollection",
        JSON.stringify({
          id: updated._id,
          col: {
            totalCollection: updated.totalCollection || "",
            note: updated.note || "",
          },
          expenses: updated.expenses || [],
          total:
            Number(updated.totalCollection || 0) -
            (updated.expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0),
          date: todayDate,
          email: myEmail,
        })
      );
    } catch (e) {
      alert(e.response?.data?.error || "Failed to save collection");
    }
  };

  const submitService = async () => {
    if (!vehicle?._id) return alert("No vehicle assigned");
    if (!svcForm.serviceType) return alert("Select service type");
    try {
      await axiosInstance.post(constant.SERVICE_REQUEST_CREATE, {
        vehicleId: vehicle._id,
        serviceType: svcForm.serviceType,
        narration: svcForm.narration || "",
      });
      alert("Service request submitted");
      setSvcForm({ serviceType: "", narration: "" });
    } catch (e) {
      alert(e.response?.data?.error || "Failed to submit");
    }
  };

  const changePassword = async () => {
    try {
      await axiosInstance.post(constant.EMPLOYEE_CHANGE_PASSWORD, pwd);
      alert("Password changed");
      setPwd({ oldPassword: "", newPassword: "" });
    } catch (e) {
      alert(e.response?.data?.error || "Failed to change password");
    }
  };

  const expensesTotal = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const finalCollection = (Number(col.totalCollection) || 0) - expensesTotal;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Employee Dashboard</h4>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div>
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-2">Assigned Vehicle</h5>
            {vehicle ? (
              <div>
                <div className="mb-1">
                  <b>
                    {vehicle.manufacturer} {vehicle.model}
                  </b>{" "}
                  ({vehicle.registrationNumber})
                </div>
                <div className="text-muted">
                  Year: {vehicle.makeYear} | Fuel: {vehicle.fuelType}
                </div>
              </div>
            ) : (
              <div className="text-muted">No vehicle assigned by owner.</div>
            )}
          </div>
          <div className="text-end">
            <h6 className="mb-1 text-success">Today's Collection</h6>
            <h4 className="mb-0">
              <b>₹{dailyTotal.toFixed(2)}</b>
            </h4>
          </div>
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "vehicle" ? "active" : ""}`}
            onClick={() => setTab("vehicle")}
          >
            Vehicle Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "collection" ? "active" : ""}`}
            onClick={() => setTab("collection")}
          >
            Collection Report
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "service" ? "active" : ""}`}
            onClick={() => setTab("service")}
          >
            Service Request
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "password" ? "active" : ""}`}
            onClick={() => setTab("password")}
          >
            Change Password
          </button>
        </li>
      </ul>

      {tab === "collection" && (
        <div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0">
                Current Date: <b>{currentDate}</b>
              </h6>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={refreshToday}
              >
                🔄 Refresh
              </button>
            </div>

            <h6 className="text-center mb-3">Today's Collection Entry</h6>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Total Collection (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={col.totalCollection}
                  onChange={(e) =>
                    setCol({ ...col, totalCollection: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Note</label>
                <input
                  className="form-control"
                  value={col.note}
                  onChange={(e) => setCol({ ...col, note: e.target.value })}
                />
              </div>
            </div>

            <hr />
            <div className="d-flex align-items-center mb-2">
              <h6 className="mb-0 me-2">Expenses</h6>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={addExpense}
              >
                + Add
              </button>
            </div>

            {expenses.map((e, i) => (
              <div className="row g-2 mb-2" key={i}>
                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Name"
                    value={e.name}
                    onChange={(ev) => updateExpense(i, "name", ev.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    value={e.amount}
                    onChange={(ev) => updateExpense(i, "amount", ev.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() => removeExpense(i)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-3">
              <div className="mb-1">
                Expenses Total: <b>{expensesTotal}</b>
              </div>
              <div className="mb-3">
                Final Collection: <b>{finalCollection}</b>
              </div>
              <button className="btn btn-success" onClick={saveCollection}>
                {todayCollectionId ? "Update Collection" : "Save Collection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "vehicle" && (
        <div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Final Running KM</label>
              <input
                type="number"
                className="form-control"
                value={km}
                onChange={(e) => setKm(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              disabled={loading}
              onClick={saveKM}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {tab === "service" && (
        <div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Service Type</label>
                <select
                  className="form-select"
                  value={svcForm.serviceType}
                  onChange={(e) =>
                    setSvcForm({ ...svcForm, serviceType: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  {Array.isArray(svcTypes) &&
                    svcTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Short Narration</label>
                <input
                  className="form-control"
                  value={svcForm.narration}
                  onChange={(e) =>
                    setSvcForm({ ...svcForm, narration: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-3">
              <button className="btn btn-primary" onClick={submitService}>
                Request Service
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "password" && (
        <div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Old Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={pwd.oldPassword}
                  onChange={(e) =>
                    setPwd({ ...pwd, oldPassword: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={pwd.newPassword}
                  onChange={(e) =>
                    setPwd({ ...pwd, newPassword: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-3">
              <button className="btn btn-warning" onClick={changePassword}>
                Save Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeHome;
