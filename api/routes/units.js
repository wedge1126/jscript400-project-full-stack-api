const router = require('express').Router()
const Units = require('../models/unit')

router.post('/', async (req, res, next) => {
  const status = 201
  try {
    const response = await Units.create(req.body)
    res.status(status).json({ status, response })
  } catch (err) {
    if(err.name === 'ValidationError') {
      next({ status: 400, message: err })
    } else {
      next({ status: 500, message: err })
    }
  }
})

router.get('/', async (req, res, next) => {
  const status = 200
  const { occupied } = req.query
  let query = Object.assign({}, req.query)
  delete query.occupied

  if(occupied === 'true' || occupied === 'false') {
    query.company = { $exists: occupied === 'true' }
  }

  const response = await Units.find(query).select('-__v')
  res.json({status, response})
})

module.exports = router