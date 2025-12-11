function ensureRole(role) {
  return function (req, res, next) {
    const r = req.body.role || req.headers['x-role']
    if (!r || r !== role) return res.status(401).json({ message: 'Unauthorized' })
    next()
  }
}
module.exports = { ensureRole }
