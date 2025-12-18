const mongoose = require('mongoose')

const workerSchema = new mongoose.Schema({
  worker_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String, required: true },
  category: { type: String, required: true, enum: ['electricity', 'plumbing', 'carpentry'] },
  role: { type: String, default: 'worker' }
}, { timestamps: true })

module.exports = mongoose.model('Worker', workerSchema)