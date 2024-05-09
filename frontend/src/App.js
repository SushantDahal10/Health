import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Signup from './components/signup';
import Login from './components/login';

import Dietplan from './components/dietplan';
import Home from './components/home';
import Fitness from './components/fitness';
import Health from './components/health';
import Location from './components/location';
import Update from './components/updateuser';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Signup />} /> 
        <Route path="/login" element={<Login />} /> 
        {/* <Route path="/dashboard" element={<Dashboard />} />  */}
        <Route path="/dashboard/diet" element={<Dietplan />} /> 
        <Route path="/dashboard/home" element={<Home />} /> 
        <Route path="/dashboard/fitness" element={<Fitness />} /> 
        <Route path="/dashboard/health" element={<Health/>} /> 
      
      </Routes>
    </Router>
  );
}

export default App;
