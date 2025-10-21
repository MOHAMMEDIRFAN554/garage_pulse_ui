import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Registration from './component/Registration/registration';
import {Routes,Route} from "react-router-dom" 


function App() {
  

  return (
    <>
    <Routes>
      <Route path="/" element={<Registration />} />
      <Route path="/registration" element={<Registration/>} />
    </Routes>
    </>
    )
}

export default App;
