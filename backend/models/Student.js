const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  room_number: { type: String, required: true },
  department: { type: String, required: true, enum: ['CSE', 'AIML', 'CCE', 'EEE', 'IT'] },
  hostel_block: { type: String, required: true, enum: ['A', 'B', 'C', 'D', 'E'] },
  role: { type: String, default: 'student' }
}, { timestamps: true })

module.exports = mongoose.model('Student', studentSchema)