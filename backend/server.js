require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const studentRoutes = require('./routes/students')
const wardenRoutes = require('./routes/wardens')
const workerRoutes = require('./routes/workers')
const complaintRoutes = require('./routes/complaints')

const app = express()
app.use(cors())
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

app.use('/auth', authRoutes)
app.use('/students', studentRoutes)
app.use('/warden', wardenRoutes)
app.use('/workers', workerRoutes)
app.use('/complaints', complaintRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log('Server running on', PORT))
