import React, { useEffect, useState } from 'react'
import { getAuth } from '../utils/auth'
import './StudentDashboard.css'
import '../styles/status.css'

export default function StudentDashboard() {
  const user = getAuth()
  const [complaints, setComplaints] = useState([])
  const [form, setForm] = useState({
    complaint_category: 'plumbing',
    message: '',
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
    if (!form.message.trim()) return setError('Message required')

    const body = {
      student_id: user.id,
      complaint_category: form.complaint_category,
      message: form.message,
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
      setForm({ complaint_category: 'plumbing', message: '', image: '' })
    } catch {
      setError('Failed to submit complaint')
    }
  }

  function startEdit(c) {
    setEditing(c)
    setForm({
      complaint_category: c.complaint_category,
      message: c.message,
      image: c.image || ''
    })
    window.scrollTo({ top: 0 })
  }

  async function updateComplaint(e) {
    e.preventDefault()
    const body = {
      complaint_category: form.complaint_category,
      message: form.message,
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
      setForm({ complaint_category: 'plumbing', message: '', image: '' })
    } catch {
      setError('Failed to update complaint')
    }
  }

  function cancelEdit() {
    setEditing(null)
    setForm({ complaint_category: 'plumbing', message: '', image: '' })
  }

  return (
    <div className="student-wrap">
      <div className="student-left card">
        <h3>Student Dashboard</h3>

        <button className="btn small" onClick={loadComplaints}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>

        <form onSubmit={editing ? updateComplaint : createComplaint} className="complaint-form">
          <label>Category</label>
          <div className="category-list">
            {['plumbing','electricity','carpentry','other'].map(c => (
              <button
                key={c}
                type="button"
                className={form.complaint_category === c ? 'pill active' : 'pill'}
                onClick={() => setForm(prev => ({ ...prev, complaint_category: c }))}
              >
                {c}
              </button>
            ))}
          </div>

          <label>Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="input" />

          {form.image && (
            <img src={form.image} alt="" style={{ width: 160, marginTop: 8, borderRadius: 8 }} />
          )}

          <label>Message</label>
          <textarea name="message" value={form.message} onChange={onChange} className="input" />

          <div className="form-actions">
            <button className="btn" type="submit">{editing ? 'Update' : 'Submit'}</button>
            {editing && <button type="button" className="btn ghost" onClick={cancelEdit}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="student-right card">
        <h4>My Complaints</h4>

        <button className="btn small" onClick={loadComplaints}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>

        <table className="complaint-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Message</th>
              <th>Image</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map(c => (
              <tr key={c.id}>
                <td>{c.complaint_category}</td>
                <td>{c.message}</td>
                <td>
                  {c.image && <img src={c.image} alt="" style={{ width: 80, borderRadius: 6 }} />}
                </td>
                <td>
                  <span className={`status-badge status-${c.status}`}>{c.status}</span>
                </td>
                <td>
                  {c.status === 'pending'
                    ? <button className="btn small" onClick={() => startEdit(c)}>Edit</button>
                    : <span>-</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
