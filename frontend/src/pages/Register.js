import React, { useState } from 'react'
import './Register.css'
export default function Register() {
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({})
  const [msg, setMsg] = useState('')
  function onChange(e) { setForm({...form, [e.target.name]: e.target.value}) }
  async function onSubmit(e) {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ role, ...form })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error')
      setMsg('Registered')
      setForm({})
    } catch (err) {
      setMsg(err.message)
    }
  }
  return (
    <div className="register-page">
      <h2>Register</h2>
      <div className="card">
        <div className="form-row">
          <label>Role</label>
          <select value={role} onChange={(e)=>setRole(e.target.value)} className="input">
            <option value="student">Student</option>
            <option value="warden">Warden</option>
            <option value="worker">Worker</option>
          </select>
        </div>
        <form onSubmit={onSubmit}>
          {role === 'student' && <>
            <div className="form-row"><label>Student ID</label><input name="student_id" onChange={onChange} value={form.student_id||''} className="input" /></div>
            <div className="form-row"><label>Room</label><input name="main_room_number" onChange={onChange} value={form.main_room_number||''} className="input" /></div>
            <div className="form-row"><label>Department</label><input name="department" onChange={onChange} value={form.department||''} className="input" /></div>
            <div className="form-row"><label>Hostel Block</label><input name="hostel_block" onChange={onChange} value={form.hostel_block||''} className="input" /></div>
          </>}
          {role === 'warden' && <>
            <div className="form-row"><label>Warden ID</label><input name="warden_id" onChange={onChange} value={form.warden_id||''} className="input" /></div>
            <div className="form-row"><label>Hostel Block</label><input name="hostel_block" onChange={onChange} value={form.hostel_block||''} className="input" /></div>
          </>}
          {role === 'worker' && <>
            <div className="form-row"><label>Worker ID</label><input name="worker_id" onChange={onChange} value={form.worker_id||''} className="input" /></div>
            <div className="form-row"><label>Contact</label><input name="contact" onChange={onChange} value={form.contact||''} className="input" /></div>
            <div className="form-row"><label>Category</label>
              <select name="category" onChange={onChange} value={form.category||''} className="input">
                <option value="">Select</option>
                <option value="electricity">Electricity</option>
                <option value="plumbing">Plumbing</option>
                <option value="carpentry">Carpentry</option>
              </select>
            </div>
          </>}
          <div className="form-row"><label>Password</label><input name="password" type="password" onChange={onChange} value={form.password||''} className="input" /></div>
          <div className="form-row"><button className="btn" type="submit">Register</button></div>
        </form>
        {msg && <div className="small">{msg}</div>}
      </div>
    </div>
  )
}
