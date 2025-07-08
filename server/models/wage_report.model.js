const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wageReportSchema = new Schema({
  worker: {
    type: Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  subcontractor: {
    type: Schema.Types.ObjectId,
    ref: 'Subcontractor',
    required: true
  },
  dateFrom: {
    type: Date,
    required: true
  },
  dateTo: {
    type: Date,
    required: true
  },
  totalHours: {
    type: Number,
    required: true
  },
  totalOvertimeHours: {
    type: Number,
    default: 0
  },
  totalWage: {
    type: Number,
    required: true
  },
  advances: {
    type: Number,
    default: 0
  },
  netPay: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  }
}, {
  timestamps: true,
});

const WageReport = mongoose.model('WageReport', wageReportSchema);

module.exports = WageReport;
