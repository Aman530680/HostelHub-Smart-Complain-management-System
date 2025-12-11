const express = require('express')
const router = express.Router()
const { getAll } = require('../controllers/wardenController')
router.get('/', getAll)
module.exports = router
