const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
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
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave'],
    required: true
  },
  overtimeHours: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
