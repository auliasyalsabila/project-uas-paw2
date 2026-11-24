
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    produk: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    jumlah: {
      type: Number,
      required: true
    },
    harga: {
      type: Number,
      required: true
    }
  }],
  totalHarga: {
    type: Number,
    required: true
  },
  alamat: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'],
    default: 'Menunggu Pembayaran'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
