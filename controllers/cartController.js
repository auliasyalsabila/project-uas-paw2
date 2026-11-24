
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.produk');

    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const { produk, jumlah } = req.body;

    const productExists = await Product.findById(produk);
    if (!productExists) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    if (!jumlah || jumlah < 1) {
      return res.status(400).json({ message: 'Jumlah tidak valid' });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      item => item.produk.toString() === produk
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].jumlah += jumlah;
    } else {
      cart.items.push({ produk, jumlah });
    }

    await cart.save();

    res.status(201).json({
      message: 'Produk berhasil ditambahkan ke keranjang',
      data: cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Keranjang tidak ditemukan' });
    }

    const item = cart.items.find(
      item => item.produk.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Produk tidak ada di keranjang' });
    }

    const jumlah = Number(req.body.jumlah);

    if (!Number.isInteger(jumlah) || jumlah < 1) {
      return res.status(400).json({ message: 'Jumlah tidak valid' });
    }

    item.jumlah = jumlah;
    await cart.save();

    res.json({
      message: 'Jumlah produk berhasil diperbarui',
      data: cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Keranjang tidak ditemukan' });
    }

    cart.items = cart.items.filter(
      item => item.produk.toString() !== req.params.productId
    );

    await cart.save();

    res.json({
      message: 'Produk berhasil dihapus dari keranjang',
      data: cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
