import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./component/Dashboard/home/Dashboard";
import ForgotPassword from "./component/ForgotPassword/ForgotPassword";
import Login from "./component/Login/Login";
import Registration from "./component/Registration/registration"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/registration" element={<Registration />} /> 
    </Routes>
  );
}

export default App;
