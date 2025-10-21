import React from "react";
import { Routes, Route } from "react-router-dom";

import Landing from './component/landing/Landing';
import Registration from './component/Registration/registration';
import Login from './component/Login/Login';
import Home from './component/Dashboard/home/home';
import Dashboard from "./component/Dashboard/home/Dashboard";
import ForgotPassword from "./component/ForgotPassword/ForgotPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
