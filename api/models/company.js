const mongoose = require('mongoose')
const Schema = mongoose.Schema

const employeeSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  preferred_name: String,
  position: String,
  birthday: Date,
  email: { type: String, required: true }
}, 
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const companySchema = new Schema({
  name: { type: String, required: true },
  contact_email: { type: String, required: true },
  employees: [employeeSchema]
}, 
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Companies', companySchema)