import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./component/Dashboard/home/Dashboard";
import ForgotPassword from "./component/ForgotPassword/ForgotPassword";
import Login from "./component/Login/Login";
import Registration from "./component/Registration/registration"; 
import { Routes, Route } from 'react-router-dom';
import Landing from './component/landing/Landing';
import Registration from './component/Registration/registration';
import Login from './component/Login/Login';
import Home from './component/Dashboard/home/home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/registration" element={<Registration />} /> 
      <Route path="/" element={<Landing />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
