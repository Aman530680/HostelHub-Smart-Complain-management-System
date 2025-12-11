import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuth } from '../utils/auth'
import './Login.css'
export default function Login() {
  const [role, setRole] = useState('student')
  const [cred, setCred] = useState({})
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()
  function onChange(e) { setCred({...cred, [e.target.name]: e.target.value}) }
  async function onSubmit(e) {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ role, ...cred })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Invalid')
      setAuth(data.user)
      if (data.user.role === 'student') navigate('/student')
      else if (data.user.role === 'warden') navigate('/warden')
      else if (data.user.role === 'worker') navigate('/worker')
    } catch (err) {
      setMsg(err.message)
    }
  }
  return (
    <div className="login-page">
      <h2>Login</h2>
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
          <div className="form-row">
            <label>ID</label>
            <input name={role === 'student' ? 'student_id' : role === 'warden' ? 'warden_id' : 'worker_id'} onChange={onChange} className="input" />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input type="password" name="password" onChange={onChange} className="input" />
          </div>
          <div className="form-row">
            <button className="btn" type="submit">Login</button>
          </div>
        </form>
        {msg && <div className="small">{msg}</div>}
      </div>
    </div>
  )
}
