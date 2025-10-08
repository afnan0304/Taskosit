export default function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err)

  if (err && err.array) {
    const errors = err.array().map(e => ({ field: e.param, msg: e.msg }))
    return res.status(400).json({ errors })
  }

  if (err && err.status) {
    return res.status(err.status).json({ error: err.message || 'Error' })
  }

  console.error(err)
  return res.status(500).json({ error: 'Internal Server Error' })
}
