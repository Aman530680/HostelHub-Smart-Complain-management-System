import React, { useEffect, useState } from 'react'
import { getAuth } from '../utils/auth'
import './WorkerDashboard.css'
import '../styles/status.css'

export default function WorkerDashboard() {
  const user = getAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadAssignedComplaints()
  }, [])

  async function loadAssignedComplaints() {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/complaints/worker/${user.id}`)
      const data = await res.json()
      setComplaints(Array.isArray(data) ? data : [])
    } catch {
      setComplaints([])
    }
    setLoading(false)
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`http://localhost:5000/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (res.ok) {
        setComplaints(prev => prev.map(c => c.id === data.id ? data : c))
      }
    } catch {}
  }

  const assignedComplaints = complaints.filter(c => c.status === 'accepted')
  const inProgressComplaints = complaints.filter(c => c.status === 'in-progress')
  const completedComplaints = complaints.filter(c => c.status === 'completed')

  return (
    <div className="worker-wrap">
      <div className="worker-header card">
        <h2>Worker Dashboard</h2>
        <p>Manage your assigned complaints</p>
        <button className="btn" onClick={loadAssignedComplaints}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* ASSIGNED COMPLAINTS */}
      <div className="complaints-section card">
        <h3>New Assignments ({assignedComplaints.length})</h3>
        {assignedComplaints.map(c => (
          <div key={c.id} className="complaint-card">
            <div className="complaint-info">
              <h4>{c.title}</h4>
              <p><strong>Student:</strong> {c.student_name}</p>
              <p><strong>Room:</strong> {c.room_number}</p>
              <p><strong>Category:</strong> {c.category}</p>
              <p><strong>Description:</strong> {c.description}</p>
              {c.image && <img src={c.image} alt="" className="complaint-image" />}
              {c.warden_comments && <p><strong>Warden Notes:</strong> {c.warden_comments}</p>}
            </div>
            <div className="complaint-actions">
              <button className="btn" onClick={() => updateStatus(c.id, 'in-progress')}>
                Start Work
              </button>
            </div>
          </div>
        ))}
        {assignedComplaints.length === 0 && <p>No new assignments</p>}
      </div>

      {/* IN PROGRESS COMPLAINTS */}
      <div className="complaints-section card">
        <h3>In Progress ({inProgressComplaints.length})</h3>
        {inProgressComplaints.map(c => (
          <div key={c.id} className="complaint-card">
            <div className="complaint-info">
              <h4>{c.title}</h4>
              <p><strong>Student:</strong> {c.student_name}</p>
              <p><strong>Room:</strong> {c.room_number}</p>
              <p><strong>Category:</strong> {c.category}</p>
              <p><strong>Description:</strong> {c.description}</p>
              {c.image && <img src={c.image} alt="" className="complaint-image" />}
              {c.warden_comments && <p><strong>Warden Notes:</strong> {c.warden_comments}</p>}
            </div>
            <div className="complaint-actions">
              <button className="btn success" onClick={() => updateStatus(c.id, 'completed')}>
                Mark Complete
              </button>
            </div>
          </div>
        ))}
        {inProgressComplaints.length === 0 && <p>No work in progress</p>}
      </div>

      {/* COMPLETED COMPLAINTS */}
      <div className="complaints-section card">
        <h3>Completed Work ({completedComplaints.length})</h3>
        {completedComplaints.map(c => (
          <div key={c.id} className="complaint-card">
            <div className="complaint-info">
              <h4>{c.title}</h4>
              <p><strong>Student:</strong> {c.student_name}</p>
              <p><strong>Room:</strong> {c.room_number}</p>
              <p><strong>Category:</strong> {c.category}</p>
              <p><strong>Status:</strong> <span className="status-badge status-completed">Completed</span></p>
            </div>
          </div>
        ))}
        {completedComplaints.length === 0 && <p>No completed work yet</p>}
      </div>
    </div>
  )
}