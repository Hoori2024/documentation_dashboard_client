import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './screens/Home/HomePage';
import { ProfilPage } from './screens/Profil/profil';
import Settings from './screens/Settings/SettingsPage';
import Navbar from './components/headers/Headers';
import jwtDecode, { JwtPayload } from "jwt-decode";
import DronePage from './screens/Drone/DronePage'
import { MsgButton } from './components/msgButtons/discussion';
import NotifHistory from './screens/NotifHistory/NotifHistory';

interface DecodedToken {
  exp: number;
  iat: number;
  userId: string;
}

/**
 * Composant principal
 * @function App
 * @category Composant
 */
function App() {
  useEffect(() => {

/*     const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDY4YTNlZjJjMzM0NmY5NTQ0ZDZhNGQiLCJpYXQiOjE2ODc0MzIwOTksImV4cCI6MTY4NzQzNTY5OX0.xIJOcrPCW3M0zlCeF4ZdPSYgxn9aG1qKHvdla4VnvXQ";
    const decoded : DecodedToken = jwtDecode(authToken);
    localStorage.token = authToken;
    localStorage.userid = decoded.userId; */

    const paramsMatch = window.location.href.match(/\?.+/);
    if (paramsMatch) {
      const params = new URLSearchParams(paramsMatch[0]);
      const authToken = params.get('token');
      if (authToken) {
        localStorage.token = authToken;
        const decoded: DecodedToken = jwtDecode(authToken);
        localStorage.userid = decoded.userId;
      }
    }
  }, [])

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="drone" element={<DronePage />} />
        <Route path="/history" element={<NotifHistory/>} />
      </Routes>
      {/* <MsgButton/> */}
    </Router>
  );
}

export default App;