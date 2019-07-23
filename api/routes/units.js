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

router.patch('/:id', async (req, res, next) => {
  const status = 200
  const { id } = req.params

  try {
    const unit = await Units.findById(id).select('-__v')
    if(unit === null) {
      next({ status: 404, message: 'Unit not found'})
    }

    Object.assign(unit, req.body)
    const response = await unit.save()
    res.json({ status, response })
  } catch (err) {
    if(err.name === 'ValidationError') {
      next({ status: 400, message: err })
    } else {
      next({ status: 500, message: err })
    }
  }
})

router.patch('/:id/company', async (req, res, next) => {
  const status = 200
  const { id } = req.params

  try {
    const unit = await Units.findById(id).select('-__v')
    if(unit === null) {
      next({ status: 404, message: 'Unit not found'})
    }

    Object.assign(unit.company, req.body)
    const { _id, kind, floor, special_monthly_offer, created_at, updated_at, company } = await unit.save()
    const response = { _id, kind, floor, special_monthly_offer, created_at, updated_at, company }
    res.json({ status, response })
  } catch (err) {
    if(err.name === 'ValidationError') {
      next({ status: 400, message: err })
    } else {
      next({ status: 500, message: err })
    }
  }
})

module.exports = router