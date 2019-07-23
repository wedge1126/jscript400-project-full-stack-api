const mongoose = require('mongoose')
const Schema = mongoose.Schema

const employeeSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  preferred_name: String,
  position: String,
  birthday: Date,
  email: { 
    type: String, 
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  }
}, 
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const companySchema = new Schema({
  name: { type: String, required: true },
  contact_email: { 
    type: String, 
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  employees: [employeeSchema]
}, 
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const unitSchema = new Schema({
  kind: { 
    type: String, 
    required: true, 
    enum: ['seat', 'desk', 'small office', 'large office', 'floor']
  },
  floor: { type: Number, required: true },
  special_monthly_offer: Number,
  company: companySchema
}, 
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Units', unitSchema)