
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  namaProduk: {
    type: String,
    required: true
  },
  deskripsi: {
    type: String
  },
  harga: {
    type: Number,
    required: true
  },
  kategori: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  gambar: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
