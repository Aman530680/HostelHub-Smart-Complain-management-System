const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({
  description: { type: String, required: true },
  room_number: { type: String, required: true },
  image: { type: String, default: '' },
  student_id: { type: String, required: true },
  student_name: { type: String, required: true },
  category: { type: String, required: true, enum: ['electricity', 'plumbing', 'carpentry', 'other'] },
  status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'rejected', 'in-progress', 'completed'] },
  assigned_worker_id: { type: String, default: null },
  assigned_worker_name: { type: String, default: null },
  warden_comments: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('Complaint', complaintSchema)