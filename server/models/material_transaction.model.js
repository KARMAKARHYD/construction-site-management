const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materialTransactionSchema = new Schema({
  material: {
    type: Schema.Types.ObjectId,
    ref: 'Material',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['in', 'out'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  recordedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issuedTo: {
    type: Schema.Types.ObjectId,
    refPath: 'issuedToModel',
    required: false // Not required for 'in' transactions
  },
  issuedToModel: {
    type: String,
    required: function() { return this.issuedTo !== undefined; },
    enum: ['Subcontractor', 'Worker']
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
});

const MaterialTransaction = mongoose.model('MaterialTransaction', materialTransactionSchema);

module.exports = MaterialTransaction;
