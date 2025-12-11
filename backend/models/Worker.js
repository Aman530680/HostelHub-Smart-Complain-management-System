const mongoose = require('mongoose')
const WorkerSchema = new mongoose.Schema({
  worker_id: String,
  contact: String,
  category: String,
  password: String
})
module.exports = mongoose.model('Worker', WorkerSchema)
