
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  produk: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  jumlahStok: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);
