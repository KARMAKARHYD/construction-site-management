const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contractSchema = new Schema({
  subcontractor: {
    type: Schema.Types.ObjectId,
    ref: 'Subcontractor',
    required: true
  },
  contractType: {
    type: String,
    required: true,
    enum: ['with_material', 'without_material']
  },
  rate: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  milestones: [{
    description: String,
    dueDate: Date,
    paymentPercentage: Number,
    completed: { type: Boolean, default: false }
  }],
  status: {
    type: String,
    required: true,
    enum: ['active', 'completed', 'terminated'],
    default: 'active'
  }
}, {
  timestamps: true,
});

const Contract = mongoose.model('Contract', contractSchema);

module.exports = Contract;
