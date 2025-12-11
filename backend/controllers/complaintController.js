const { complaints } = require('../data/dummyData')
const { v4: uuidv4 } = require('uuid')
function listComplaints(req, res) {
  const status = req.query.status
  if (status) return res.json(complaints.filter(c => c.status === status))
  return res.json(complaints)
}
function createComplaint(req, res) {
  const { student_id, complaint_category, message, image_url } = req.body
  if (!student_id || !complaint_category || !message) return res.status(400).json({ message: 'Missing' })
  const c = {
    id: uuidv4(),
    student_id,
    complaint_category,
    message,
    image_url: image_url || '',
    status: 'pending',
    warden_message: '',
    worker_updates: []
  }
  complaints.push(c)
  res.json(c)
}
function getByStudent(req, res) {
  const sid = req.params.student_id
  const list = complaints.filter(c => c.student_id === sid)
  res.json(list)
}
function updateComplaint(req, res) {
  const id = req.params.id
  const c = complaints.find(x => x.id === id)
  if (!c) return res.status(404).json({ message: 'Not found' })
  if (c.status !== 'pending') return res.status(400).json({ message: 'Cannot edit' })
  const { complaint_category, message, image_url } = req.body
  if (complaint_category) c.complaint_category = complaint_category
  if (message) c.message = message
  if (image_url) c.image_url = image_url
  res.json(c)
}
function wardenDecision(req, res) {
  const id = req.params.id
  const { decision, warden_message } = req.body
  const c = complaints.find(x => x.id === id)
  if (!c) return res.status(404).json({ message: 'Not found' })
  if (decision === 'accepted') c.status = 'accepted'
  else if (decision === 'rejected') c.status = 'rejected'
  else return res.status(400).json({ message: 'Invalid' })
  if (warden_message) c.warden_message = warden_message
  res.json(c)
}
function workerUpdate(req, res) {
  const id = req.params.id
  const { worker_id, update_message } = req.body
  const c = complaints.find(x => x.id === id)
  if (!c) return res.status(404).json({ message: 'Not found' })
  if (c.status !== 'accepted') return res.status(400).json({ message: 'Not allowed' })
  c.worker_updates.push({ worker_id, message: update_message })
  if (update_message && update_message.toLowerCase().includes('resolved')) c.status = 'resolved'
  res.json(c)
}
module.exports = { listComplaints, createComplaint, getByStudent, updateComplaint, wardenDecision, workerUpdate }
