import React, { useEffect, useState } from 'react'
import { getAuth } from '../utils/auth'
import './WorkerDashboard.css'
import '../styles/status.css'

export default function WorkerDashboard() {
  const user = getAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAssigned()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadAssigned() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:5000/complaints?status=accepted')
      const data = await res.json()
      setComplaints(Array.isArray(data) ? data : [])
    } catch (err) {
      setComplaints([])
      setError('Failed to load assigned complaints')
    } finally {
      setLoading(false)
    }
  }

  function countStatus(status) {
    return complaints.filter(c => c.status === status).length
  }

  async function markCompleted(id) {
    if (!user) return alert('Not logged in')
    const confirm = window.confirm('Mark this complaint as completed?')
    if (!confirm) return
    const message = `Completed by ${user.id} - resolved`
    try {
      const res = await fetch(`http://localhost:5000/complaints/${id}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worker_id: user.id, update_message: message })
      })
      const data = await res.json()
      if (res.ok) {
        setComplaints(prev => prev.map(p => (p.id === data.id ? data : p)))
      } else {
        alert(data.message || 'Failed to update')
      }
    } catch (err) {
      alert('Network error')
    }
  }

  return (
    <div className="worker-wrap">
      <div className="worker-top card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 style={{ margin: 0 }}>Worker Dashboard</h3>
          <div className="small muted">You: {user ? user.id : 'Guest'}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="worker-stats">
            <button className="stat-btn">Pending ({countStatus('accepted')})</button>
            <button className="stat-btn">Completed ({countStatus('resolved')})</button>
          </div>
          <div className="right">
            <button className="btn small" onClick={loadAssigned}>{loading ? 'Refreshing...' : 'Refresh'}</button>
          </div>
        </div>
      </div>

      <div className="worker-list card">
        <h4 style={{ marginTop: 0 }}>Assigned Complaints</h4>

        {loading && <div className="small muted">Loading...</div>}
        {error && <div className="small" style={{ color: '#b91c1c' }}>{error}</div>}

        {complaints.length === 0 && !loading && <div className="small muted">No assigned complaints</div>}

        {complaints.map(c => (
          <div className="worker-item" key={c.id}>
            <div className="wi-left">
              <div><strong>Student:</strong> {c.student_id}</div>
              <div><strong>Room:</strong> {c.room || '-'}</div>
              <div><strong>Category:</strong> {c.complaint_category}</div>
              <div><strong>Message:</strong> {c.message}</div>
              {c.worker_updates && c.worker_updates.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <strong>Updates:</strong>
                  <ul style={{ margin: '6px 0 0 16px' }}>
                    {c.worker_updates.map((u, i) => <li key={i}>{u.worker_id}: {u.message}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <div className="wi-right">
              <div>
                <span className={`status-badge status-${c.status}`}>{c.status}</span>
              </div>
              {c.status === 'accepted' ? (
                <button className="btn completed" onClick={() => markCompleted(c.id)}>Completed</button>
              ) : (
                <div className="small muted">No actions</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
