const express = require('express')
const router = express.Router()
const { getAll } = require('../controllers/workerController')
router.get('/', getAll)
module.exports = router
