import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import MainDashboard from './pages/MainDashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import WardenDashboard from './pages/WardenDashboard'
import WorkerDashboard from './pages/WorkerDashboard'
import PrivateRoute from './components/PrivateRoute'
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
          <Route path="/warden" element={<PrivateRoute role="warden"><WardenDashboard /></PrivateRoute>} />
          <Route path="/worker" element={<PrivateRoute role="worker"><WorkerDashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
export default App
