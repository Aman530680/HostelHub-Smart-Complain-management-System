const mongoose = require('mongoose')
const StudentSchema = new mongoose.Schema({
  student_id: String,
  main_room_number: String,
  department: String,
  hostel_block: String,
  password: String
})
module.exports = mongoose.model('Student', StudentSchema)
