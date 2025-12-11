import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, logout } from '../utils/auth'
import './Navbar.css'

export default function Navbar() {
  const user = getAuth()
  const navigate = useNavigate()
  function onLogout() {
    logout()
    navigate('/')
  }
  function scrollToId(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <div className="nav">
      <div className="nav-left" onClick={()=>navigate('/')}>
        <img src="/logo192.png" alt="logo" className="logo-img" />
        <div className="brand">Hostel Hub</div>
      </div>
      <div className="nav-center">
        <button className="link-btn" onClick={()=>scrollToId('about')}>About</button>
        <button className="link-btn" onClick={()=>scrollToId('features')}>Features</button>
        <button className="link-btn" onClick={()=>scrollToId('contact')}>Contact</button>
      </div>
      <div className="nav-right">
        {!user && <Link to="/login" className="btn">Login</Link>}
        {!user && <Link to="/register" className="btn outline">Register</Link>}
        {user && <div className="user-area">
          <span className="small">Hi {user.id}</span>
          <button className="btn" onClick={onLogout}>Logout</button>
        </div>}
      </div>
    </div>
  )
}
