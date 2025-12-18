const express = require('express')
const Worker = require('../models/Worker')
const router = express.Router()

// Get all workers
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find().select('-password')
    res.json(workers.map(w => ({ ...w.toObject(), id: w._id })))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router