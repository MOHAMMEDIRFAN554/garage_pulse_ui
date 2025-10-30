import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./component/Login/authContext";
import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicRoute from "./Routes/PublicRoute";

// 🔹 Public pages
import Landing from "./component/landing/Landing";
import Registration from "./component/Registration/registration";
import Login from "./component/Login/Login";
import ForgotPassword from "./component/ForgotPassword/ForgotPassword";
import NotFound from "./component/NotFoundPage/NotFound";

// 🔹 Dashboard and vehicle-related pages
import Home from "./component/Dashboard/home/home";
import Dashboard from "./component/Dashboard/home/Dashboard";
import AddVehicle from "./component/Dashboard/screen/addVehicle";
import VehicleDetails from "./component/Dashboard/screen/VehicleDetails";
import DeleteVehicle from "./component/Dashboard/screen/deleteVehicle";

// 🔹 Service pages
import ServiceList from "./component/Service/serviceList";
import ServiceForm from "./component/Service/serviceForm";

// 🔹 Employee pages
import AddEmployee from "./component/Employee/AddEmployee";
import EmployeList from "./component/Employee/EmployeList";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Redirect root to landing */}
          <Route path="/" element={<Navigate to="/landing" replace />} />

          {/* Public routes */}
          <Route
            path="/landing"
            element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/registration"
            element={
              <PublicRoute>
                <Registration />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addVehicle"
            element={
              <ProtectedRoute>
                <AddVehicle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicle/:id"
            element={
              <ProtectedRoute>
                <VehicleDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deleteVehicle"
            element={
              <ProtectedRoute>
                <DeleteVehicle />
              </ProtectedRoute>
            }
          />

          {/* Service management */}
          <Route
            path="/serviceList"
            element={
              <ProtectedRoute>
                <ServiceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/serviceForm"
            element={
              <ProtectedRoute>
                <ServiceForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editService/:id"
            element={
              <ProtectedRoute>
                <ServiceForm />
              </ProtectedRoute>
            }
          />

          {/* Employee management */}
          <Route
            path="/addEmployee"
            element={
              <ProtectedRoute>
                <AddEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/EmployeList"
            element={
              <ProtectedRoute>
                <EmployeList />
              </ProtectedRoute>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
