import { Routes, Route } from 'react-router-dom';
import Landing from './component/landing/Landing';
import Registration from './component/Registration/registration';
import Login from './component/Login/Login';
import Home from './component/Dashboard/home/home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
