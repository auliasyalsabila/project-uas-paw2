
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Stock = require('../models/stockModel');

exports.getAll = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { user: req.user.id };

    const orders = await Order.find(filter)
      .populate('user', 'nama email')
      .populate('items.produk');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user.id };

    const order = await Order.findOne(filter)
      .populate('items.produk')
      .populate('user', 'nama email');

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const { alamat } = req.body;

    if (!alamat) {
      return res.status(400).json({ message: 'Alamat wajib diisi' });
    }

    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.produk');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Keranjang masih kosong' });
    }

    let totalHarga = 0;
    const orderItems = [];
    const stockUpdates = [];

    for (const item of cart.items) {
      const stock = await Stock.findOne({ produk: item.produk._id });

      if (!stock || stock.jumlahStok < item.jumlah) {
        return res.status(400).json({
          message: `Stok ${item.produk.namaProduk} tidak mencukupi`
        });
      }

      const harga = item.produk.harga;

      totalHarga += harga * item.jumlah;

      orderItems.push({
        produk: item.produk._id,
        jumlah: item.jumlah,
        harga
      });

      stockUpdates.push({ stock, jumlah: item.jumlah });
    }

    for (const update of stockUpdates) {
      update.stock.jumlahStok -= update.jumlah;
      await update.stock.save();
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalHarga,
      alamat
    });

    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [] } }
    );

    res.status(201).json({
      message: 'Checkout berhasil',
      data: order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      'Menunggu Pembayaran',
      'Diproses',
      'Dikirim',
      'Selesai',
      'Dibatalkan'
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: 'Status pesanan tidak valid' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    res.json({
      message: 'Status pesanan berhasil diperbarui',
      data: order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
