const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcontractorSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'onboarding'],
    default: 'onboarding'
  },
  site: {
    type: Schema.Types.ObjectId,
    ref: 'Site',
    required: false // Can be null if not assigned to a specific site yet
  }
}, {
  timestamps: true,
});

const Subcontractor = mongoose.model('Subcontractor', subcontractorSchema);

module.exports = Subcontractor;
