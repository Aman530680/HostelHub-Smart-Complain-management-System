import React, { useEffect, useState } from 'react'
import './WardenDashboard.css'
import '../styles/status.css'

export default function WardenDashboard() {
  const [complaints, setComplaints] = useState([])
  const [filter, setFilter] = useState({ status: 'all', category: 'all' })
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState({})

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/complaints')
      const data = await res.json()
      setComplaints(Array.isArray(data) ? data : [])
    } catch {
      setComplaints([])
    }
    setLoading(false)
  }

  function onMessageChange(id, value) {
    setMessages(prev => ({ ...prev, [id]: value }))
  }

  async function decide(id, decision) {
    const msg = messages[id] || ''
    try {
      const res = await fetch(`http://localhost:5000/complaints/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, warden_message: msg })
      })
      const data = await res.json()
      if (res.ok) {
        setComplaints(prev => prev.map(p => p.id === data.id ? data : p))
      }
    } catch {}
  }

  const activeComplaints = complaints.filter(
    c => c.status !== 'resolved' && c.status !== 'completed'
  )

  const completedHistory = complaints.filter(
    c => c.status === 'resolved' || c.status === 'completed'
  )

  return (
    <div className="warden-wrap">
      
      <div className="warden-top card">
        <h2>Warden — Admin Panel</h2>
        <p className="small">Manage and monitor student complaints</p>
        <button className="btn" onClick={loadAll}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* ACTIVE COMPLAINTS */}
      <div className="list-panel card">
        <h3>Active Complaints ({activeComplaints.length})</h3>

        {activeComplaints.length === 0 && (
          <div className="small muted">No active complaints</div>
        )}

        {activeComplaints.map(c => (
          <div className="complaint-card" key={c.id}>
            <div className="cc-left">
              <div className="cc-top">
                <div className="cc-title">
                  <strong>{c.complaint_category}</strong>
                  <div className="cc-meta small">{c.student_id}</div>
                </div>
                <div className="cc-status">
                  <span className={`status-badge status-${c.status}`}>{c.status}</span>
                </div>
              </div>

              <div className="cc-msg">{c.message}</div>

              {c.image && (
                <div className="cc-image">
                  <img src={c.image} alt="complaint" />
                </div>
              )}

              {c.worker_updates && c.worker_updates.length > 0 && (
                <ul>
                  {c.worker_updates.map((u, i) => (
                    <li key={i}>{u.worker_id}: {u.message}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* NO EDITING ALLOWED IF COMPLETED */}
            <div className="cc-right">
              <input
                className="input"
                placeholder="Message for worker"
                value={messages[c.id] || ''}
                onChange={e => onMessageChange(c.id, e.target.value)}
              />

              <div className="cc-actions">
                <button className="btn" onClick={() => decide(c.id, 'accepted')}>Accept</button>
                <button className="btn reject" onClick={() => decide(c.id, 'rejected')}>Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* COMPLETED HISTORY */}
      <div className="history-panel card">
        <h3>Completed History ({completedHistory.length})</h3>

        {completedHistory.length === 0 && (
          <div className="small muted">No completed complaints yet</div>
        )}

        {completedHistory.map(c => (
          <div className="complaint-card" key={c.id}>
            <div className="cc-left">
              <div className="cc-top">
                <div className="cc-title">
                  <strong>{c.complaint_category}</strong>
                  <div className="cc-meta small">By {c.student_id}</div>
                </div>
                <div className="cc-status">
                  <span className={`status-badge status-${c.status}`}>{c.status}</span>
                </div>
              </div>

              <div className="cc-msg">{c.message}</div>

              {c.image && (
                <div className="cc-image">
                  <img src={c.image} alt="img" />
                </div>
              )}

              {c.worker_updates && c.worker_updates.length > 0 && (
                <>
                  <strong>Worker Updates:</strong>
                  <ul>
                    {c.worker_updates.map((u,i)=>(
                      <li key={i}>{u.worker_id}: {u.message}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* READ ONLY - NO ACTIONS */}
            <div className="cc-right">
              <span className="small muted">No actions available</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
