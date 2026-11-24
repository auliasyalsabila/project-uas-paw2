
const Stock = require('../models/stockModel');

exports.getAll = async (req, res) => {
  try {
    const stocks = await Stock.find().populate('produk');
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getByProduct = async (req, res) => {
  try {
    const stock = await Stock.findOne({ produk: req.params.productId })
      .populate('produk');

    if (!stock) {
      return res.status(404).json({ message: 'Stok tidak ditemukan' });
    }

    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const existingStock = await Stock.findOne({
      produk: req.body.produk
    });

    if (existingStock) {
      return res.status(400).json({ message: 'Stok produk sudah tersedia' });
    }

    const stock = await Stock.create(req.body);
    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const stock = await Stock.findOneAndUpdate(
      { produk: req.params.productId },
      { jumlahStok: req.body.jumlahStok },
      { new: true, runValidators: true }
    );

    if (!stock) {
      return res.status(404).json({ message: 'Stok tidak ditemukan' });
    }

    res.json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
