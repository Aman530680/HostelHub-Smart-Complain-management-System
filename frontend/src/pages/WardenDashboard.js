import React, { useEffect, useState } from 'react'
import './WardenDashboard.css'
import '../styles/status.css'

export default function WardenDashboard() {
  const [complaints, setComplaints] = useState([])
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedWorker, setSelectedWorker] = useState({})
  const [wardenComments, setWardenComments] = useState({})

  useEffect(() => {
    loadComplaints()
    loadWorkers()
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

  async function loadWorkers() {
    try {
      const res = await fetch('http://localhost:5000/workers')
      const data = await res.json()
      setWorkers(Array.isArray(data) ? data : [])
    } catch {
      setWorkers([])
    }
  }

  async function updateComplaintStatus(id, status, workerId = null) {
    const body = {
      status,
      warden_comments: wardenComments[id] || ''
    }
    if (workerId) {
      body.assigned_worker_id = workerId
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
        setSelectedWorker(prev => ({ ...prev, [id]: '' }))
      }
    } catch {}
  }

  function acceptComplaint(id) {
    const workerId = selectedWorker[id]
    if (!workerId) {
      alert('Please select a worker to assign this complaint')
      return
    }
    updateComplaintStatus(id, 'accepted', workerId)
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

      {/* PENDING COMPLAINTS */}
      <div className="complaints-section card">
        <h3>Pending Complaints ({pendingComplaints.length})</h3>
        {pendingComplaints.map(c => (
          <div key={c.id} className="complaint-card">
            <div className="complaint-info">
              <h4>{c.title}</h4>
              <p><strong>Student:</strong> {c.student_name}</p>
              <p><strong>Room:</strong> {c.room_number}</p>
              <p><strong>Category:</strong> {c.category}</p>
              <p><strong>Description:</strong> {c.description}</p>
              {c.image && <img src={c.image} alt="" className="complaint-image" />}
            </div>
            <div className="complaint-actions">
              <div className="form-row">
                <label>Assign Worker:</label>
                <select 
                  value={selectedWorker[c.id] || ''} 
                  onChange={e => setSelectedWorker(prev => ({ ...prev, [c.id]: e.target.value }))}
                  className="input"
                >
                  <option value="">Select Worker</option>
                  {workers.filter(w => w.category === c.category).map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.category})</option>
                  ))}
                </select>
              </div>
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
                <button className="btn" onClick={() => acceptComplaint(c.id)}>Accept & Assign</button>
                <button className="btn danger" onClick={() => updateComplaintStatus(c.id, 'rejected')}>Reject</button>
              </div>
            </div>
          </div>
        ))}
        {pendingComplaints.length === 0 && <p>No pending complaints</p>}
      </div>

      {/* ACTIVE COMPLAINTS */}
      <div className="complaints-section card">
        <h3>Active Complaints ({activeComplaints.length})</h3>
        {activeComplaints.map(c => (
          <div key={c.id} className="complaint-card">
            <div className="complaint-info">
              <h4>{c.title}</h4>
              <p><strong>Student:</strong> {c.student_name}</p>
              <p><strong>Room:</strong> {c.room_number}</p>
              <p><strong>Category:</strong> {c.category}</p>
              <p><strong>Description:</strong> {c.description}</p>
              <p><strong>Assigned to:</strong> {c.assigned_worker_name}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${c.status}`}>{c.status}</span></p>
              {c.image && <img src={c.image} alt="" className="complaint-image" />}
              {c.warden_comments && <p><strong>Comments:</strong> {c.warden_comments}</p>}
            </div>
          </div>
        ))}
        {activeComplaints.length === 0 && <p>No active complaints</p>}
      </div>

      {/* COMPLETED COMPLAINTS */}
      <div className="complaints-section card">
        <h3>Completed Complaints ({completedComplaints.length})</h3>
        {completedComplaints.map(c => (
          <div key={c.id} className="complaint-card">
            <div className="complaint-info">
              <h4>{c.title}</h4>
              <p><strong>Student:</strong> {c.student_name}</p>
              <p><strong>Room:</strong> {c.room_number}</p>
              <p><strong>Category:</strong> {c.category}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${c.status}`}>{c.status}</span></p>
              {c.assigned_worker_name && <p><strong>Handled by:</strong> {c.assigned_worker_name}</p>}
              {c.warden_comments && <p><strong>Comments:</strong> {c.warden_comments}</p>}
            </div>
          </div>
        ))}
        {completedComplaints.length === 0 && <p>No completed complaints</p>}
      </div>
    </div>
  )
}