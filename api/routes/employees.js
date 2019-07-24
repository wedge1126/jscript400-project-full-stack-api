const router = require('express').Router()
const Units = require('../models/unit')

router.get('/', async (req, res, next) => {
  const status = 200
  const { name, birthday } = req.query

  const query = {
    company: { $exists: true, $ne: null }
  }

  // This will query for companies that have at least one employee that matches the name query
  if(name) { Object.assign(query, {
    $or: [
      {'company.employees.first_name': { $regex: new RegExp(name), $options: 'i' }},
      {'company.employees.last_name': { $regex: new RegExp(name), $options: 'i' }},
    ]
  })}

  if(birthday) { Object.assign(query, {
    'company.employees.birthday': birthday
  })}

  const units = await Units.find(query).select('-__v')
  let response = units.map((unit) => unit.company.employees)
  response = [].concat(...response) // flatten array

  // We need to filter out the employees that don't match the name query
  if(name) {
    response = response.filter(
      (emp) => 
        emp.first_name.toLowerCase().includes(name.toLowerCase()) 
          || emp.last_name.toLowerCase().includes(name.toLowerCase()))
  }

  if(birthday) {
    const birthDate = new Date(birthday)
    response = response.filter( (emp) => emp.birthday ? emp.birthday.getTime() === birthDate.getTime() : false)
  }

  res.json({status, response})
})

module.exports = router