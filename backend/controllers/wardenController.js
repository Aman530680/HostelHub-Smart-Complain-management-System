const { wardens } = require('../data/dummyData')
function getAll(req, res) {
  res.json(wardens)
}
module.exports = { getAll }
