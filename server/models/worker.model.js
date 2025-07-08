const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workerSchema = new Schema({
  subcontractor: {
    type: Schema.Types.ObjectId,
    ref: 'Subcontractor',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  dailyWage: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true,
});

const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;
