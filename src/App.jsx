import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./component/Login/Login";
import Home from "./component/Dashboard/home/home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
