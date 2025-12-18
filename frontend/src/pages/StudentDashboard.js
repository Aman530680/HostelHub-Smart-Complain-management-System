import React, { useEffect, useState } from 'react'
import { getAuth } from '../utils/auth'
import './StudentDashboard.css'
import '../styles/status.css'

export default function StudentDashboard() {
  const user = getAuth()
  const [complaints, setComplaints] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    room_number: '',
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
    if (!form.title.trim() || !form.description.trim() || !form.room_number.trim()) {
      return setError('Title, description and room number are required')
    }

    const body = {
      student_id: user.id,
      title: form.title,
      description: form.description,
      room_number: form.room_number,
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
      setForm({ title: '', description: '', room_number: '', category: 'plumbing', image: '' })
    } catch {
      setError('Failed to submit complaint')
    }
  }

  function startEdit(c) {
    setEditing(c)
    setForm({
      title: c.title,
      description: c.description,
      room_number: c.room_number,
      category: c.category,
      image: c.image || ''
    })
    window.scrollTo({ top: 0 })
  }

  async function updateComplaint(e) {
    e.preventDefault()
    const body = {
      title: form.title,
      description: form.description,
      room_number: form.room_number,
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
      setForm({ title: '', description: '', room_number: '', category: 'plumbing', image: '' })
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
    setForm({ title: '', description: '', room_number: '', category: 'plumbing', image: '' })
  }

  return (
    <div className="student-wrap">
      <div className="student-left card">
        <h3>{editing ? 'Edit Complaint' : 'Create New Complaint'}</h3>

        <form onSubmit={editing ? updateComplaint : createComplaint} className="complaint-form">
          <div className="form-row">
            <label>Title</label>
            <input name="title" value={form.title} onChange={onChange} className="input" required />
          </div>

          <div className="form-row">
            <label>Room Number</label>
            <input name="room_number" value={form.room_number} onChange={onChange} className="input" required />
          </div>

          <div className="form-row">
            <label>Category</label>
            <select name="category" value={form.category} onChange={onChange} className="input">
              <option value="plumbing">Plumbing</option>
              <option value="electricity">Electricity</option>
              <option value="carpentry">Carpentry</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-row">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={onChange} className="input" rows="4" required />
          </div>

          <div className="form-row">
            <label>Upload Image (Optional)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="input" />
          </div>

          {form.image && (
            <div className="form-row">
              <img src={form.image} alt="Preview" style={{ width: 200, borderRadius: 8 }} />
            </div>
          )}

          <div className="form-actions">
            <button className="btn" type="submit">{editing ? 'Update' : 'Submit'}</button>
            {editing && <button type="button" className="btn ghost" onClick={cancelEdit}>Cancel</button>}
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </div>

      <div className="student-right card">
        <div className="header-row">
          <h4>My Complaints</h4>
          <button className="btn small" onClick={loadComplaints}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="complaints-list">
          {complaints.map(c => (
            <div key={c.id} className="complaint-item">
              <div className="complaint-header">
                <h5>{c.title}</h5>
                <span className={`status-badge status-${c.status}`}>{c.status}</span>
              </div>
              <p><strong>Room:</strong> {c.room_number}</p>
              <p><strong>Category:</strong> {c.category}</p>
              <p><strong>Description:</strong> {c.description}</p>
              {c.image && <img src={c.image} alt="" className="complaint-image" />}
              {c.assigned_worker_name && <p><strong>Assigned to:</strong> {c.assigned_worker_name}</p>}
              {c.warden_comments && <p><strong>Warden Comments:</strong> {c.warden_comments}</p>}
              <div className="complaint-actions">
                {c.status === 'pending' && (
                  <>
                    <button className="btn small" onClick={() => startEdit(c)}>Edit</button>
                    <button className="btn small danger" onClick={() => deleteComplaint(c.id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
          {complaints.length === 0 && !loading && (
            <p className="no-complaints">No complaints yet. Create your first complaint above.</p>
          )}
        </div>
      </div>
    </div>
  )
}
