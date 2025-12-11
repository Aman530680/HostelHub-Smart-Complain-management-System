const { workers } = require('../data/dummyData')
function getAll(req, res) {
  res.json(workers)
}
module.exports = { getAll }
