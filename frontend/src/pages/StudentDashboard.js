import React, { useEffect, useState } from 'react'
import { getAuth } from '../utils/auth'
import './StudentDashboard.css'
import '../styles/status.css'

export default function StudentDashboard() {
  const user = getAuth()
  const [complaints, setComplaints] = useState([])
  const [form, setForm] = useState({
    description: '',
    category: 'plumbing',
    image: ''
  })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadComplaints()
  }, [])

  async function loadComplaints() {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/complaints/student/${user.id}`)
      const data = await res.json()
      setComplaints(Array.isArray(data) ? data : [])
    } catch {
      setComplaints([])
    }
    setLoading(false)
  }

  function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  function onChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function createComplaint(e) {
    e.preventDefault()
    setError('')
    if (!form.description.trim()) {
      return setError('Description is required')
    }

    const body = {
      student_id: user.id,
      description: form.description,
      category: form.category,
      image: form.image
    }

    try {
      const res = await fetch('http://localhost:5000/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error()
      setComplaints(prev => [data, ...prev])
      setForm({ description: '', category: 'plumbing', image: '' })
    } catch {
      setError('Failed to submit complaint')
    }
  }

  function startEdit(c) {
    setEditing(c)
    setForm({
      description: c.description,
      category: c.category,
      image: c.image || ''
    })
    window.scrollTo({ top: 0 })
  }

  async function updateComplaint(e) {
    e.preventDefault()
    const body = {
      description: form.description,
      category: form.category,
      image: form.image
    }

    try {
      const res = await fetch(`http://localhost:5000/complaints/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (!res.ok) throw new Error()
      setComplaints(prev => prev.map(x => x.id === data.id ? data : x))
      setEditing(null)
      setForm({ description: '', category: 'plumbing', image: '' })
    } catch {
      setError('Failed to update complaint')
    }
  }

  async function deleteComplaint(id) {
    if (!window.confirm('Delete this complaint?')) return
    try {
      const res = await fetch(`http://localhost:5000/complaints/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setComplaints(prev => prev.filter(c => c.id !== id))
    } catch {
      setError('Failed to delete complaint')
    }
  }

  function cancelEdit() {
    setEditing(null)
    setForm({ description: '', category: 'plumbing', image: '' })
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-grid">
        <div className="card">
          <div className="panel-header">
            <h3>{editing ? 'Edit Complaint' : 'Create New Complaint'}</h3>
          </div>
          
          <form onSubmit={editing ? updateComplaint : createComplaint} className="form-container">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={onChange} className="input">
                <option value="plumbing">Plumbing</option>
                <option value="electricity">Electricity</option>
                <option value="carpentry">Carpentry</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={onChange} className="input" rows="4" required />
            </div>

            <div className="form-group">
              <label>Upload Image (Optional)</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="input" />
            </div>

            {form.image && (
              <div className="form-group">
                <img src={form.image} alt="Preview" style={{ width: 200, borderRadius: 8 }} />
              </div>
            )}

            <div className="btn-group">
              <button className="btn" type="submit">{editing ? 'Update' : 'Submit'}</button>
              {editing && <button type="button" className="btn danger" onClick={cancelEdit}>Cancel</button>}
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        </div>

        <div className="card">
          <div className="panel-header">
            <h3>My Complaints</h3>
            <button className="btn" onClick={loadComplaints}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          <div className="complaints-panel">
            {complaints.map(c => (
              <div key={c.id} className="complaint-item">
                <div className="complaint-header">
                  <h4 className="complaint-title">{c.category} Issue</h4>
                  <span className={`status-badge status-${c.status}`}>{c.status}</span>
                </div>
                <p><strong>Category:</strong> {c.category}</p>
                <p><strong>Description:</strong> {c.description}</p>
                {c.image && <img src={c.image} alt="" className="complaint-image" />}
                {c.assigned_worker_name && <p><strong>Assigned to:</strong> {c.assigned_worker_name}</p>}
                {c.warden_comments && <p><strong>Warden Comments:</strong> {c.warden_comments}</p>}
                <div className="btn-group">
                  {c.status === 'pending' && (
                    <>
                      <button className="btn" onClick={() => startEdit(c)}>Edit</button>
                      <button className="btn danger" onClick={() => deleteComplaint(c.id)}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {complaints.length === 0 && !loading && (
              <div className="empty-state">No complaints yet. Create your first complaint above.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
