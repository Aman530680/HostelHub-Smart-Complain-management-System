const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({
  complaint_id: { type: String, required: true, unique: true },
  student_id: { type: String, required: true },
  category: { type: String, required: true, enum: ['electricity', 'plumbing', 'carpentry'] },
  description: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'assigned', 'in-progress', 'completed'] },
  assigned_worker: { type: String, default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: true })

module.exports = mongoose.model('Complaint', complaintSchema)