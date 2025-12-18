const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  main_room_number: { type: String, required: true },
  department: { type: String, required: true },
  hostel_block: { type: String, required: true },
  role: { type: String, default: 'student' }
}, { timestamps: true })

module.exports = mongoose.model('Student', studentSchema)