import React from 'react'
import './MainDashboard.css'

export default function MainDashboard() {
  function scrollTo(id){
    const el = document.getElementById(id)
    if(el) el.scrollIntoView({behavior:'smooth'})
  }
  return (
    <div className="main-page">
      <div className="hero">
        <div className="hero-left">
          <img src="/logo192.png" alt="logo" className="hero-logo"/>
          <h1>Hostel Hub</h1>
          <p className="sub">Smart Hostel Complaint Management System</p>
          <div className="hero-actions">
            <button className="btn" onClick={()=>scrollTo('about')}>Explaire</button>
            <button className="btn outline" onClick={()=>scrollTo('features')}>Features</button>
          </div>
        </div>
        <div className="hero-right">
          <img src="/assets/hero-left.png" alt="illustration" className="hero-art" />
        </div>
      </div>

      <section id="about" className="section card">
        <h2>About</h2>
        <p>Hostel Hub helps students register complaints, wardens manage them and workers update progress.</p>
      </section>

      <section id="features" className="section card">
        <h2>Features</h2>
        <ul>
          <li>Register complaints with optional image</li>
          <li>Warden accepts/rejects and adds notes</li>
          <li>Workers add updates and mark resolved</li>
        </ul>
      </section>

      <section id="contact" className="section card">
        <h2>Contact</h2>
        <p>For demo only</p>
      </section>
    </div>
  )
}
