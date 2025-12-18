const mongoose = require('mongoose')

const wardenSchema = new mongoose.Schema({
  warden_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hostel_block: { type: String, required: true, enum: ['A', 'B', 'C', 'D', 'E'] },
  role: { type: String, default: 'warden' }
}, { timestamps: true })
module.exports = mongoose.model('Warden', wardenSchema)