
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  pesanan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  metodePembayaran: {
    type: String,
    required: true
  },
  jumlahPembayaran: {
    type: Number,
    required: true
  },
  statusPembayaran: {
    type: String,
    enum: ['Menunggu', 'Berhasil', 'Gagal'],
    default: 'Menunggu'
  },
  tanggalPembayaran: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
