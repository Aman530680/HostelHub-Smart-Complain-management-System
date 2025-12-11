const { students, wardens, workers } = require('../data/dummyData')
function register(req, res) {
  const { role } = req.body
  if (role === 'student') {
    const { student_id, main_room_number, department, hostel_block, password } = req.body
    if (!student_id || !password) return res.status(400).json({ message: 'Missing' })
    const exists = students.find(s => s.student_id === student_id)
    if (exists) return res.status(400).json({ message: 'Exists' })
    students.push({ student_id, main_room_number, department, hostel_block, password })
    return res.json({ message: 'ok' })
  }
  if (role === 'warden') {
    const { warden_id, hostel_block, password } = req.body
    if (!warden_id || !password) return res.status(400).json({ message: 'Missing' })
    const exists = wardens.find(w => w.warden_id === warden_id)
    if (exists) return res.status(400).json({ message: 'Exists' })
    wardens.push({ warden_id, hostel_block, password })
    return res.json({ message: 'ok' })
  }
  if (role === 'worker') {
    const { worker_id, contact, category, password } = req.body
    if (!worker_id || !password) return res.status(400).json({ message: 'Missing' })
    const exists = workers.find(w => w.worker_id === worker_id)
    if (exists) return res.status(400).json({ message: 'Exists' })
    workers.push({ worker_id, contact, category, password })
    return res.json({ message: 'ok' })
  }
  return res.status(400).json({ message: 'Unknown role' })
}
function login(req, res) {
  const { role } = req.body
  const password = req.body.password
  if (role === 'student') {
    const id = req.body.student_id
    const u = students.find(s => s.student_id === id && s.password === password)
    if (!u) return res.status(401).json({ message: 'Invalid' })
    return res.json({ user: { role: 'student', id: u.student_id } })
  }
  if (role === 'warden') {
    const id = req.body.warden_id
    const u = wardens.find(w => w.warden_id === id && w.password === password)
    if (!u) return res.status(401).json({ message: 'Invalid' })
    return res.json({ user: { role: 'warden', id: u.warden_id } })
  }
  if (role === 'worker') {
    const id = req.body.worker_id
    const u = workers.find(w => w.worker_id === id && w.password === password)
    if (!u) return res.status(401).json({ message: 'Invalid' })
    return res.json({ user: { role: 'worker', id: u.worker_id } })
  }
  return res.status(400).json({ message: 'Unknown role' })
}
module.exports = { register, login }
