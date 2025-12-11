const { students } = require('../data/dummyData')
function getAll(req, res) {
  res.json(students)
}
module.exports = { getAll }
