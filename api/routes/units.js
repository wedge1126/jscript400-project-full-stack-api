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

  if(occupied === 'true') {
    query.company = { $exists: true, $ne: null }
  } else if(occupied === 'false') {
    query.company = null
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

    if(!unit.company) {
      unit.company = {}
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

router.delete('/:id/company', async (req, res, next) => {
  const status = 200
  const { id } = req.params

  try {
    const unit = await Units.findById(id).select('-__v')
    if(unit === null) {
      next({ status: 404, message: 'Unit not found'})
    }

    unit.company.remove()
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

router.get('/:id/company/employees', async (req, res, next) => {
  const status = 200
  const { id } = req.params

  const unit = await Units.findById(id).select('-__v')
  if(unit === null) {
    next({ status: 404, message: 'Unit not found'})
  } else if(!unit.company) {
    next({ status: 404, message: 'Company not found. Unit is unoccupied.'})
  }

  const response = unit.company.employees
  res.json({ status, response })
})

router.get('/:id/company/employees/:empId', async (req, res, next) => {
  const status = 200
  const { id, empId } = req.params

  const unit = await Units.findById(id).select('-__v')
  if(unit === null) {
    next({ status: 404, message: 'Unit not found'})
  } else if(!unit.company) {
    next({ status: 404, message: 'Company not found. Unit is unoccupied.'})
  } else if(!unit.company.employees.id(empId)) {
    next({ status: 404, message: 'Employee not found.'})
  } else {
    const response = unit.company.employees.id(empId)
    res.json({ status, response })
  }
})

module.exports = router