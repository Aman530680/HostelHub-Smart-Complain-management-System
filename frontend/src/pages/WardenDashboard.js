import React, { useEffect, useState } from 'react'
import './WardenDashboard.css'
import '../styles/status.css'

export default function WardenDashboard() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(false)
  const [wardenComments, setWardenComments] = useState({})

  useEffect(() => {
    loadComplaints()
  }, [])

  async function loadComplaints() {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/complaints/all')
      const data = await res.json()
      setComplaints(Array.isArray(data) ? data : [])
    } catch {
      setComplaints([])
    }
    setLoading(false)
  }



  async function updateComplaintStatus(id, status) {
    const body = {
      status,
      warden_comments: wardenComments[id] || ''
    }

    try {
      const res = await fetch(`http://localhost:5000/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (res.ok) {
        setComplaints(prev => prev.map(c => c.id === data.id ? data : c))
        setWardenComments(prev => ({ ...prev, [id]: '' }))
      }
    } catch {}
  }

  const pendingComplaints = complaints.filter(c => c.status === 'pending')
  const activeComplaints = complaints.filter(c => ['accepted', 'in-progress'].includes(c.status))
  const completedComplaints = complaints.filter(c => ['completed', 'rejected'].includes(c.status))

  return (
    <div className="warden-wrap">
      <div className="warden-header card">
        <h2>Warden Dashboard</h2>
        <p>Manage student complaints and assign workers</p>
        <button className="btn" onClick={loadComplaints}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="dashboard-grid">
        {/* PENDING COMPLAINTS */}
        <div className="complaints-section card">
          <h3>Pending Complaints ({pendingComplaints.length})</h3>
        {pendingComplaints.map(c => (
          <div key={c.id} className="complaint-card">
            <div className="complaint-info">
              <h4>{c.category} Issue</h4>
              <p><strong>Student:</strong> {c.student_name}</p>
              <p><strong>Room:</strong> {c.room_number}</p>
              <p><strong>Category:</strong> {c.category}</p>
              <p><strong>Description:</strong> {c.description}</p>
              {c.image && <img src={c.image} alt="" className="complaint-image" />}
            </div>
            <div className="complaint-actions">
              <div className="form-row">
                <label>Comments:</label>
                <textarea 
                  value={wardenComments[c.id] || ''}
                  onChange={e => setWardenComments(prev => ({ ...prev, [c.id]: e.target.value }))}
                  className="input"
                  placeholder="Add comments..."
                />
              </div>
              <div className="action-buttons">
                <button className="btn" onClick={() => updateComplaintStatus(c.id, 'accepted')}>Accept</button>
                <button className="btn danger" onClick={() => updateComplaintStatus(c.id, 'rejected')}>Reject</button>
              </div>
            </div>
          </div>
        ))}
          {pendingComplaints.length === 0 && <div className="empty-box">No pending complaints</div>}
        </div>

        {/* ACTIVE COMPLAINTS */}
        <div className="complaints-section card">
          <h3>Active Complaints ({activeComplaints.length})</h3>
        {activeComplaints.map(c => (
          <div key={c.id} className="complaint-card">
            <div className="complaint-info">
              <h4>{c.category} Issue</h4>
              <p><strong>Student:</strong> {c.student_name}</p>
              <p><strong>Room:</strong> {c.room_number}</p>
              <p><strong>Category:</strong> {c.category}</p>
              <p><strong>Description:</strong> {c.description}</p>
              {c.assigned_worker_name && <p><strong>Assigned to:</strong> {c.assigned_worker_name}</p>}
              <p><strong>Status:</strong> <span className={`status-badge status-${c.status}`}>{c.status}</span></p>
              {c.image && <img src={c.image} alt="" className="complaint-image" />}
              {c.warden_comments && <p><strong>Comments:</strong> {c.warden_comments}</p>}
            </div>
          </div>
        ))}
          {activeComplaints.length === 0 && <div className="empty-box">No active complaints</div>}
        </div>
      </div>

      {/* COMPLETED COMPLAINTS */}
      <div className="complaints-section card">
        <h3>Completed Complaints ({completedComplaints.length})</h3>
        {completedComplaints.map(c => (
          <div key={c.id} className="complaint-card">
            <div className="complaint-info">
              <h4>{c.category} Issue</h4>
              <p><strong>Student:</strong> {c.student_name}</p>
              <p><strong>Room:</strong> {c.room_number}</p>
              <p><strong>Category:</strong> {c.category}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${c.status}`}>{c.status}</span></p>
              {c.assigned_worker_name && <p><strong>Completed by:</strong> {c.assigned_worker_name}</p>}
              {c.warden_comments && <p><strong>Comments:</strong> {c.warden_comments}</p>}
            </div>
          </div>
        ))}
        {completedComplaints.length === 0 && <div className="empty-box">No completed complaints</div>}
      </div>
    </div>
  )
}