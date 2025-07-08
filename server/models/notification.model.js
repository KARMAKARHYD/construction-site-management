const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['task_assigned', 'task_update', 'material_low_stock', 'payment_due', 'issue_reported'],
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
