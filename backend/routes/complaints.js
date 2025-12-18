const express = require('express')
const Complaint = require('../models/Complaint')
const Student = require('../models/Student')
const Worker = require('../models/Worker')
const router = express.Router()

// Create complaint
router.post('/', async (req, res) => {
  try {
    const student = await Student.findById(req.body.student_id)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    
    const complaint = new Complaint({
      description: req.body.description,
      image: req.body.image || '',
      category: req.body.category,
      student_id: req.body.student_id,
      student_name: student.name,
      room_number: student.room_number
    })
    await complaint.save()
    res.json({ ...complaint.toObject(), id: complaint._id })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Get complaints by student
router.get('/student/:studentId', async (req, res) => {
  try {
    const complaints = await Complaint.find({ student_id: req.params.studentId }).sort({ createdAt: -1 })
    res.json(complaints.map(c => ({ ...c.toObject(), id: c._id })))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get all complaints (for warden)
router.get('/all', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 })
    res.json(complaints.map(c => ({ ...c.toObject(), id: c._id })))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get complaints by worker
router.get('/worker/:workerId', async (req, res) => {
  try {
    const complaints = await Complaint.find({ assigned_worker_id: req.params.workerId }).sort({ createdAt: -1 })
    res.json(complaints.map(c => ({ ...c.toObject(), id: c._id })))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Update complaint (student edit)
router.put('/:id', async (req, res) => {
  try {
    const updateData = {
      description: req.body.description,
      category: req.body.category,
      image: req.body.image || ''
    }
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ ...complaint.toObject(), id: complaint._id })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete complaint
router.delete('/:id', async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id)
    res.json({ message: 'Complaint deleted' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update complaint status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, assigned_worker_id, warden_comments } = req.body
    const updateData = { status }
    
    if (warden_comments) {
      updateData.warden_comments = warden_comments
    }
    
    if (assigned_worker_id) {
      const worker = await Worker.findById(assigned_worker_id)
      updateData.assigned_worker_id = assigned_worker_id
      updateData.assigned_worker_name = worker.name
    }
    
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json({ ...complaint.toObject(), id: complaint._id })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router