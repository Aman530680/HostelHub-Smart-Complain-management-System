const express = require('express')
const router = express.Router()
const {
  listComplaints,
  createComplaint,
  getByStudent,
  updateComplaint,
  wardenDecision,
  workerUpdate
} = require('../controllers/complaintController')
router.get('/', listComplaints)
router.post('/', createComplaint)
router.get('/student/:student_id', getByStudent)
router.put('/:id', updateComplaint)
router.post('/:id/decision', wardenDecision)
router.post('/:id/update', workerUpdate)
module.exports = router
