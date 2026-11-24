
const Transaction = require('../models/transactionModel');
const Order = require('../models/orderModel');

exports.getAll = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate({
        path: 'pesanan',
        populate: { path: 'user', select: 'nama email' }
      });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('pesanan');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.pay = async (req, res) => {
  try {
    const { pesanan, metodePembayaran } = req.body;

    const order = await Order.findById(pesanan);

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    if (
      req.user.role !== 'admin' &&
      order.user.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }

    if (order.status !== 'Menunggu Pembayaran') {
      return res.status(400).json({
        message: 'Pesanan tidak dalam status menunggu pembayaran'
      });
    }

    const existingTransaction = await Transaction.findOne({
      pesanan,
      statusPembayaran: 'Berhasil'
    });

    if (existingTransaction) {
      return res.status(400).json({
        message: 'Pesanan sudah dibayar'
      });
    }

    const transaction = await Transaction.create({
      pesanan,
      metodePembayaran,
      jumlahPembayaran: order.totalHarga,
      statusPembayaran: 'Berhasil',
      tanggalPembayaran: new Date()
    });

    order.status = 'Diproses';
    await order.save();

    res.status(201).json({
      message: 'Simulasi pembayaran berhasil',
      data: transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
