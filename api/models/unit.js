const mongoose = require('mongoose')
const Schema = mongoose.Schema

const unitSchema = new Schema({
  kind: { 
    type: String, 
    required: true, 
    enum: ['seat', 'desk', 'small office', 'large office', 'floor']
  },
  floor: { type: Number, required: true },
  special_monthly_offer: Number,
  company: Schema.Types.ObjectId
}, 
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Units', unitSchema)