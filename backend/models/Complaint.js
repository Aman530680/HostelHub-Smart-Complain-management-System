const mongoose = require('mongoose')
const ComplaintSchema = new mongoose.Schema({
  student_id: String,
  complaint_category: String,
  message: String,
  image_url: String,
  status: String,
  warden_message: String,
  worker_updates: [{ worker_id: String, message: String }]
}, { timestamps: true })
module.exports = mongoose.model('Complaint', ComplaintSchema)
