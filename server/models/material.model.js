const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const materialSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  currentStock: {
    type: Number,
    required: true,
    default: 0
  },
  minStockLevel: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

const Material = mongoose.model('Material', materialSchema);

module.exports = Material;
