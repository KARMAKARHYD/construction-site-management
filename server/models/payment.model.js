const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  subcontractor: {
    type: Schema.Types.ObjectId,
    ref: 'Subcontractor',
    required: true
  },
  contract: {
    type: Schema.Types.ObjectId,
    ref: 'Contract',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  paymentType: {
    type: String,
    enum: ['advance', 'milestone', 'final', 'bonus'],
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  site: {
    type: Schema.Types.ObjectId,
    ref: 'Site',
    required: false
  }
}, {
  timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
