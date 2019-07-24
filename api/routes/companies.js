const router = require('express').Router()
const Units = require('../models/unit')

router.get('/', async (req, res, next) => {
  const status = 200
  const { name, employees_lte, employees_gte } = req.query

  const query = {
    company: { $exists: true, $ne: null }
  }
  if(name) { Object.assign(query, { 'company.name': { $regex: new RegExp(name), $options: 'i' } }) }

  const units = await Units.find(query).select('-__v')
  let response = units.map((unit) => unit.company)

  // filter out companies that don't meet lte and gte constraints
  // Doing this with filter() instead of a Mongo query because 
  // https://docs.mongodb.com/manual/reference/operator/query/size/.
  // It says 
  //     "To select documents based on fields with different numbers of elements, 
  //      create a counter field that you increment when you add elements to a field."
  // A counter field isn't part of this assignment's schema.
  if(employees_lte) {
    response = response.filter((c) => c.employees.length <= employees_lte)
  }
  if(employees_gte) {
    response = response.filter((c) => c.employees.length >= employees_gte)
  }

  res.json({status, response})
})

module.exports = router