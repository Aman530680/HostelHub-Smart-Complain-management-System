const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Student = require('../models/Student')
const Warden = require('../models/Warden')
const Worker = require('../models/Worker')

const register = async (req, res) => {
  try {
    const { role, password, ...userData } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    
    let user
    if (role === 'student') {
      user = new Student({ ...userData, password: hashedPassword, role })
    } else if (role === 'warden') {
      user = new Warden({ ...userData, password: hashedPassword, role })
    } else if (role === 'worker') {
      user = new Worker({ ...userData, password: hashedPassword, role })
    } else {
      return res.status(400).json({ message: 'Invalid role' })
    }
    
    await user.save()
    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const login = async (req, res) => {
  try {
    const { role, password, student_id, warden_id, worker_id } = req.body
    let user
    
    if (role === 'student') {
      user = await Student.findOne({ student_id })
    } else if (role === 'warden') {
      user = await Warden.findOne({ warden_id })
    } else if (role === 'worker') {
      user = await Worker.findOne({ worker_id })
    }
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '24h' })
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
    res.json({ token, user: userData })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { register, login }