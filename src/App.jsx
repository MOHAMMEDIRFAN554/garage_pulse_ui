import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./component/Login/authContext";
import ProtectedRoute from "./Routes/ProtectedRoute";
import PublicRoute from "./Routes/PublicRoute";

import Landing from "./component/landing/Landing";
import Registration from "./component/Registration/registration";
import Login from "./component/Login/Login";
import Home from "./component/Dashboard/home/home";
import Dashboard from "./component/Dashboard/home/Dashboard";
import ForgotPassword from "./component/ForgotPassword/ForgotPassword";
import NotFound from "./component/NotFoundPage/NotFound";
import AddVehicle from "./component/Dashboard/screen/addVehicle";
import VehicleDetails from "./component/Dashboard/screen/VehicleDetails";
import ServiceList from "./component/Service/serviceList";
import ServiceForm from "./component/Service/serviceForm";
import AddEmployee from "./component/Employee/Addemployee";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
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
            path="/ServiceList"
            element={
              <ProtectedRoute>
                <ServiceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ServiceForm"
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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AddEmployee"
            element={
              <ProtectedRoute>
                <AddEmployee />
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
