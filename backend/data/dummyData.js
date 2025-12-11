const { v4: uuidv4 } = require('uuid')
const students = [
  { student_id: 'S1001', main_room_number: '101', department: 'CSE', hostel_block: 'A', password: 'pass123' }
]
const wardens = [
  { warden_id: 'W1001', hostel_block: 'A', password: 'wardenpass' }
]
const workers = [
  { worker_id: 'WK1001', contact: '9999999999', category: 'plumbing', password: 'workerpass' }
]
const complaints = []
module.exports = { students, wardens, workers, complaints }
