import React from 'react'
import './MainDashboard.css'

export default function MainDashboard() {

  function scrollToSection(id){
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="main-page">

      <div className="hero">
        <div className="hero-left">
          <h1 className="title">Hostel Hub</h1>
          <p className="subtitle">Smart Hostel Complaint Management System</p>

          <p className="hero-text">
            A simple and efficient platform designed for students, wardens and workers 
            to manage hostel complaints with complete transparency, faster resolution 
            and smooth communication.
          </p>

          <div className="hero-actions">
            <button className="btn" onClick={() => scrollToSection('about')}>Explore</button>
            <button className="btn outline" onClick={() => scrollToSection('features')}>Features</button>
          </div>
        </div>

        <div className="hero-right">
          <img 
            src="https://th.bing.com/th/id/OIP.NpwaQrfriLOm9b0k6L_c4wHaE7?w=260&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1" 
            className="hero-img" 
            alt="hero" 
          />
        </div>
      </div>

      <section id="about" className="section card">
        <h2>About Hostel Hub</h2>
        <div className="about-content">
          <p className="intro-text">
            Hostel Hub is a comprehensive digital solution designed to revolutionize hostel management 
            by replacing outdated manual complaint systems with a modern, efficient platform. Our system 
            bridges the communication gap between students, wardens, and maintenance workers, ensuring 
            faster resolution of hostel issues.
          </p>
          
          <div className="info-grid">
            <div className="info-card">
              <h3>Why Hostel Hub?</h3>
              <p>
                Traditional complaint systems often involve paperwork, long waiting times, and lack of 
                transparency. Students had no way to track their complaints, wardens struggled with 
                organization, and workers received unclear instructions. Hostel Hub solves all these 
                problems with a centralized, digital approach.
              </p>
            </div>
            
            <div className="info-card">
              <h3>How It Works</h3>
              <ul>
                <li>Students submit complaints instantly with photos and descriptions</li>
                <li>Wardens review, approve, and add instructions for workers</li>
                <li>Workers receive clear job details and update progress in real-time</li>
                <li>Everyone stays informed with automatic status updates</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h3>Key Benefits</h3>
              <ul className="benefits-list">
                <li>✓ 24/7 complaint submission - no office hours required</li>
                <li>✓ Complete transparency - track every complaint from start to finish</li>
                <li>✓ Faster resolution - direct communication between all parties</li>
                <li>✓ Digital records - maintain history of all maintenance activities</li>
                <li>✓ Reduced paperwork - everything is stored digitally</li>
                <li>✓ Better accountability - clear assignment and progress tracking</li>
              </ul>
            </div>
          </div>
          
          <p className="tech-note">
            Built with modern web technologies, Hostel Hub ensures reliability, security, and 
            ease of use for all stakeholders in the hostel ecosystem.
          </p>
        </div>
      </section>

      <section id="features" className="section card">
        <h2>System Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h4>Student Portal</h4>
            <p>Submit complaints with optional image uploads and track progress in real-time</p>
          </div>
          <div className="feature-item">
            <h4>Warden Dashboard</h4>
            <p>Review, accept or reject complaints with detailed notes for workers</p>
          </div>
          <div className="feature-item">
            <h4>Worker Interface</h4>
            <p>Receive assigned complaints and update progress status efficiently</p>
          </div>
          <div className="feature-item">
            <h4>Status Tracking</h4>
            <p>Real-time updates: Pending, Accepted, Rejected, In-Progress, Completed</p>
          </div>
          <div className="feature-item">
            <h4>Role-Based Access</h4>
            <p>Clean, customized dashboards for Students, Wardens, and Workers</p>
          </div>
          <div className="feature-item">
            <h4>User-Friendly Design</h4>
            <p>Simple, intuitive interface designed for fast and easy communication</p>
          </div>
        </div>
      </section>

      <section id="contact" className="section card">
        <h2>Contact Information</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <h3>Institution</h3>
            <p><strong>Sri Eshwar College of Engineering</strong></p>
            <p>Kondampatti [Post], Vadasithur (via)</p>
            <p>Coimbatore – 641 202, Tamil Nadu, India</p>
            <p><strong>Phone:</strong> 04259 200300</p>
          </div>
          
          <div className="location-info">
            <h3>Location Access</h3>
            <ul>
              <li>34.5 km from Coimbatore International Airport</li>
              <li>29 km from Gandhipuram Central Bus Stand</li>
              <li>27 km from Coimbatore Railway Station</li>
            </ul>
          </div>
          
          <div className="developer-info">
            <h3>Development</h3>
            <p><strong>Designed & Developed by</strong></p>
            <p>Aman Karn</p>
          </div>
        </div>
      </section>

    </div>
  )
}
