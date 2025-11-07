import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./component/Login/authContext";

import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicRoute from "./Routes/PublicRoute";

//Public Components
import Landing from "./component/landing/Landing";
import Registration from "./component/Registration/registration";
import Login from "./component/Login/Login";
import ForgotPassword from "./component/ForgotPassword/ForgotPassword";
import NotFound from "./component/NotFoundPage/NotFound";

//Owner Components
import Home from "./component/Dashboard/home/home";
import Dashboard from "./component/Dashboard/home/Dashboard";
import AddVehicle from "./component/Dashboard/screen/addVehicle";
import VehicleDetails from "./component/Dashboard/screen/VehicleDetails";
import DeleteVehicle from "./component/Dashboard/screen/deleteVehicle";
import AssignVehicle from "./component/Dashboard/screen/AssignVehicle";

//Service Components
import ServiceList from "./component/Service/serviceList";
import ServiceForm from "./component/Service/serviceForm";

//Employee Components
import AddEmployee from "./component/Employee/Addemployee";
import EmployeList from "./component/Employee/EmployeList";
import DeleteEmployee from "./component/Employee/deleteEmployee";
import EditEmployee from "./component/Employee/EditEmployee";
import EmployeeHome from "./component/Employee/EmployeeHome";

//Insurance + Owner Specific
import AddInsurance from "./component/Insurance/addInsurance";
import OwnerServiceRequests from "./component/Owner/OwnerServiceRequests";
import OwnerCollections from "./component/Owner/OwnerCollections";

//Admin
import AdminDashboard from "./component/admin/AdminDashboard";


// ROUTES

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/landing" replace />} />

      {/* Public Routes */}
      <Route path="/landing" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/registration" element={<PublicRoute><Registration /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      {/* Protected Routes */}

      {/* Home (Owner Default) */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            {["driver", "co-driver"].includes((user?.role || "").toLowerCase()) ? (
              <Navigate to="/employeeHome" replace />
            ) : user?.role?.toLowerCase() === "admin" ? (
              <Navigate to="/AdminDashboard" replace />
            ) : (
              <Home />
            )}
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/AdminDashboard"
        element={
          <ProtectedRoute>
            {user?.role?.toLowerCase() === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/home" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Employee (Driver & Co-driver Shared Dashboard) */}
      <Route
        path="/employeeHome"
        element={
          <ProtectedRoute>
            {["driver", "co-driver"].includes((user?.role || "").toLowerCase()) ? (
              <EmployeeHome />
            ) : (
              <Navigate to="/home" replace />
            )}
          </ProtectedRoute>
        }
      />

      {/* Vehicle Management */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/addVehicle" element={<ProtectedRoute><AddVehicle /></ProtectedRoute>} />
      <Route path="/vehicle/:id" element={<ProtectedRoute><VehicleDetails /></ProtectedRoute>} />
      <Route path="/deleteVehicle" element={<ProtectedRoute><DeleteVehicle /></ProtectedRoute>} />
      <Route path="/assignVehicle" element={<ProtectedRoute><AssignVehicle /></ProtectedRoute>} />

      {/* Service Management */}
      <Route path="/serviceList" element={<ProtectedRoute><ServiceList /></ProtectedRoute>} />
      <Route path="/serviceForm" element={<ProtectedRoute><ServiceForm /></ProtectedRoute>} />
      <Route path="/editService/:id" element={<ProtectedRoute><ServiceForm /></ProtectedRoute>} />

      {/* Employee Management */}
      <Route path="/addEmployee" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
      <Route path="/EmployeList" element={<ProtectedRoute><EmployeList /></ProtectedRoute>} />
      <Route path="/DeleteEmployee" element={<ProtectedRoute><DeleteEmployee /></ProtectedRoute>} />
      <Route path="/editEmployee/:id" element={<ProtectedRoute><EditEmployee /></ProtectedRoute>} />

      {/* Insurance */}
      <Route path="/insurance" element={<ProtectedRoute><AddInsurance /></ProtectedRoute>} />

      {/* Owner Reports */}
      <Route path="/owner/service-requests" element={<ProtectedRoute><OwnerServiceRequests /></ProtectedRoute>} />
      <Route path="/owner/collections" element={<ProtectedRoute><OwnerCollections /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// =========================================================
// WRAPPER
// =========================================================

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
